import express from 'express';

const buildRoute = (services) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const users = await services.users.getAll();
  
    res.json(users);
  });
  
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await services.users.get(id);
  
    res.json(user);
  });

  return router;
};

export default buildRoute;
