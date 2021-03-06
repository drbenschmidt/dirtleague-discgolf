import { PlayerModel, asyncForEach, Roles } from '@dirtleague/common';
import express, { Router } from 'express';
import withTryCatch from '../http/withTryCatch';
import { requireRoles } from '../auth/handler';
import { DbAlias } from '../data-access/repositories/aliases';
import RepositoryServices from '../data-access/repository-services';
import corsHandler from '../http/cors-handler';
import getCrud from '../utils/getCrud';

const buildRoute = (services: RepositoryServices): Router => {
  const router = express.Router();

  router.get(
    '/',
    corsHandler,
    withTryCatch(async (req, res) => {
      const users = await services.profiles.getAll();

      res.json(users);
    })
  );

  router.get(
    '/:id',
    corsHandler,
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const { include } = req.query;
      const entity = await services.profiles.get(parseInt(id, 10));

      if (!entity) {
        res.status(404).json({ error: 'Entity Not Found' });
      }

      // TODO: parse it and check for entity types.
      if (include && entity) {
        const aliases = await services.aliases.getForUserId(parseInt(id, 10));

        (entity as any).aliases = aliases;
      }

      res.json(entity);
    })
  );

  router.post(
    '/',
    corsHandler,
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const model = new PlayerModel(req.body);
      const newId = await services.profiles.create(model);

      model.id = newId;

      if (model.aliases) {
        // Create each alias if included.
        await asyncForEach(model.aliases.toArray(), async alias => {
          // Make sure the aliases relate to this player.
          // eslint-disable-next-line no-param-reassign
          alias.playerId = newId;

          const aliasJson = alias.toJson();

          const newAliasId = await services.aliases.create(
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
    corsHandler,
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const { id } = req.params;

      await services.profiles.delete(parseInt(id, 10));

      res.json({ success: true });
    })
  );

  router.patch(
    '/:id',
    corsHandler,
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      // TODO: Technically, this should be a transaction.
      const body = req.body as PlayerModel;

      await services.profiles.update(body);

      if (body.aliases) {
        const requestAliases = Array.from(body.aliases);
        const dbAliases = await services.aliases.getForUserId(body.id);

        const [aliasesToCreate, aliasesToUpdate, aliasesToDelete] = getCrud(
          requestAliases,
          dbAliases
        );

        await asyncForEach(aliasesToCreate, async alias => {
          // eslint-disable-next-line no-param-reassign
          alias.playerId = body.id;

          await services.aliases.create(alias);
        });

        await asyncForEach(aliasesToUpdate, async alias => {
          await services.aliases.update(alias);
        });

        await asyncForEach(aliasesToDelete, async alias => {
          await services.aliases.delete(alias.id);
        });
      }

      res.json(null);
    })
  );

  return router;
};

export default buildRoute;
