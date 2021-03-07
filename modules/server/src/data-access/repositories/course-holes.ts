/* eslint-disable class-methods-use-this */
import { ConnectionPool, sql } from '@databases/mysql';
import { Repository } from '../repository';

export interface DbCourseHole {
  id?: number;
  number: number;
  distance: number;
  par: number;
  courseLayoutId: number;
}

class CourseHolesRepository implements Repository<DbCourseHole> {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  async create(model: DbCourseHole): Promise<number> {
    const [result] = await this.db.query(sql`
      INSERT INTO courseHoles (number, distance, par, courseLayoutId)
      VALUES (${model.number}, ${model.distance}, ${model.par}, ${model.courseLayoutId});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbCourseHole): Promise<void> {
    await this.db.query(sql`
      UPDATE courseHoles
      SET number=${model.number}, distance=${model.distance}, par=${model.par}
      WHERE id=${model.id}
    `);
  }

  async delete(id: number): Promise<void> {
    await this.db.query(sql`
      DELETE FROM courseHoles
      WHERE id=${id}
    `);
  }

  async get(id: number): Promise<DbCourseHole> {
    const [entity] = await this.db.query(sql`
      SELECT * FROM courseHoles
      WHERE id=${id}
    `);

    if (entity) {
      return entity;
    }

    return null;
  }

  async getAll(): Promise<DbCourseHole[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM courseHoles
    `);

    return entities;
  }

  async getAllForCourseLayout(id: number): Promise<DbCourseHole[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM courseHoles
      WHERE courseLayoutId=${id}
    `);

    return entities;
  }

  /* async deleteForCourseId(id: number): Promise<void> {
    await this.db.query(sql`
      DELETE FROM courseHoles
      WHERE 
    `);
  } */
}

export default CourseHolesRepository;
