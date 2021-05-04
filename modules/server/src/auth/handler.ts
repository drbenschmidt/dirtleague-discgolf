import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Roles, UserModel } from '@dirtleague/common';
import hashPassword from '../crypto/hash';
import RepositoryServices from '../data-access/repository-services';
import { getDefaultConfigManager } from '../config/manager';

const config = getDefaultConfigManager();

export interface RequestWithToken extends Request {
  token: string;
  user: UserModel;
}

interface JsonWebToken {
  user: UserModel;
  iat: number;
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

    const { user } = jwt.decode(req.token, { json: true }) as JsonWebToken;

    req.user = user;
  }

  next();
};

export const requireToken = (
  req: RequestWithToken,
  res: Response,
  next: NextFunction
): void => {
  if (req.token) {
    jwt.verify(req.token, config.props.DIRT_API_SESSION_SECRET, error => {
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

export const requireRoles = (roles: Roles[]) => (
  req: RequestWithToken,
  res: Response,
  next: NextFunction
): void => {
  if (req.token) {
    const { user } = jwt.decode(req.token, { json: true }) as JsonWebToken;
    const isAdmin = user.roles.includes(Roles.Admin);
    const isAuthorized = roles.every(role => user.roles.includes(role));

    // NOTE: We're going to assume that Roles.Admin gets everything, no need to verify
    // individual roles yet.
    if (!isAuthorized && !isAdmin) {
      // Forbidden
      res.status(403).json({ error: 'Unauthorized' });
    }

    next();
  } else {
    // Forbidden
    res.status(403).json({ error: 'Unauthorized' });
  }
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
