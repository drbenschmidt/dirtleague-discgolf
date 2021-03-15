/* eslint-disable class-methods-use-this */
import { ConnectionPool, sql } from '@databases/mysql';
import { Repository } from '../repository';

export interface DbRound {
  id?: number;
  eventId?: number;
  courseId?: number;
  courseLayoutId?: number;
  name?: string;
}

class RoundsRepository implements Repository<DbRound> {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  async create(model: DbRound): Promise<number> {
    const [result] = await this.db.query(sql`
      INSERT INTO rounds (name, eventId, courseId, courseLayoutId)
      VALUES (${model.name}, ${model.eventId}, ${model.courseId}, ${model.courseLayoutId});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbRound): Promise<void> {
    await this.db.query(sql`
      UPDATE rounds
      SET name=${model.name}, eventId=${model.eventId}, courseId=${model.courseId} courseLayoutId=${model.courseLayoutId}
      WHERE id=${model.id}
    `);
  }

  async delete(id: number): Promise<void> {
    await this.db.query(sql`
      DELETE FROM rounds
      WHERE id=${id}
    `);
  }

  async get(id: number): Promise<DbRound> {
    const [entity] = await this.db.query(sql`
      SELECT * FROM rounds
      WHERE id=${id}
    `);

    if (entity) {
      return entity;
    }

    return null;
  }

  async getAll(): Promise<DbRound[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM rounds
    `);

    return entities;
  }
}

export default RoundsRepository;
