import {
  RoundModel,
  Roles,
  asyncForEach,
  RatingType,
  sum,
} from '@dirtleague/common';
import express, { Router } from 'express';
import { DbRound } from '../data-access/entity-context/rounds';
import { requireRoles } from '../auth/handler';
import withTryCatch from '../http/withTryCatch';
import calculateRating from '../utils/calculateRating';
import withRepositoryServices from '../http/withRepositoryServices';
import toJson from '../utils/toJson';

const buildRoute = (): Router => {
  const router = express.Router();

  router.get(
    '/',
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const entities = await services.rounds.getAll();

      res.json(entities.map(toJson));
    })
  );

  router.get(
    '/:id',
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;
      const entity = await services.rounds.get(parseInt(id, 10));

      res.json(entity);
    })
  );

  router.post(
    '/',
    requireRoles([Roles.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const body = new RoundModel(req.body);

      await services.rounds.insert(body);

      res.json(body.toJson());
    })
  );

  router.delete(
    '/:id',
    requireRoles([Roles.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;

      await services.rounds.delete(parseInt(id, 10));

      res.json({ success: true });
    })
  );

  router.patch(
    '/:id',
    requireRoles([Roles.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const body = new RoundModel(req.body);

      await services.rounds.update(body);

      res.json(null);
    })
  );

  // TODO: Why is this a get? Should be POST.
  router.get(
    '/:id/complete',
    requireRoles([Roles.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;
      const round = await services.rounds.get(parseInt(id, 10));

      round.isComplete = true;

      await services.tx(async tx => {
        await tx.rounds.update(round);
        await tx.cards.onRoundComplete(round);
      });

      res.json({ success: true });
    })
  );

  return router;
};

export default buildRoute;
