import { PlayerModel, Role, UserModel } from '@dirtleague/common';
import express, { Router } from 'express';
import jwt from 'jsonwebtoken';
import withTryCatch from '../http/withTryCatch';
import hashPassword from '../crypto/hash';
import { requireRoles } from '../auth/handler';
import { getDefaultConfigManager } from '../config/manager';
import type { DbUser } from '../data-access/entity-context/users';
import withRepositoryServices from '../http/withRepositoryServices';
import toJson from '../utils/toJson';

const config = getDefaultConfigManager();

const cleanUser = (user: DbUser) => {
  // eslint-disable-next-line no-param-reassign
  delete user.passwordHash;
  // eslint-disable-next-line no-param-reassign
  delete user.passwordSalt;

  return user;
};

export interface NewUserRequest {
  user: UserModel;
  player: PlayerModel;
}

const buildRoute = (): Router => {
  const router = express.Router();

  router.get(
    '/',
    requireRoles([Role.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const users = await services.users.getAll();

      res.json(users.map(toJson).map(cleanUser));
    })
  );

  router.get(
    '/:id',
    requireRoles([Role.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const { services } = req;
      const user = await services.users.get(parseInt(id, 10));

      // TODO: Check to see if we're requesting the player as well.
      if (user.playerId) {
        const player = await services.profiles.get(user.playerId);

        (user as any).player = player;
      }

      // TODO: Check to see if we're requesting the roles as well.
      const roles = await services.userRoles.getByUserId(user.id);

      (user as any).roles = roles;

      res.json(cleanUser(user));
    })
  );

  // New User Request comes from anonymous.
  router.post(
    '/',
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const newUserRequest = req.body as NewUserRequest;

      const { hash, salt } = await hashPassword(newUserRequest.user.password);

      const playerId = await services.profiles.insert({
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

      // TODO: Another spot where the routes should be calling a single repository function
      // to get a user and it's roles. This logic is duplicated in the auth route.
      const result = await services.users.get(userId);

      const {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        passwordSalt: password_salt,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        passwordHash: password_hash,
        ...user
      } = result;

      (user as UserModel).roles = await services.userRoles.getByUserId(userId);

      // TODO: Make secret key configurable or use certificate.
      jwt.sign(
        { user },
        config.props.DIRT_API_SESSION_SECRET,
        (error: Error | null, token: string | null) => {
          if (error) {
            res.status(500).json({
              success: false,
              error,
            });
          }

          res.json({
            success: true,
            user,
            token,
          });
        }
      );
    })
  );

  router.delete(
    '/:id',
    requireRoles([Role.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const userId = parseInt(id, 10);

      await services.users.delete(userId);

      res.json({
        success: true,
      });
    })
  );

  router.post(
    '/:id/addRole',
    requireRoles([Role.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const { roleId } = req.body;
      const userId = parseInt(id, 10);

      await services.userRoles.insert({ userId, roleId });

      res.json({ success: true });
    })
  );

  router.post(
    '/:id/removeRole',
    requireRoles([Role.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const { roleId } = req.body;
      const userId = parseInt(id, 10);

      await services.userRoles.delete({ userId, roleId });

      res.json({ success: true });
    })
  );

  router.post(
    '/:id/updatePassword',
    requireRoles([Role.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const { password } = req.body;
      const userId = parseInt(id, 10);

      const dbUser = await services.users.get(userId);

      const { hash, salt } = await hashPassword(password);

      dbUser.passwordHash = hash;
      dbUser.passwordSalt = salt;

      await services.users.update(dbUser);

      res.json({ success: true });
    })
  );

  router.patch(
    '/:id',
    requireRoles([Role.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { id } = req.params;
      const userId = parseInt(id, 10);

      await services.users.patch(userId, req.body);

      res.json({ success: true });
    })
  );

  return router;
};

export default buildRoute;
