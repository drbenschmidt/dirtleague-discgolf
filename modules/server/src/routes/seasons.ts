import { SeasonModel, Roles } from '@dirtleague/common';
import express, { Router } from 'express';
import { DbSeason } from '../data-access/repositories/seasons';
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
      const users = await services.seasons.getAll();

      res.json(users);
    })
  );

  router.get(
    '/:id',
    corsHandler,
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const user = await services.seasons.get(parseInt(id, 10));

      res.json(user);
    })
  );

  router.post(
    '/',
    corsHandler,
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const body = new SeasonModel(req.body);
      const newId = await services.seasons.create(body);

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

      await services.seasons.delete(parseInt(id, 10));

      res.json({ success: true });
    })
  );

  router.patch(
    '/:id',
    corsHandler,
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const body = req.body as DbSeason;

      await services.seasons.update(body);

      res.json(null);
    })
  );

  return router;
};

export default buildRoute;
