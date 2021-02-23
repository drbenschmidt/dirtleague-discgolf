/** @typedef {import('../data-access/repositories.js').default} RepositoryServices  */
import jwt from 'jsonwebtoken';
import { hashPassword } from '../crypto/hash.js';

export const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401);
    res.json({ error: 'Unauthorized' });
  }
};

export const extractToken = (req) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
      //split the space at the bearer
      const [_bearer, token] = bearerHeader.split(' ');
      
      return token;
  }
}

export const applyToken = (req, res, next) => {
  const token = extractToken(req);

  if (token) {
    req.token = token;
  }

  next();
};

export const requireToken = (req, res, next) => {
  if (req.token) {
    jwt.verify(req.token, 'secretkey', (error, authData) => {
      if (error) {
        res
          .status(403)
          .json({ error });
      } else {
        //next middleware
        next();
      }
    });
  } else {
      // Forbidden
      res
        .status(403)
        .json({ error: 'Unauthorized' });
  }
}

/**
 * 
 * @param {string} username 
 * @param {string} password 
 * @param {RepositoryServices} services 
 */
export const authenticate = async (username, password, services) => {
  const user = await services.users.getByEmail(username);

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
