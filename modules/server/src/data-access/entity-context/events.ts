/* eslint-disable class-methods-use-this */
import { Queryable, sql } from '@databases/mysql';
import { EntityTable } from './entity-table';

export interface DbEvent {
  id?: number;
  name: string;
  description: string;
  seasonId: number;
  startDate: Date;
}

class EventsTable implements EntityTable<DbEvent> {
  db: Queryable;

  constructor(db: Queryable) {
    this.db = db;
  }

  async create(model: DbEvent): Promise<number> {
    const [result] = await this.db.query(sql`
      INSERT INTO events (name, description, seasonId, startDate)
      VALUES (${model.name}, ${model.description}, ${model.seasonId}, ${model.startDate});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbEvent): Promise<void> {
    await this.db.query(sql`
      UPDATE events
      SET name=${model.name}, description=${model.description}, seasonId=${model.seasonId}, startDate=${model.startDate}
      WHERE id=${model.id}
    `);
  }

  async delete(id: number): Promise<void> {
    await this.db.query(sql`
      DELETE FROM events
      WHERE id=${id}
    `);
  }

  async get(id: number): Promise<DbEvent> {
    const [entity] = await this.db.query(sql`
      SELECT * FROM events
      WHERE id=${id}
    `);

    if (entity) {
      return entity;
    }

    return null;
  }

  async getAll(): Promise<DbEvent[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM events
    `);

    return entities;
  }
}

export default EventsTable;
