import { RoundModel, Roles } from '@dirtleague/common';
import express, { Router } from 'express';
import { DbRound } from '../data-access/repositories/rounds';
import RepositoryServices from '../data-access/repository-services';
import corsHandler from '../http/cors-handler';
import { requireRoles } from '../auth/handler';
import withTryCatch from '../http/withTryCatch';

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

      round.isComplete = true;

      await services.rounds.update(round);

      res.json({ success: true });
    })
  );

  return router;
};

export default buildRoute;
