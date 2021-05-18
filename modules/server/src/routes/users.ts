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
import { UserRoleModel } from '../data-access/repository-services/user-role';

const config = getDefaultConfigManager();

// TODO: Move cleaning to repository.
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

      res.json(cleanUser(user.toJson() as DbUser));
    })
  );

  // New User Request comes from anonymous.
  router.post(
    '/',
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const newUserRequest = req.body as NewUserRequest;
      let userModel: UserModel = null;

      await services.tx(async tx => {
        const { hash, salt } = await hashPassword(newUserRequest.user.password);

        const playerModel = new PlayerModel({
          firstName: newUserRequest.player.firstName,
          lastName: newUserRequest.player.lastName,
          yearJoined: new Date().getFullYear(),
          bio: '',
        });

        await tx.profiles.insert(playerModel);

        userModel = new UserModel({
          email: newUserRequest.user.email,
          passwordHash: hash,
          passwordSalt: salt,
          playerId: playerModel.id,
        });

        await tx.users.insert(userModel);

        userModel.roles = await services.userRoles.getByUserId(userModel.id);
      });

      if (!userModel) {
        res.status(500).json({
          success: false,
          error: 'Error creating user or profile',
        });
      }

      // TODO: Make secret key configurable or use certificate.
      jwt.sign(
        { user: userModel },
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
            user: userModel,
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
      const { services } = req;
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
      const { services } = req;
      const { id } = req.params;
      const { roleId } = req.body;
      const userId = parseInt(id, 10);

      await services.userRoles.insert(new UserRoleModel({ userId, roleId }));

      res.json({ success: true });
    })
  );

  router.post(
    '/:id/removeRole',
    requireRoles([Role.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;
      const { roleId } = req.body;
      const userId = parseInt(id, 10);

      await services.userRoles.delete(new UserRoleModel({ userId, roleId }));

      res.json({ success: true });
    })
  );

  router.post(
    '/:id/updatePassword',
    requireRoles([Role.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;
      const { password } = req.body;
      const userId = parseInt(id, 10);

      services.users.updatePassword(userId, password);

      res.json({ success: true });
    })
  );

  router.patch(
    '/:id',
    requireRoles([Role.Admin]),
    withRepositoryServices,
    withTryCatch(async (req, res) => {
      const { services } = req;
      const { id } = req.params;
      const userId = parseInt(id, 10);

      await services.users.patch(userId, req.body);

      res.json({ success: true });
    })
  );

  return router;
};

export default buildRoute;
