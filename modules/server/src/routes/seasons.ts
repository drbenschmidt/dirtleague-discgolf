import { SeasonModel, Roles } from '@dirtleague/common';
import express, { Router } from 'express';
import { DbSeason } from '../data-access/entity-context/seasons';
import EntityContext from '../data-access/entity-context';
import { requireRoles } from '../auth/handler';
import withTryCatch from '../http/withTryCatch';

const buildRoute = (services: EntityContext): Router => {
  const router = express.Router();

  router.get(
    '/',
    withTryCatch(async (req, res) => {
      const users = await services.seasons.getAll();

      res.json(users);
    })
  );

  router.get(
    '/:id',
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const user = await services.seasons.get(parseInt(id, 10));

      res.json(user);
    })
  );

  router.post(
    '/',
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const body = new SeasonModel(req.body);
      const newId = await services.seasons.insert(body);

      body.id = newId;

      res.json(body.toJson());
    })
  );

  router.delete(
    '/:id',
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const { id } = req.params;

      await services.seasons.delete(parseInt(id, 10));

      res.json({ success: true });
    })
  );

  router.patch(
    '/:id',
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
