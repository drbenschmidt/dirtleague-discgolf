import { UserModel } from '@dirtleague/common';
import TransactionOptions from '@databases/mysql/lib/types/TransactionOptions';
import EntityContext from '../entity-context';
import AliasRepository from './alias';
import PlayerRepository from './player';
import CourseRepository from './course';
import CourseLayoutRepository from './course-layout';
import CourseHoleRepository from './course-hole';
import EventRepository from './event';
import RoundRepository from './round';
import CardRepository from './card';
import PlayerGroupRepository from './player-group';
import PlayerGroupPlayerRepository from './player-group-player';
import ProfileRepository from './profile';
import PlayerRatingRepository from './player-rating';
import PlayerGroupResultRepository from './player-group-result';
import SeasonRepository from './season';
import UserRepository from './user';
import UserRoleRepository from './user-role';

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

  get events(): EventRepository {
    return new EventRepository(this, this.user, this.context);
  }

  get rounds(): RoundRepository {
    return new RoundRepository(this, this.user, this.context);
  }

  get cards(): CardRepository {
    return new CardRepository(this, this.user, this.context);
  }

  get playerGroups(): PlayerGroupRepository {
    return new PlayerGroupRepository(this, this.user, this.context);
  }

  get playerGroupPlayers(): PlayerGroupPlayerRepository {
    return new PlayerGroupPlayerRepository(this, this.user, this.context);
  }

  get profiles(): ProfileRepository {
    return new ProfileRepository(this, this.user, this.context);
  }

  get playerRatings(): PlayerRatingRepository {
    return new PlayerRatingRepository(this, this.user, this.context);
  }

  get playerGroupResults(): PlayerGroupResultRepository {
    return new PlayerGroupResultRepository(this, this.user, this.context);
  }

  get seasons(): SeasonRepository {
    return new SeasonRepository(this, this.user, this.context);
  }

  get users(): UserRepository {
    return new UserRepository(this, this.user, this.context);
  }

  get userRoles(): UserRoleRepository {
    return new UserRoleRepository(this, this.user, this.context);
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
