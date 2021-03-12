/* eslint-disable class-methods-use-this */
import { ConnectionPool, sql } from '@databases/mysql';
import { Repository } from '../repository';

export interface DbEvent {
  id?: number;
  name: string;
  courseId: number;
  seasonId: string;
  startDate: Date;
}

class EventsRepository implements Repository<DbEvent> {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  async create(model: DbEvent): Promise<number> {
    const [result] = await this.db.query(sql`
      INSERT INTO events (name, courseId, seasonId, startDate)
      VALUES (${model.name}, ${model.courseId}, ${model.seasonId}, ${model.startDate});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbEvent): Promise<void> {
    await this.db.query(sql`
      UPDATE events
      SET name=${model.name}, courseId=${model.courseId}, seasonId=${model.seasonId}, startDate=${model.startDate}
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

export default EventsRepository;
