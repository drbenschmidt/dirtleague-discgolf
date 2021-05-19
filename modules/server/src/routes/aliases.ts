import { AliasModel, Roles } from '@dirtleague/common';
import express, { Router } from 'express';
import { requireRoles } from '../auth/handler';
import withTryCatch from '../http/withTryCatch';
import withRepositoryServices from '../http/withRepositoryServices';
import toJson from '../utils/toJson';

const buildRoute = (): Router => {
  const router = express.Router();

  router.get(
    '/',
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const users = await services.aliases.getAll();

      res.json(users.map(toJson));
    })
  );

  router.get(
    '/:id',
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;
      const user = await services.aliases.get(parseInt(id, 10));

      res.json(user.toJson());
    })
  );

  router.post(
    '/',
    requireRoles([Roles.PlayerManagement]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const body = new AliasModel(req.body);

      await services.aliases.insert(body);

      res.json(body.toJson());
    })
  );

  router.delete(
    '/:id',
    requireRoles([Roles.PlayerManagement]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;

      await services.aliases.delete(parseInt(id, 10));

      res.json({ success: true });
    })
  );

  router.put(
    '/:id',
    requireRoles([Roles.PlayerManagement]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const body = new AliasModel(req.body);

      await services.aliases.update(body);

      res.json(null);
    })
  );

  return router;
};

export default buildRoute;
