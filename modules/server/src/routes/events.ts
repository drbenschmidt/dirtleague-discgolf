/* eslint-disable no-param-reassign */
import {
  asyncForEach,
  Roles,
  EventModel,
  RoundModel,
} from '@dirtleague/common';
import multer from 'multer';
import express, { Router } from 'express';
import withTryCatch from '../http/withTryCatch';
import { requireRoles } from '../auth/handler';
import EntityContext from '../data-access/entity-context';
import { DbRound } from '../data-access/entity-context/rounds';
import { DbCard } from '../data-access/entity-context/cards';
import { DbPlayerGroup } from '../data-access/entity-context/player-groups';
import { DbPlayerGroupPlayer } from '../data-access/entity-context/player-group-players';
import getCrud from '../utils/getCrud';
import parseUDisc from '../utils/parseUdisc';

const createRounds = async (
  rounds: RoundModel[],
  newEventId: number,
  services: EntityContext
) => {
  await asyncForEach(rounds, async round => {
    // Each round has to be tied into this event.
    round.eventId = newEventId;

    const roundJson = round.toJson();
    const newRoundId = await services.rounds.insert(roundJson as DbRound);

    round.id = newRoundId;
    roundJson.id = newRoundId;

    await asyncForEach(round.cards.toArray(), async card => {
      card.roundId = newRoundId;

      const cardJson = card.toJson();
      const newCardId = await services.cards.insert(cardJson as DbCard);

      card.id = newCardId;
      cardJson.id = newCardId;

      await asyncForEach(card.playerGroups.toArray(), async playerGroup => {
        playerGroup.cardId = newCardId;

        const playerGroupJson = playerGroup.toJson();
        const newPlayerGroupId = await services.playerGroups.insert(
          playerGroupJson as DbPlayerGroup
        );

        playerGroup.id = newPlayerGroupId;
        playerGroupJson.id = newPlayerGroupId;

        await asyncForEach(playerGroup.players.toArray(), async player => {
          player.playerGroupId = newPlayerGroupId;

          const playerJson = player.toJson();

          await services.playerGroupPlayers.insert(
            playerJson as DbPlayerGroupPlayer
          );
        });
      });
    });
  });
};

