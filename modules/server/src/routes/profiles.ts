import { asyncForEach, ProfileModel } from '@dirtleague/common';
import express, { Router } from 'express';
import { DbAlias } from '../data-access/repositories/aliases';
import RepositoryServices from '../data-access/repository-services';
import corsHandler from '../http/cors-handler';

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

      (entity as ProfileModel).aliases = aliases;
    }

    res.json(entity);
  });

  // TODO: add role requirement handler to block for admins only.
  router.post('/', corsHandler, async (req, res) => {
    const body = req.body as ProfileModel;

    const result = await services.profiles.create(body);

    if (body.aliases) {
      body.aliases.forEach(alias => {
        // eslint-disable-next-line no-param-reassign
        alias.playerId = result.id;
      });

      asyncForEach(body.aliases, async alias => {
        await services.aliases.create(alias as DbAlias);
      });
    }

    res.json(result);
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
      body.aliases.forEach(alias => {
        // eslint-disable-next-line no-param-reassign
        alias.playerId = result.id;
      });

      asyncForEach(body.aliases, async alias => {
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
