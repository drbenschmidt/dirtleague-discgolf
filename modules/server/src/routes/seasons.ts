import { SeasonModel, Roles } from '@dirtleague/common';
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
      const entities = await services.seasons.getAll();

      res.json(entities.map(toJson));
    })
  );

  router.get(
    '/:id',
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;
      const entity = await services.seasons.get(parseInt(id, 10));

      res.json(entity.toJson());
    })
  );

  router.post(
    '/',
    requireRoles([Roles.SeasonManagement]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const body = new SeasonModel(req.body);

      await services.seasons.insert(body);

      res.json(body.toJson());
    })
  );

  router.delete(
    '/:id',
    requireRoles([Roles.SeasonManagement]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;

      await services.seasons.delete(parseInt(id, 10));

      res.json({ success: true });
    })
  );

  router.put(
    '/:id',
    requireRoles([Roles.SeasonManagement]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const body = new SeasonModel(req.body);

      await services.seasons.update(body);

      res.json(null);
    })
  );

  return router;
};

export default buildRoute;
