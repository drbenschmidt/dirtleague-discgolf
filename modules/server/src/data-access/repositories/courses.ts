/* eslint-disable class-methods-use-this */
import { ConnectionPool, sql } from '@databases/mysql';
import { Repository } from '../repository';

export interface DbCourse {
  id?: number;
  name: string;
}

class CoursesRepository implements Repository<DbCourse> {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  async create(model: DbCourse): Promise<number> {
    const [result] = await this.db.query(sql`
      INSERT INTO courses (name)
      VALUES (${model.name});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbCourse): Promise<void> {
    await this.db.query(sql`
      UPDATE courses
      SET name=${model.name}
      WHERE id=${model.id}
    `);
  }

  async delete(id: number): Promise<void> {
    await this.db.query(sql`
      DELETE courses, courseLayouts, courseHoles
      FROM courses
      INNER JOIN courseLayouts ON courses.id = courseLayouts.courseId
      INNER JOIN courseHoles ON courseLayouts.id = courseHoles.courseLayoutId
      WHERE courses.id=${id}
    `);
  }

  async get(id: number): Promise<DbCourse> {
    const [entity] = await this.db.query(sql`
      SELECT * FROM courses
      WHERE id=${id}
    `);

    if (entity) {
      return entity;
    }

    return null;
  }

  async getAll(): Promise<DbCourse[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM courses
    `);

    return entities;
  }
}

export default CoursesRepository;
