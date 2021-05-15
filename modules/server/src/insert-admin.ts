import { Roles } from '@dirtleague/common';
import EntityContext from './data-access/entity-context';
import connectionPool from './data-access/database';
import hashPassword from './crypto/hash';

const services = new EntityContext(connectionPool);

const insertUser = async (email: string, password: string): Promise<void> => {
  const { hash, salt } = await hashPassword(password);

  const playerId = await services.profiles.create({
    firstName: 'New',
    lastName: 'User',
    yearJoined: new Date().getFullYear(),
    bio: '',
  });

  const userId = await services.users.insert({
    email,
    passwordHash: hash,
    passwordSalt: salt,
    playerId,
  });

  await services.userRoles.updateForUserId(userId, [Roles.Admin]);
};

// First two aren't what we want.
const [, , email, password] = process.argv;

if (!email || !password) {
  console.error('Email or password not provided');

  process.exit(1);
}

const work = async () => {
  await insertUser(email, password);
};

work()
  .then(() => process.exit(0))
  .catch(console.error);
