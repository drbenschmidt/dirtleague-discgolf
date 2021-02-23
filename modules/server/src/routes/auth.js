import express from 'express';
import { requireAuth, authenticate } from '../auth/handler.js';
import { isNil, randomInt, sleep } from '@dirtleague/common';
import cors from 'cors';

const corsHandler = cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
});

const buildRoute = (services) => {
  const router = express.Router();

  router.options(['/', '/test'], corsHandler);

  router.post('/', corsHandler, async (req, res) => {
    const { username, password } = req.body;

    const user = await authenticate(username, password, services);
    
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(() => {
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        res.json({ success: true });
      });
    } else {
      // Add a random sleep into this to prevent someone brute force attacks.
      await sleep(randomInt(1000, 5000));
      res.status(401);
      res.json({ success: false, error: 'Username or password invalid' });
    }
  });

  router.delete('/', async (req, res) => {
    req.session.destroy();
    //res.clearCookie('DIRTY_COOKIE');
    res.json({ success: true });
  });
  
  router.get('/', corsHandler, async (req, res) => {
    const { user } = req.session;

    res.json({
      success: true,
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
