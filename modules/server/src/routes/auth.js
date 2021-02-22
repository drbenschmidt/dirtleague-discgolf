import express from 'express';
import { requireAuth, authenticate } from '../auth/handler.js';

const isNil = (obj) => obj === null || obj === undefined;

const buildRoute = (services) => {
  const router = express.Router();

  router.post('/', async (req, res) => {
    const { username, password, redirect = '/' } = req.body;

    console.log(`Authenticating ${username}:${password}`);

    const user = await authenticate(username, password, services);
    
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function(){
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        res.redirect(redirect);
      });
    } else {
      // TODO: Add a random timeout to prevent brute force attacks.
      res.status(401);
      res.json({ error: 'Username or password invalid' });
    }
  });
  
  router.get('/debug', async (req, res) => {
    const { user } = req.session;
    console.log(req.session);

    res.json({
      isAuthenticated: (isNil(user) ? false : true)
    });
  });

  router.get('/test', requireAuth, (req, res) => {
    res.json({
      authenticated: true,
    });
  });

  return router;
};

export default buildRoute;
