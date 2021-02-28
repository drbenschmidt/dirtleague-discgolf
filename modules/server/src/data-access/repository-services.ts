import db from './database';
import UsersRepository from './repositories/users';
import ProfilesRepository from './repositories/profiles';
import AliasesRepository from './repositories/aliases';

class RepositoryServices {
  users: UsersRepository = null;

  profiles: ProfilesRepository = null;

  aliases: AliasesRepository = null;

  constructor() {
    this.users = new UsersRepository(db);
    this.profiles = new ProfilesRepository(db);
    this.aliases = new AliasesRepository(db);
  }
}

export default RepositoryServices;
