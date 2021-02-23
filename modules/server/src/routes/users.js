import express from 'express';
import corsHandler from '../http/cors-handler.js';

const buildRoute = (services) => {
  const router = express.Router();

  router.get('/', corsHandler, async (req, res) => {
    const users = await services.users.getAll();

    console.log(req.session);
  
    res.json(users);
  });
  
  router.get('/:id', corsHandler, async (req, res) => {
    const { id } = req.params;
    const user = await services.users.get(id);
  
    res.json(user);
  });

  return router;
};

export default buildRoute;
