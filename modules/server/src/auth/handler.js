/** @typedef {import('../data-access/repositories.js').default} RepositoryServices  */
import { hashPassword } from '../crypto/hash.js';

export const requireAuth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401);
    res.json({ error: 'Unauthorized' });
  }
};

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
    console.log('user not found');
    return null;
  }

  console.log(`User  Salt: ${user.password_salt}`);

  const { hash } = await hashPassword(password, user.password_salt);

  console.log(`User  Hash: ${user.password_hash}`);
  console.log(`Input Hash: ${hash}`);

  if (hash === user.password_hash) {
    // TODO: Remove password hash and salt.
    return user;
  }

  return null;
};
