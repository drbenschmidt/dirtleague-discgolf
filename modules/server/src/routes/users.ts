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

interface UserProps {
  email: string;
  password: string;
  password2: string;
}

export interface NewUserRequest {
  user: UserProps;
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

        (user as any).attributes.player = player;
      }

      // TODO: Check to see if we're requesting the roles as well.
      const roles = await services.userRoles.getByUserId(user.id);

      (user as any).attributes.roles = roles;

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
      let newUserId: number = null;

      if (newUserRequest.user.password !== newUserRequest.user.password2) {
        res.status(500).json({
          success: false,
          error: 'Passwords do not match.',
        });
        return;
      }

      await services.tx(async tx => {
        const { hash, salt } = await hashPassword(newUserRequest.user.password);

        const playerModel = new PlayerModel({
          firstName: newUserRequest.player.firstName,
          lastName: newUserRequest.player.lastName,
          yearJoined: new Date().getFullYear(),
          bio: '',
        });

        await tx.profiles.insert(playerModel);

        newUserId = await tx.users.newUser({
          email: newUserRequest.user.email,
          passwordHash: hash,
          passwordSalt: salt,
          playerId: playerModel.id,
        });
      });

      if (!newUserId) {
        res.status(500).json({
          success: false,
          error: 'Error creating user or profile',
        });
        return;
      }

      const userModel = await services.users.get(newUserId);
      userModel.attributes.roles = await services.userRoles.getByUserId(
        userModel.id
      );

      // TODO: Make secret key configurable or use certificate.
      jwt.sign(
        { user: userModel.toJson() },
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
            user: userModel.toJson(),
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
