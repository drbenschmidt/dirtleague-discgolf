import db from './data-access/database.js';
import { createUsersTable } from './data-access/schema/users.js';
import RepositoryServices from './data-access/repositories.js';
import { hashPassword } from './crypto/hash.js'

const services = new RepositoryServices();

const insertUser = async (email, password) => {
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
