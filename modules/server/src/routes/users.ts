import { PlayerModel, Roles, UserModel } from '@dirtleague/common';
import express, { Router } from 'express';
import withTryCatch from '../http/withTryCatch';
import RepositoryServices from '../data-access/repository-services';
import corsHandler from '../http/cors-handler';
import hashPassword from '../crypto/hash';
import { requireRoles } from '../auth/handler';

export interface NewUserRequest {
  user: UserModel;
  player: PlayerModel;
}

const buildRoute = (services: RepositoryServices): Router => {
  const router = express.Router();

  router.get(
    '/',
    withTryCatch(async (req, res) => {
      const users = await services.users.getAll();

      res.json(users);
    })
  );

  router.get(
    '/:id',
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const user = await services.users.get(parseInt(id, 10));

      res.json(user);
    })
  );

  router.post(
    '/',
    withTryCatch(async (req, res) => {
      const newUserRequest = req.body as NewUserRequest;

      const { hash, salt } = await hashPassword(newUserRequest.user.password);

      const playerId = await services.profiles.create({
        firstName: newUserRequest.player.firstName,
        lastName: newUserRequest.player.lastName,
        yearJoined: new Date().getFullYear(),
        bio: '',
      });

      const userId = await services.users.insert({
        email: newUserRequest.user.email,
        passwordHash: hash,
        passwordSalt: salt,
        playerId,
      });

      res.json({
        userId,
        playerId,
      });
    })
  );

  router.delete(
    '/:id',
    requireRoles([Roles.Admin]),
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const userId = parseInt(id, 10);

      await services.users.delete(userId);

      res.json({
        success: true,
      });
    })
  );

  return router;
};

export default buildRoute;
