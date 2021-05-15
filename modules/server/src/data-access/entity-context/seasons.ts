import { Queryable, sql } from '@databases/mysql';
import { EntityTable } from './entity-table';

export interface DbSeason {
  id?: number;
  name: string;
  startDate: Date;
  endDate: Date;
}

class SeasonsTable implements EntityTable<DbSeason> {
  db: Queryable;

  constructor(db: Queryable) {
    this.db = db;
  }

  async create(model: DbSeason): Promise<number> {
    const [result] = await this.db.query(sql`
      INSERT INTO seasons (name, startDate, endDate)
      VALUES (${model.name}, ${model.startDate}, ${model.endDate});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbSeason): Promise<void> {
    await this.db.query(sql`
      UPDATE seasons
      SET name=${model.name}, startDate=${model.startDate}, endDate=${model.endDate}
      WHERE id=${model.id}
    `);
  }

  async delete(id: number): Promise<void> {
    await this.db.query(sql`
      DELETE FROM seasons
      WHERE id=${id}
    `);
  }

  async get(id: number): Promise<DbSeason> {
    const [entity] = await this.db.query(sql`
      SELECT * FROM seasons
      WHERE id=${id}
    `);

    if (entity) {
      return entity;
    }

    return null;
  }

  async getAll(): Promise<DbSeason[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM seasons
    `);

    return entities;
  }
}

export default SeasonsTable;
