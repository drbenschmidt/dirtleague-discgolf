import db from './database';
import UsersRepository from './repositories/users';
import ProfilesRepository from './repositories/players';
import AliasesRepository from './repositories/aliases';
import CoursesRepository from './repositories/courses';
import CourseLayoutsRepository from './repositories/course-layouts';
import CourseHolesRepository from './repositories/course-holes';
import SeasonsRepository from './repositories/seasons';
import EventsRepository from './repositories/events';
import RoundsRepository from './repositories/rounds';
import CardsRepository from './repositories/cards';
import PlayerGroupsRepository from './repositories/player-groups';
import PlayerGroupPlayersRepository from './repositories/player-group-players';
import CardHoleResultsRepository from './repositories/card-hole-results';

class RepositoryServices {
  users: UsersRepository = null;

  profiles: ProfilesRepository = null;

  aliases: AliasesRepository = null;

  courses: CoursesRepository = null;

  courseLayouts: CourseLayoutsRepository = null;

  courseHoles: CourseHolesRepository = null;

  seasons: SeasonsRepository = null;

  events: EventsRepository = null;

  rounds: RoundsRepository = null;

  cards: CardsRepository = null;

  playerGroups: PlayerGroupsRepository = null;

  playerGroupPlayers: PlayerGroupPlayersRepository = null;

  cardHoleResults: CardHoleResultsRepository = null;

  constructor() {
    this.users = new UsersRepository(db);
    this.profiles = new ProfilesRepository(db);
    this.aliases = new AliasesRepository(db);
    this.courses = new CoursesRepository(db);
    this.courseLayouts = new CourseLayoutsRepository(db);
    this.courseHoles = new CourseHolesRepository(db);
    this.seasons = new SeasonsRepository(db);
    this.events = new EventsRepository(db);
    this.rounds = new RoundsRepository(db);
    this.cards = new CardsRepository(db);
    this.playerGroups = new PlayerGroupsRepository(db);
    this.playerGroupPlayers = new PlayerGroupPlayersRepository(db);
    this.cardHoleResults = new CardHoleResultsRepository(db);
  }
}

export default RepositoryServices;
