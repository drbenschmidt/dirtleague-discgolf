import db from './database.js';
import UsersRepository from './repositories/users.js';

class RepositoryServices {
  /** @type {UsersRepository} */
  users = null;

  constructor() {
    this.users = new UsersRepository(db);
  }
}

export default RepositoryServices;
