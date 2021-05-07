import type ApiFetch from './api-fetch';
import PlayerRepository from './repositories/player';
import AliasRepository from './repositories/alias';
import CourseRepository from './repositories/courses';
import SeasonsRepository from './repositories/seasons';
import EventRepository from './repositories/events';
import CourseLayoutRepository from './repositories/course-layouts';
import UsersRepository from './repositories/users';

interface RepositoryServicesProps {
  api: ApiFetch;
}

class RepositoryServices {
  api: ApiFetch;

  players: PlayerRepository;
  aliases: AliasRepository;
  courses: CourseRepository;
  seasons: SeasonsRepository;
  events: EventRepository;
  courseLayouts: CourseLayoutRepository;
  users: UsersRepository;

  constructor(props: RepositoryServicesProps) {
    const { api } = props;

    this.api = api;
    this.players = new PlayerRepository(this.api);
    this.aliases = new AliasRepository(this.api);
    this.courses = new CourseRepository(this.api);
    this.seasons = new SeasonsRepository(this.api);
    this.events = new EventRepository(this.api);
    this.courseLayouts = new CourseLayoutRepository(this.api);
    this.users = new UsersRepository(this.api);
  }
}

export default RepositoryServices;
