import { Queryable, SQLQuery, Transaction } from '@databases/mysql';
import TransactionOptions from '@databases/mysql/lib/types/TransactionOptions';
import UsersTable from './users';
import PlayersTable from './players';
import AliasesTable from './aliases';
import CoursesTable from './courses';
import CourseLayoutsTable from './course-layouts';
import CourseHolesTable from './course-holes';
import SeasonsTable from './seasons';
import EventsTable from './events';
import RoundsTable from './rounds';
import CardsTable from './cards';
import PlayerGroupsTable from './player-groups';
import PlayerGroupPlayersTable from './player-group-players';
import PlayerGroupResultsTable from './player-group-results';
import PlayerRatingTable from './player-ratings';
import UserRolesTable from './user-roles';
import connectionPool from '../database';

class EntityContext {
  private db: Queryable = null;

  users: UsersTable = null;
  userRoles: UserRolesTable = null;
  profiles: PlayersTable = null;
  aliases: AliasesTable = null;
  courses: CoursesTable = null;
  courseLayouts: CourseLayoutsTable = null;
  courseHoles: CourseHolesTable = null;
  seasons: SeasonsTable = null;
  events: EventsTable = null;
  rounds: RoundsTable = null;
  cards: CardsTable = null;
  playerGroups: PlayerGroupsTable = null;
  playerGroupPlayers: PlayerGroupPlayersTable = null;
  playerGroupResults: PlayerGroupResultsTable = null;
  playerRatings: PlayerRatingTable = null;

  constructor(db: Queryable) {
    this.db = db;
    this.users = new UsersTable(db);
    this.userRoles = new UserRolesTable(db);
    this.profiles = new PlayersTable(db);
    this.aliases = new AliasesTable(db);
    this.courses = new CoursesTable(db);
    this.courseLayouts = new CourseLayoutsTable(db);
    this.courseHoles = new CourseHolesTable(db);
    this.seasons = new SeasonsTable(db);
    this.events = new EventsTable(db);
    this.rounds = new RoundsTable(db);
    this.cards = new CardsTable(db);
    this.playerGroups = new PlayerGroupsTable(db);
    this.playerGroupPlayers = new PlayerGroupPlayersTable(db);
    this.playerGroupResults = new PlayerGroupResultsTable(db);
    this.playerRatings = new PlayerRatingTable(db);
  }

  async tx<T>(
    fn: (ctx: EntityContext) => Promise<T>,
    options?: TransactionOptions
  ): Promise<T> {
    return this.db.tx(async (conn: Transaction) => {
      return fn(new EntityContext(conn));
    }, options);
  }

  async execute<TResult>(query: SQLQuery): Promise<TResult[]> {
    return this.db.query(query);
  }

  static CreateFromPool(): EntityContext {
    return new EntityContext(connectionPool);
  }
}

export default EntityContext;
