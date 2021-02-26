import db from './database';
import UsersRepository from './repositories/users';

class RepositoryServices {
  users: UsersRepository = null;

  constructor() {
    this.users = new UsersRepository(db);
  }
}

export default RepositoryServices;
