import { PlayerModel, Role } from '@dirtleague/common';
import express, { Router } from 'express';
import withTryCatch from '../http/withTryCatch';
import { DirtLeagueRequest, requireRoles } from '../auth/handler';
import withRepositoryServices from '../http/withRepositoryServices';
import toJson from '../utils/toJson';

const buildRoute = (): Router => {
  const router = express.Router();

  const isUserEditingOwn = (req: DirtLeagueRequest) => {
    const { id } = req.params;
    const { user } = req;

    return user.playerId === parseInt(id, 10);
  };

  router.get(
    '/',
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const entities = await services.profiles.getAll();

      res.json(entities.map(toJson));
    })
  );

  router.get(
    '/:id',
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;
      const { include } = req.query;
      const playerId = parseInt(id, 10);
      const entity = await services.profiles.get(playerId);

      if (!entity) {
        res.status(404).json({ error: 'Entity Not Found' });
      }

      // TODO: parse it and check for entity types.
      if (include && entity) {
        const aliases = await services.aliases.getForPlayerId(playerId);

        (entity as any).attributes.aliases = aliases.map(a => a.toJson());

        const ratings = await services.playerRatings.getRunningAverages(
          playerId
        );

        const roundCounts = await services.playerRatings.getRatingCounts(
          playerId
        );

        (entity as any).attributes.stats = {
          roundCounts,
          ratings,
        };
      }

      res.json(entity.toJson());
    })
  );

  router.get(
    '/:id/feed',
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;
      const playerId = parseInt(id, 10);
      const entity = await services.profiles.getFeed(playerId);

      if (!entity) {
        res.status(404).json({ error: 'Entity Not Found' });
      }

      res.json(entity);
    })
  );

  router.post(
    '/',
    requireRoles([Role.PlayerManagement]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const model = new PlayerModel(req.body);

      await services.tx(async tx => {
        await tx.profiles.insert(model);
      });

      res.json(model.toJson());
    })
  );

  router.delete(
    '/:id',
    requireRoles([Role.PlayerManagement]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;

      await services.profiles.delete(parseInt(id, 10));

      res.json({ success: true });
    })
  );

  router.put(
    '/:id',
    requireRoles([Role.PlayerManagement], isUserEditingOwn),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services, body } = req;
      const model = new PlayerModel(body);

      await services.tx(async transaction => {
        await transaction.profiles.update(model);
      });

      res.json(null);
    })
  );

  return router;
};

export default buildRoute;
