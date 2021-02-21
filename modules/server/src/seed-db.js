import { createUsersTable } from './data-access/schema/users.js';
import RepositoryServices from './data-access/repositories.js';

const services = new RepositoryServices();

const work = async () => {
  await createUsersTable();

  await services.users.insert('ben@dirtleague.org', 'blue');
};

work().catch(console.error);