import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { randomInt, sleep } from '@dirtleague/common';
import { authenticate } from '../auth/handler';
import corsHandler from '../http/cors-handler';
import RepositoryServices from '../data-access/repository-services';

interface RequestWithToken extends Request {
  token: string;
}

const buildRoute = (services: RepositoryServices): Router => {
  const router = express.Router();

  router.post('/', corsHandler, async (req, res) => {
    const { email, password } = req.body;

    const user = await authenticate(email, password, services);

    if (user) {
      // TODO: Make secret key configurable or use certificate.
      jwt.sign(
        { user },
        'secretkey',
        (error: Error | null, token: string | null) => {
          if (error) {
            res.status(500).json({
              success: false,
              error,
            });
          }

          res.json({
            success: true,
            token,
            user,
          });
        }
      );
    } else {
      // Add a random sleep into this to prevent someone brute force attacks.
      await sleep(randomInt(1000, 5000));
      res.status(401);
      res.json({ success: false, error: 'Username or password invalid' });
    }
  });

  // NOTE: This doesn't use requireToken because it's supposed to respond to anonymous requests.
  router.get('/', corsHandler, async (req: RequestWithToken, res: Response) => {
    jwt.verify(req.token, 'secretkey', (error, userData) => {
      if (error) {
        res.status(403).json({
          success: true,
          isAuthenticated: false,
          error,
        });
      } else {
        res.status(200).json({
          success: true,
          isAuthenticated: true,
          userData,
        });
      }
    });
  });

  return router;
};

export default buildRoute;
