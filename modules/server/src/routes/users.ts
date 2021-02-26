import express from 'express';
import RepositoryServices from '../data-access/repositories';
import corsHandler from '../http/cors-handler';

const buildRoute = (services: RepositoryServices) => {
  const router = express.Router();

  router.get('/', corsHandler, async (req, res) => {
    const users = await services.users.getAll();

    res.json(users);
  });

  router.get('/:id', corsHandler, async (req, res) => {
    const { id } = req.params;
    const user = await services.users.get(parseInt(id, 10));

    res.json(user);
  });

  return router;
};

export default buildRoute;
