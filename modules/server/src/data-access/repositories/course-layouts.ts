/* eslint-disable class-methods-use-this */
import { ConnectionPool, sql } from '@databases/mysql';
import { Repository } from '../repository';

export interface DbCourseLayout {
  id?: number;
  name: string;
  courseId: number;
  dgcrSse: number;
  par?: number;
}

class CourseLayoutsRepository implements Repository<DbCourseLayout> {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  async create(model: DbCourseLayout): Promise<number> {
    const [result] = await this.db.query(sql`
      INSERT INTO courseLayouts (name, courseId, dgcrSse, par)
      VALUES (${model.name}, ${model.courseId}, ${model.dgcrSse}, ${model.par});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbCourseLayout): Promise<void> {
    await this.db.query(sql`
      UPDATE courseLayouts
      SET name=${model.name}, dgcrSse=${model.dgcrSse}, par=${model.par}
      WHERE id=${model.id}
    `);
  }

  async delete(id: number): Promise<void> {
    await this.db.query(sql`
      DELETE FROM courseLayouts
      WHERE id=${id}
    `);
  }

  async get(id: number): Promise<DbCourseLayout> {
    const [entity] = await this.db.query(sql`
      SELECT * FROM courseLayouts
      WHERE id=${id}
    `);

    if (entity) {
      return entity;
    }

    return null;
  }

  async getAll(): Promise<DbCourseLayout[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM courseLayouts
    `);

    return entities;
  }

  async getAllForCourse(id: number): Promise<DbCourseLayout[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM courseLayouts
      WHERE courseId=${id}
    `);

    return entities;
  }
}

export default CourseLayoutsRepository;
