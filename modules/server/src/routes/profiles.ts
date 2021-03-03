import { isNil, ProfileModel } from '@dirtleague/common';
import express, { Router } from 'express';
import { DbAlias } from '../data-access/repositories/aliases';
import RepositoryServices from '../data-access/repository-services';
import corsHandler from '../http/cors-handler';

const intersect = <T>(left: T[], right: T[]) => {
  return left.filter(l => right.includes(l));
};

const except = <T>(left: T[], right: T[]) => {
  return left.filter(l => !right.includes(l));
};

const buildRoute = (services: RepositoryServices): Router => {
  const router = express.Router();

  router.get('/', corsHandler, async (req, res) => {
    const users = await services.profiles.getAll();

    res.json(users);
  });

  router.get('/:id', corsHandler, async (req, res) => {
    const { id } = req.params;
    const { include } = req.query;
    const entity = await services.profiles.get(parseInt(id, 10));

    // TODO: parse it and check for entity types.
    if (include) {
      const aliases = await services.aliases.getForUserId(parseInt(id, 10));

      (entity as any).aliases = aliases;
    }

    res.json(entity);
  });

  // TODO: add role requirement handler to block for admins only.
  router.post('/', corsHandler, async (req, res) => {
    const model = new ProfileModel(req.body);

    // TODO: create should only return an ID.
    const result = await services.profiles.create(model);

    model.id = result.id;

    if (model.aliases) {
      // Create each alias if included.
      model.aliases.asyncForEach(async alias => {
        // Make sure the aliases relate to this player.
        // eslint-disable-next-line no-param-reassign
        alias.playerId = result.id;

        const dbAlias = await services.aliases.create(alias as DbAlias);
        // eslint-disable-next-line no-param-reassign
        alias.id = dbAlias.id;
      });
    }

    res.json(model.toJson());
  });

  router.delete('/:id', corsHandler, async (req, res) => {
    const { id } = req.params;

    await services.profiles.delete(parseInt(id, 10));

    res.json({ success: true });
  });

  router.patch('/:id', corsHandler, async (req, res) => {
    const body = req.body as ProfileModel;

    const result = await services.profiles.update(body);

    if (body.aliases) {
      const requestAliases = Array.from(body.aliases);

      // TODO: Figure out what ones were deleted.
      const dbAliases = await services.aliases.getForUserId(body.id);
      const dbAliasIds = dbAliases.map(a => a.id);

      // TODO: mapReact instead of map?!
      const payloadAliasIds = requestAliases.map(a => a.id);
      const aliasesToCreate = requestAliases.filter(a => isNil(a.id));
      const aliasesToUpdate = intersect(dbAliasIds, payloadAliasIds);
      const aliasesToDelete = except(dbAliasIds, payloadAliasIds);

      body.aliases.forEach(alias => {
        // eslint-disable-next-line no-param-reassign
        alias.playerId = result.id;
      });

      // TODO: Write methods to loop through and update.
      // TODO: Write methods to bulk delete by ID.
      // TODO: Write method to loop and create.

      body.aliases.asyncForEach(async alias => {
        if (alias.id) {
          await services.aliases.update(alias as DbAlias);
        } else {
          await services.aliases.create(alias as DbAlias);
        }
      });
    }

    res.json(result);
  });

  return router;
};

export default buildRoute;
