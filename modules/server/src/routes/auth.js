import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../auth/handler.js';
import { randomInt, sleep } from '@dirtleague/common';
import cors from 'cors';

const corsHandler = cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
});

const buildRoute = (services) => {
  const router = express.Router();

  router.post('/', corsHandler, async (req, res) => {
    const { username, password } = req.body;

    const user = await authenticate(username, password, services);
    
    if (user) {
      // TODO: Remove private user props
      // TODO: Make secret key configurable or use certificate.
      jwt.sign({ user }, 'secretkey', (error, token) => {
        if (error) {
          res.status(500).json({
            success: false,
            error,
          });
        }

        res.json({
            success: true,
            token
        });
      });
    } else {
      // Add a random sleep into this to prevent someone brute force attacks.
      await sleep(randomInt(1000, 5000));
      res.status(401);
      res.json({ success: false, error: 'Username or password invalid' });
    }
  });
  
  // NOTE: This doesn't use requireToken because it's supposed to respond to anonymous requests.
  router.get('/', corsHandler, async (req, res) => {
    jwt.verify(req.token, 'secretkey', (error, authData) => {
      if (error) {
        res.status(403)
          .json({
            success: true,
            isAuthenticated: false,
            error,
          });
      } else {
        res.status(200)
          .json({
            success: true,
            isAuthenticated: true,
            userData: authData
          });
      }
    });
  });

  return router;
};

export default buildRoute;
