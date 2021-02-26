import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { hashPassword } from '../crypto/hash';
import RepositoryServices from '../data-access/repositories';

interface RequestWithToken extends Request {
  token: string;
}

export const extractToken = (req: Request) => {
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader !== 'undefined') {
    // split the space at the bearer
    const [_bearer, token] = bearerHeader.split(' ');

    return token;
  }
};

export const applyToken = (
  req: RequestWithToken,
  res: Response,
  next: NextFunction
) => {
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
) => {
  if (req.token) {
    jwt.verify(req.token, 'secretkey', (error, authData) => {
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

/**
 *
 * @param {string} email
 * @param {string} password
 * @param {RepositoryServices} services
 */
export const authenticate = async (
  email: string,
  password: string,
  services: RepositoryServices
) => {
  const user = await services.users.getByEmail(email);

  // query the db for the given username
  if (!user) {
    return null;
  }

  const { hash } = await hashPassword(password, user.password_salt);

  if (hash === user.password_hash) {
    // TODO: Remove password hash and salt.
    return user;
  }

  return null;
};
