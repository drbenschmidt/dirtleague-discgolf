import { PlayerModel, asyncForEach, Roles } from '@dirtleague/common';
import express, { Router } from 'express';
import withTryCatch from '../http/withTryCatch';
import { DirtLeagueRequest, requireRoles } from '../auth/handler';
import { DbAlias } from '../data-access/entity-context/aliases';
import withRepositoryServices from '../http/withRepositoryServices';
import EntityContext from '../data-access/entity-context';

const buildRoute = (): Router => {
  const router = express.Router();

  const isUserEditingOwn = (req: DirtLeagueRequest) => {
    const { id } = req.params;
    const { user } = req;

    return user.id === parseInt(id, 10);
  };

  router.get(
    '/',
    withTryCatch(async (req, res) => {
      const services = EntityContext.CreateFromPool();
      const users = await services.profiles.getAll();

      res.json(users);
    })
  );

  router.get(
    '/:id',
    withTryCatch(async (req, res) => {
      const services = EntityContext.CreateFromPool();
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

        (entity as any).aliases = aliases;

        const ratings = await services.playerRatings.getRunningAverages(
          playerId
        );

        const roundCounts = await services.playerRatings.getRatingCounts(
          playerId
        );

        (entity as any).stats = {
          roundCounts,
          ratings,
        };
      }

      res.json(entity);
    })
  );

  router.get(
    '/:id/feed',
    withTryCatch(async (req, res) => {
      const services = EntityContext.CreateFromPool();
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
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const services = EntityContext.CreateFromPool();
      const model = new PlayerModel(req.body);
      const newId = await services.profiles.insert(model);

      model.id = newId;

      if (model.aliases) {
        // Create each alias if included.
        await asyncForEach(model.aliases.toArray(), async alias => {
          // Make sure the aliases relate to this player.
          // eslint-disable-next-line no-param-reassign
          alias.playerId = newId;

          const aliasJson = alias.toJson();

          const newAliasId = await services.aliases.insert(
            aliasJson as DbAlias
          );

          // eslint-disable-next-line no-param-reassign
          alias.id = newAliasId;
        });
      }

      res.json(model.toJson());
    })
  );

  router.delete(
    '/:id',
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const services = EntityContext.CreateFromPool();
      const { id } = req.params;

      await services.profiles.delete(parseInt(id, 10));

      res.json({ success: true });
    })
  );

  router.patch(
    '/:id',
    requireRoles([Roles.Admin], isUserEditingOwn),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services, body } = req;
      const model = new PlayerModel(body);

      await services.tx(async transaction => {
        await transaction.players.update(model);

        if (model.aliases) {
          await transaction.aliases.updateForPlayer(
            model.id,
            model.aliases.toArray()
          );
        }
      });

      res.json(null);
    })
  );

  return router;
};

export default buildRoute;
