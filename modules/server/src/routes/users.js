import express from 'express';
import cors from 'cors';

const corsHandler = cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
});

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
