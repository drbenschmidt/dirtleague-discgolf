/* eslint-disable no-param-reassign */
import { asyncForEach, Roles, EventModel } from '@dirtleague/common';
import express, { Router } from 'express';
import withTryCatch from '../http/withTryCatch';
import { requireRoles } from '../auth/handler';
import RepositoryServices from '../data-access/repository-services';
import corsHandler from '../http/cors-handler';
import { DbRound } from '../data-access/repositories/rounds';
import { DbCard } from '../data-access/repositories/cards';
import { DbPlayerGroup } from '../data-access/repositories/player-groups';
import { DbPlayerGroupPlayer } from '../data-access/repositories/player-group-players';

const buildRoute = (services: RepositoryServices): Router => {
  const router = express.Router();

  router.get(
    '/',
    corsHandler,
    withTryCatch(async (req, res) => {
      const users = await services.events.getAll();

      res.json(users);
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
          const cards = await services.cards.getForRound(round.id);

          (round as any).cards = cards;

          await asyncForEach(cards, async card => {
            const playerGroups = await services.playerGroups.getForCard(
              card.id
            );

            (card as any).playerGroups = playerGroups;

            await asyncForEach(playerGroups, async playerGroup => {
              const playerGroupPlayers = await services.playerGroupPlayers.getForPlayerGroup(
                playerGroup.id
              );

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
        await asyncForEach(model.rounds.toArray(), async round => {
          // Each round has to be tied into this event.
          round.eventId = newId;

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

            // TODO: rename to playerGroups
            await asyncForEach(
              card.playerGroups.toArray(),
              async playerGroup => {
                playerGroup.cardId = newCardId;

                const playerGroupJson = playerGroup.toJson();
                const newPlayerGroupId = await services.playerGroups.create(
                  playerGroupJson as DbPlayerGroup
                );

                playerGroup.id = newPlayerGroupId;
                playerGroupJson.id = newPlayerGroupId;

                await asyncForEach(
                  playerGroup.players.toArray(),
                  async player => {
                    player.playerGroupId = newPlayerGroupId;

                    const playerJson = player.toJson();

                    await services.playerGroupPlayers.create(
                      playerJson as DbPlayerGroupPlayer
                    );
                  }
                );
              }
            );
          });
        });
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
      const body = req.body as EventModel;

      await services.events.update(body);

      /*
      if (body.layouts) {
        const requestLayouts = Array.from(body.layouts);
        const dbLayouts = await services.courseLayouts.getAllForCourse(body.id);

        const [layoutsToCreate, layoutsToUpdate, layoutsToDelete] = getCrud(
          requestLayouts,
          dbLayouts
        );

        await asyncForEach(layoutsToCreate, async entity => {
          // eslint-disable-next-line no-param-reassign
          entity.courseId = body.id;
          const layoutJson = entity.toJson();

          const newLayoutId = await services.courseLayouts.create(
            layoutJson as DbCourseLayout
          );

          // eslint-disable-next-line no-param-reassign
          entity.id = newLayoutId;
          layoutJson.id = newLayoutId;

          await asyncForEach(entity.holes.toArray(), async hole => {
            // eslint-disable-next-line no-param-reassign
            hole.courseLayoutId = newLayoutId;

            const holeJson = hole.toJson();

            await services.courseHoles.create(holeJson as DbCourseHole);
          });
        });

        await asyncForEach(layoutsToUpdate, async entity => {
          await services.courseLayouts.update(entity);

          const dbHoles = await services.courseHoles.getAllForCourseLayout(
            entity.id
          );

          const [holesToCreate, holesToUpdate, holesToDelete] = getCrud(
            Array.from(entity.holes),
            dbHoles
          );

          await asyncForEach(holesToCreate, async hole => {
            // eslint-disable-next-line no-param-reassign
            hole.courseLayoutId = entity.id;

            await services.courseHoles.create(hole);
          });

          await asyncForEach(holesToUpdate, async hole => {
            await services.courseHoles.update(hole);
          });

          await asyncForEach(holesToDelete, async hole => {
            await services.courseHoles.delete(hole.id);
          });
        });

        await asyncForEach(layoutsToDelete, async entity => {
          await services.courseLayouts.delete(entity.id);
        });
      }
      */

      res.json(null);
    })
  );

  return router;
};

export default buildRoute;
