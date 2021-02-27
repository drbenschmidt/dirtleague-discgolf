import { ProfileModel } from '@dirtleague/common';
import express, { Router } from 'express';
import RepositoryServices from '../data-access/repositories';
import corsHandler from '../http/cors-handler';

const buildRoute = (services: RepositoryServices): Router => {
  const router = express.Router();

  router.get('/', corsHandler, async (req, res) => {
    const users = await services.profiles.getAll();

    res.json(users);
  });

  router.get('/:id', corsHandler, async (req, res) => {
    const { id } = req.params;
    const user = await services.profiles.get(parseInt(id, 10));

    res.json(user);
  });

  // TODO: add role requirement handler to block for admins only.
  router.post('/', corsHandler, async (req, res) => {
    const body = req.body as ProfileModel;

    const result = await services.profiles.create(body);

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

    res.json(result);
  });

  return router;
};

export default buildRoute;
