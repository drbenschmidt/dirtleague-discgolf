import { UserModel } from '@dirtleague/common';
import TransactionOptions from '@databases/mysql/lib/types/TransactionOptions';
import EntityContext from '../entity-context';
import AliasRepository from './alias';
import PlayerRepository from './player';
import CourseRepository from './course';
import CourseLayoutRepository from './course-layout';
import CourseHoleRepository from './course-hole';

// TODO: Memoize getters
export default class RepositoryServices {
  private user: UserModel = null;
  private context: EntityContext = null;

  get players(): PlayerRepository {
    return new PlayerRepository(this, this.user, this.context);
  }

  get aliases(): AliasRepository {
    return new AliasRepository(this, this.user, this.context);
  }

  get courses(): CourseRepository {
    return new CourseRepository(this, this.user, this.context);
  }

  get courseLayouts(): CourseLayoutRepository {
    return new CourseLayoutRepository(this, this.user, this.context);
  }

  get courseHoles(): CourseHoleRepository {
    return new CourseHoleRepository(this, this.user, this.context);
  }

  constructor(user: UserModel, context: EntityContext) {
    this.user = user;
    this.context = context;
  }

  async tx<T>(
    fn: (ctx: RepositoryServices) => Promise<T>,
    options?: TransactionOptions
  ): Promise<T> {
    return this.context.tx(async (ctx: EntityContext) => {
      return fn(new RepositoryServices(this.user, ctx));
    }, options);
  }
}
