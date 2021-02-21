export default function applyRoute(app, services) {
  app.get('/users', async (req, res) => {
    const users = await services.users.getAll();
  
    res.json(users);
  });
  
  app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = await services.users.get(id);
  
    res.json(user);
  });
};
