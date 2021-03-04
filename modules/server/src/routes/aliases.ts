import { Roles } from '@dirtleague/common';
import express, { Router } from 'express';
import { DbAlias } from '../data-access/repositories/aliases';
import RepositoryServices from '../data-access/repository-services';
import corsHandler from '../http/cors-handler';
import { requireRoles } from '../auth/handler';

const buildRoute = (services: RepositoryServices): Router => {
  const router = express.Router();

  router.get('/', corsHandler, async (req, res) => {
    const users = await services.aliases.getAll();

    res.json(users);
  });

  router.get('/:id', corsHandler, async (req, res) => {
    const { id } = req.params;
    const user = await services.aliases.get(parseInt(id, 10));

    res.json(user);
  });

  router.post(
    '/',
    corsHandler,
    requireRoles([Roles.Admin]),
    async (req, res) => {
      const body = req.body as DbAlias;

      const result = await services.aliases.create(body);

      res.json(result);
    }
  );

  router.delete(
    '/:id',
    corsHandler,
    requireRoles([Roles.Admin]),
    async (req, res) => {
      const { id } = req.params;

      await services.aliases.delete(parseInt(id, 10));

      res.json({ success: true });
    }
  );

  router.patch(
    '/:id',
    corsHandler,
    requireRoles([Roles.Admin]),
    async (req, res) => {
      const body = req.body as DbAlias;

      const result = await services.aliases.update(body);

      res.json(result);
    }
  );

  return router;
};

export default buildRoute;
