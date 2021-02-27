import db from './database';
import UsersRepository from './repositories/users';
import ProfilesRepository from './repositories/profiles';

class RepositoryServices {
  users: UsersRepository = null;

  profiles: ProfilesRepository = null;

  constructor() {
    this.users = new UsersRepository(db);
    this.profiles = new ProfilesRepository(db);
  }
}

export default RepositoryServices;
