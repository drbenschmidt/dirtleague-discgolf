import { AliasModel, Roles } from '@dirtleague/common';
import express, { Router } from 'express';
import { DbAlias } from '../data-access/repositories/aliases';
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
      const users = await services.aliases.getAll();

      res.json(users);
    })
  );

  router.get(
    '/:id',
    corsHandler,
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const user = await services.aliases.get(parseInt(id, 10));

      res.json(user);
    })
  );

  router.post(
    '/',
    corsHandler,
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const body = new AliasModel(req.body);
      const newId = await services.aliases.create(body);

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

      await services.aliases.delete(parseInt(id, 10));

      res.json({ success: true });
    })
  );

  router.patch(
    '/:id',
    corsHandler,
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const body = req.body as DbAlias;

      await services.aliases.update(body);

      res.json(null);
    })
  );

  return router;
};

export default buildRoute;
