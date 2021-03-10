import db from './data-access/database';
import RepositoryServices from './data-access/repository-services';
import hashPassword from './crypto/hash';
import { createUsersTable } from './data-access/schema/users';
import { createPlayersTable } from './data-access/schema/players';
import { createAliasesTable } from './data-access/schema/aliases';
import { createCoursesTable } from './data-access/schema/courses';
import {
  createCourseLayoutsTable,
  alterCourseLayoutsTable,
} from './data-access/schema/course-layouts';
import {
  createCourseHolesTable,
  alterCourseHolesTable,
} from './data-access/schema/course-holes';

const services = new RepositoryServices();

const insertUser = async (
  email: string,
  password: string,
  isAdmin = false
): Promise<void> => {
  const { hash, salt } = await hashPassword(password);

  await services.users.insert({
    email,
    passwordHash: hash,
    passwordSalt: salt,
    isAdmin,
  });
};

const work = async () => {
  await createUsersTable(db);
  await createPlayersTable(db);
  await createAliasesTable(db);
  await createCoursesTable(db);
  await createCourseLayoutsTable(db);
  await createCourseHolesTable(db);

  await alterCourseLayoutsTable(db);
  await alterCourseHolesTable(db);

  await insertUser('ben@dirtleague.org', 'foobar', true);
  await insertUser('kyle@dirtleague.org', 'foobar');
  await insertUser('tim@dirtleague.org', 'foobar');
  await insertUser('pj@dirtleague.org', 'foobar');
};

work()
  .then(() => process.exit(0))
  .catch(console.error);
