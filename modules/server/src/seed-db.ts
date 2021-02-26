import db from './data-access/database';
import { createUsersTable } from './data-access/schema/users';
import RepositoryServices from './data-access/repositories';
import hashPassword from './crypto/hash';

const services = new RepositoryServices();

const insertUser = async (email: string, password: string): Promise<void> => {
  const { hash, salt } = await hashPassword(password);

  await services.users.insert(email, hash, salt);
};

const work = async () => {
  await createUsersTable(db);

  await insertUser('ben@dirtleague.org', 'foobar');
  await insertUser('kyle@dirtleague.org', 'foobar');
  await insertUser('tim@dirtleague.org', 'foobar');
  await insertUser('pj@dirtleague.org', 'foobar');
};

work()
  .then(() => process.exit(0))
  .catch(console.error);
