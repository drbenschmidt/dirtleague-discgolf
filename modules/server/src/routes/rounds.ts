import { RoundModel, Roles, asyncForEach } from '@dirtleague/common';
import express, { Router } from 'express';
import { DbRound } from '../data-access/repositories/rounds';
import RepositoryServices from '../data-access/repository-services';
import corsHandler from '../http/cors-handler';
import { requireRoles } from '../auth/handler';
import withTryCatch from '../http/withTryCatch';

// TODO: Move to common.
const sum = (arr: number[]): number => arr.reduce((acc, curr) => curr + acc, 0);

const calculateRating = (totalScore: number, dgcrSse: number) => {
  const diff = dgcrSse - totalScore;
  const multiplier = 1000 / dgcrSse;
  return Math.round(1000 + diff * multiplier);
};

const buildRoute = (services: RepositoryServices): Router => {
  const router = express.Router();

  router.get(
    '/',
    corsHandler,
    withTryCatch(async (req, res) => {
      const entities = await services.rounds.getAll();

      res.json(entities);
    })
  );

  router.get(
    '/:id',
    corsHandler,
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const entity = await services.rounds.get(parseInt(id, 10));

      res.json(entity);
    })
  );

  router.post(
    '/',
    corsHandler,
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const body = new RoundModel(req.body);
      const newId = await services.rounds.create(body);

      body.id = newId;

      res.json(body.toJson());
    })
  );

  router.delete(
    '/:id',
    corsHandler,
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const { id } = req.params;

      await services.rounds.delete(parseInt(id, 10));

      res.json({ success: true });
    })
  );

  router.patch(
    '/:id',
    corsHandler,
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const body = req.body as DbRound;

      await services.rounds.update(body);

      res.json(null);
    })
  );

  router.get(
    '/:id/complete',
    corsHandler,
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const round = await services.rounds.get(parseInt(id, 10));
      const courseLayout = await services.courseLayouts.get(
        round.courseLayoutId
      );

      round.isComplete = true;

      await services.rounds.update(round);

      // Go through each player card for this round
      const cards = await services.cards.getForRound(round.id);
      await asyncForEach(cards, async card => {
        // and get each player group on each card.
        const playerGroups = await services.playerGroups.getForCard(card.id);
        // and then each player(s) for the groups.
        await asyncForEach(playerGroups, async playerGroup => {
          const results = await services.playerGroupResults.getAllForGroup(
            playerGroup.id
          );

          const totalScore = sum(results.map(r => r.score));
          const { dgcrSse } = courseLayout;
          const rating = calculateRating(totalScore, dgcrSse);

          const players = await services.playerGroupPlayers.getForPlayerGroup(
            playerGroup.id
          );
          const playerIds = players.map(p => p.playerId);

          await asyncForEach(playerIds, async playerId => {
            await services.playerRatings.create({
              playerId,
              cardId: card.id,
              date: new Date(), // TODO: Get from round?
              rating,
            });
          });
        });
      });

      res.json({ success: true });
    })
  );

  return router;
};

export default buildRoute;