const buildRoute = (services: EntityContext): Router => {
  const router = express.Router();

  const storage = multer.memoryStorage();
  const csvUpload = multer({ storage });

  router.get(
    '/',
    withTryCatch(async (req, res) => {
      const entities = await services.events.getAll();

      res.json(entities);
    })
  );

  router.get(
    '/:id',
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const { include } = req.query;
      const entity = await services.events.get(parseInt(id, 10));

      if (!entity) {
        res.status(404).json({ error: 'Entity Not Found' });
      }

      // TODO: parse it and check for entity types.
      if (include && entity) {
        const rounds = await services.rounds.getAllForEvent(parseInt(id, 10));

        (entity as any).rounds = rounds;

        await asyncForEach(rounds, async round => {
          // TODO: Check for including course and layout info.
          const course = await services.courses.get(round.courseId);
          const layout = await services.courseLayouts.get(round.courseLayoutId);
          const layoutHoles = await services.courseHoles.getAllForCourseLayout(
            round.courseLayoutId
          );
          const cards = await services.cards.getForRound(round.id);

          (round as any).cards = cards;
          (round as any).course = course;
          (round as any).courseLayout = layout;
          (round as any).courseLayout.holes = layoutHoles;

          await asyncForEach(cards, async card => {
            const playerGroups = await services.playerGroups.getForCard(
              card.id
            );

            (card as any).playerGroups = playerGroups;

            await asyncForEach(playerGroups, async playerGroup => {
              const playerGroupPlayers = await services.playerGroupPlayers.getForPlayerGroup(
                playerGroup.id
              );

              // TODO: Check for includes and get player info.
              await asyncForEach(playerGroupPlayers, async player => {
                const dbPlayer = await services.profiles.get(player.playerId);
                const dbRating = await services.playerRatings.getForPlayerCardId(
                  player.playerId,
                  card.id
                );

                (player as any).player = dbPlayer;

                if (dbPlayer && dbRating) {
                  (player as any).rating = dbRating.rating;
                }
              });

              (playerGroup as any).players = playerGroupPlayers;

              // TODO: Check for results and include.
              const results = await services.playerGroupResults.getAllForGroup(
                playerGroup.id
              );

              (playerGroup as any).results = results;
            });
          });
        });
      }

      res.json(entity);
    })
  );

  router.post(
    '/',
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const model = new EventModel(req.body);
      const newId = await services.events.insert(model);

      model.id = newId;

      if (model.rounds) {
        // Create each round if included.
        await createRounds(model.rounds.toArray(), newId, services);
      }

      res.json(model.toJson());
    })
  );

  router.put(
    '/:id/card/:cardId/upload',
    requireRoles([Roles.Admin]),
    csvUpload.single('csv'),
    withTryCatch(async (req, res) => {
      const { id, cardId } = req.params;
      const { user } = req;
      const csvData = req.file.buffer.toString('utf8');
      const scores = parseUDisc(csvData);
      const playerGroups = await services.playerGroups.getForCard(
        parseInt(cardId, 10)
      );
      const card = await services.cards.get(parseInt(cardId, 10));
      const round = await services.rounds.get(card.roundId);
      const holes = await services.courseHoles.getAllForCourseLayout(
        round.courseLayoutId
      );

      const getHole = (n: number) => holes.find(h => h.number === n);

      // Look through each player group...
      await asyncForEach(playerGroups, async playerGroup => {
        const possibleNames = new Array<string>();

        // For possible names that could be on the uploaded card.
        if (playerGroup.teamName) {
          possibleNames.push(playerGroup.teamName.toLowerCase());
        }

        const dbPlayers = await services.playerGroupPlayers.getForPlayerGroup(
          playerGroup.id
        );

        // Each player group has players, and those have aliases.
        await asyncForEach(dbPlayers, async dbPlayer => {
          const player = await services.profiles.get(dbPlayer.playerId);

          // eslint-disable-next-line prettier/prettier
          possibleNames.push(
            `${player.firstName.toLowerCase()} ${player.lastName.toLowerCase()}`
          );

          const aliases = await services.aliases.getForPlayerId(player.id);

          possibleNames.push(...aliases.map(a => a.value.toLowerCase()));
        });

        // And with that array, we can look through the scores to find a match.
        const match = scores.find(f =>
          possibleNames.includes(f.name.toLowerCase())
        );

        if (match) {
          // Remove any results that we may already have, in the event someone fixes a card.
          await services.playerGroupResults.deleteAllForGroup(playerGroup.id);

          // Loop through the uDisc scores and add them to the db!
          await asyncForEach(match.scores, async uDiscScore => {
            await services.playerGroupResults.insert({
              playerGroupId: playerGroup.id,
              courseHoleId: getHole(uDiscScore.number).id,
              score: uDiscScore.score,
            });
          });
        }
      });

      // Update the card with the userId of who just uploaded this card.
      card.authorId = user.id;
      await services.cards.update(card);

      res.json({ success: true, scores });
    })
  );

  router.delete(
    '/:id',
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const entityId = parseInt(id, 10);

      await services.events.delete(entityId);

      res.json({ success: true });
    })
  );

  router.patch(
    '/:id',
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      // TODO: Technically, this should be a transaction.
      const model = new EventModel(req.body);

      await services.events.update(model);

      if (model.rounds) {
        const requestRounds = model.rounds.toArray();
        const dbRounds = await services.rounds.getAllForEvent(model.id);

        const [roundsToCreate, roundsToUpdate, roundsToDelete] = getCrud(
          requestRounds,
          dbRounds
        );

        await createRounds(roundsToCreate, model.id, services);

        await asyncForEach(roundsToUpdate, async round => {
          await services.rounds.update(round);

          const cards = await services.cards.getForRound(round.id);

          const [cardsToCreate, cardsToUpdate, cardsToDelete] = getCrud(
            round.cards.toArray(),
            cards
          );

          await asyncForEach(cardsToCreate, async card => {
            card.roundId = round.id;

            const newCardId = await services.cards.insert(card);

            await asyncForEach(
              card.playerGroups.toArray(),
              async playerGroup => {
                playerGroup.cardId = newCardId;

                const newPlayerGroupId = await services.playerGroups.insert(
                  playerGroup
                );

                await asyncForEach(
                  playerGroup.players.toArray(),
                  async player => {
                    player.playerGroupId = newPlayerGroupId;

                    await services.playerGroupPlayers.insert(player);
                  }
                );
              }
            );
          });

          await asyncForEach(cardsToUpdate, async card => {
            await services.cards.update(card);

            await asyncForEach(
              card.playerGroups.toArray(),
              async playerGroup => {
                await services.playerGroups.update(playerGroup);

                // NOTE: Since it's a join table, we just delete the previous values
                // and add them again.
                await services.playerGroupPlayers.deleteForPlayerGroup(
                  playerGroup.id
                );

                await asyncForEach(
                  playerGroup.players.toArray(),
                  async player => {
                    player.playerGroupId = playerGroup.id;

                    await services.playerGroupPlayers.insert(player);
                  }
                );
              }
            );
          });

          await asyncForEach(cardsToDelete, async card => {
            // TODO: setup cascading deletes after schema is finalized.
            await services.cards.delete(card.id);
          });
        });

        await asyncForEach(roundsToDelete, async round => {
          // TODO: setup cascading deletes after schema is finalized.
          await services.rounds.delete(round.id);
        });
      }

      res.json(null);
    })
  );

  return router;
};

export default buildRoute;
