import { RoundModel, Role } from '@dirtleague/common';
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
    requireRoles([Role.RoundManagement]),
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
    requireRoles([Role.RoundManagement]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;

      await services.rounds.delete(parseInt(id, 10));

      res.json({ success: true });
    })
  );

  router.put(
    '/:id',
    requireRoles([Role.RoundManagement]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const body = new RoundModel(req.body);

      await services.rounds.update(body);

      res.json(null);
    })
  );

  router.post(
    '/:id/complete',
    requireRoles([Role.RoundManagement]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;
      const round = await services.rounds.get(parseInt(id, 10));

      await services.tx(async tx => {
        await tx.rounds.patch(round.id, { isComplete: true });
        await tx.cards.onRoundComplete(round);
      });

      res.json({ success: true });
    })
  );

  return router;
};

export default buildRoute;
