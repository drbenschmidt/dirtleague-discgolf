import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Roles, UserModel } from '@dirtleague/common';
import hashPassword from '../crypto/hash';
import RepositoryServices from '../data-access/repository-services';

interface RequestWithToken extends Request {
  token: string;
}

export const extractToken = (req: Request): string => {
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader !== 'undefined') {
    // split the space at the bearer
    const [, token] = bearerHeader.split(' ');

    return token;
  }

  return null;
};

export const applyToken = (
  req: RequestWithToken,
  res: Response,
  next: NextFunction
): void => {
  const token = extractToken(req);

  if (token) {
    req.token = token;
  }

  next();
};

export const requireToken = (
  req: RequestWithToken,
  res: Response,
  next: NextFunction
): void => {
  if (req.token) {
    jwt.verify(req.token, 'secretkey', error => {
      if (error) {
        res.status(403).json({ error });
      } else {
        // next middleware
        next();
      }
    });
  } else {
    // Forbidden
    res.status(403).json({ error: 'Unauthorized' });
  }
};

export const applyRoles = (user: any, isAdmin: boolean): void => {
  if (!user.roles) {
    // eslint-disable-next-line no-param-reassign
    user.roles = [];
  }

  if (isAdmin) {
    user.roles.push(Roles.Admin);
  }

  user.roles.push(Roles.User);
};

export const authenticate = async (
  email: string,
  password: string,
  services: RepositoryServices
): Promise<UserModel> => {
  const result = await services.users.getByEmail(email);

  if (!result) {
    return null;
  }

  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    passwordSalt: password_salt,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    passwordHash: password_hash,
    isAdmin,
    ...user
  } = result;

  const { hash } = await hashPassword(password, password_salt);

  if (hash === password_hash) {
    applyRoles(user, isAdmin);

    return user as UserModel;
  }

  return null;
};
