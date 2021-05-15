/* eslint-disable class-methods-use-this */
import { Queryable, sql } from '@databases/mysql';
import { EntityTable } from './entity-table';

export interface DbCourse {
  id?: number;
  name: string;
}

class CoursesTable implements EntityTable<DbCourse> {
  db: Queryable;

  constructor(db: Queryable) {
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
      DELETE FROM courses
      WHERE id=${id}
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

export default CoursesTable;
