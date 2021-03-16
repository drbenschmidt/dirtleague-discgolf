/* eslint-disable no-param-reassign */
import {
  asyncForEach,
  Roles,
  EventModel,
  RoundModel,
} from '@dirtleague/common';
import express, { Router } from 'express';
import withTryCatch from '../http/withTryCatch';
import { requireRoles } from '../auth/handler';
import RepositoryServices from '../data-access/repository-services';
import corsHandler from '../http/cors-handler';
import { DbRound } from '../data-access/repositories/rounds';
import { DbCard } from '../data-access/repositories/cards';
import { DbPlayerGroup } from '../data-access/repositories/player-groups';
import { DbPlayerGroupPlayer } from '../data-access/repositories/player-group-players';
import getCrud from '../utils/getCrud';

const createRounds = async (
  rounds: RoundModel[],
  newEventId: number,
  services: RepositoryServices
) => {
  await asyncForEach(rounds, async round => {
    // Each round has to be tied into this event.
    round.eventId = newEventId;

    const roundJson = round.toJson();
    const newRoundId = await services.rounds.create(roundJson as DbRound);

    round.id = newRoundId;
    roundJson.id = newRoundId;

    await asyncForEach(round.cards.toArray(), async card => {
      card.roundId = newRoundId;

      const cardJson = card.toJson();
      const newCardId = await services.cards.create(cardJson as DbCard);

      card.id = newCardId;
      cardJson.id = newCardId;

      await asyncForEach(card.playerGroups.toArray(), async playerGroup => {
        playerGroup.cardId = newCardId;

        const playerGroupJson = playerGroup.toJson();
        const newPlayerGroupId = await services.playerGroups.create(
          playerGroupJson as DbPlayerGroup
        );

        playerGroup.id = newPlayerGroupId;
        playerGroupJson.id = newPlayerGroupId;

        await asyncForEach(playerGroup.players.toArray(), async player => {
          player.playerGroupId = newPlayerGroupId;

          const playerJson = player.toJson();

          await services.playerGroupPlayers.create(
            playerJson as DbPlayerGroupPlayer
          );
        });
      });
    });
  });
};

const buildRoute = (services: RepositoryServices): Router => {
  const router = express.Router();

  router.get(
    '/',
    corsHandler,
    withTryCatch(async (req, res) => {
      const entities = await services.events.getAll();

      res.json(entities);
    })
  );

  router.get(
    '/:id',
    corsHandler,
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
          const cards = await services.cards.getForRound(round.id);

          (round as any).cards = cards;
          (round as any).course = course;
          (round as any).courseLayout = layout;

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

              (playerGroup as any).players = playerGroupPlayers;
            });
          });
        });
      }

      res.json(entity);
    })
  );

  router.post(
    '/',
    corsHandler,
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const model = new EventModel(req.body);
      const newId = await services.events.create(model);

      model.id = newId;

      if (model.rounds) {
        // Create each round if included.
        await createRounds(model.rounds.toArray(), newId, services);
      }

      res.json(model.toJson());
    })
  );

  router.delete(
    '/:id',
    corsHandler,
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
    corsHandler,
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

            const newCardId = await services.cards.create(card);

            await asyncForEach(
              card.playerGroups.toArray(),
              async playerGroup => {
                playerGroup.cardId = newCardId;

                const newPlayerGroupId = await services.playerGroups.create(
                  playerGroup
                );

                await asyncForEach(
                  playerGroup.players.toArray(),
                  async player => {
                    player.playerGroupId = newPlayerGroupId;

                    await services.playerGroupPlayers.create(player);
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
                    await services.playerGroupPlayers.create(player);
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
