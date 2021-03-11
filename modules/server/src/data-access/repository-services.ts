import db from './database';
import UsersRepository from './repositories/users';
import ProfilesRepository from './repositories/players';
import AliasesRepository from './repositories/aliases';
import CoursesRepository from './repositories/courses';
import CourseLayoutsRepository from './repositories/course-layouts';
import CourseHolesRepository from './repositories/course-holes';
import SeasonsRepository from './repositories/seasons';

class RepositoryServices {
  users: UsersRepository = null;

  profiles: ProfilesRepository = null;

  aliases: AliasesRepository = null;

  courses: CoursesRepository = null;

  courseLayouts: CourseLayoutsRepository = null;

  courseHoles: CourseHolesRepository = null;

  seasons: SeasonsRepository = null;

  constructor() {
    this.users = new UsersRepository(db);
    this.profiles = new ProfilesRepository(db);
    this.aliases = new AliasesRepository(db);
    this.courses = new CoursesRepository(db);
    this.courseLayouts = new CourseLayoutsRepository(db);
    this.courseHoles = new CourseHolesRepository(db);
    this.seasons = new SeasonsRepository(db);
  }
}

export default RepositoryServices;
