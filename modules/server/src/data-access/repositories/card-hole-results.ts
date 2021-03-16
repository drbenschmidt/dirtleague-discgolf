/* eslint-disable class-methods-use-this */
import { ConnectionPool, sql } from '@databases/mysql';
import { Repository } from '../repository';

export interface DbCardHoleResult {
  id?: number;
  courseHoleId?: number;
  score?: number;
}

class CardHoleResultsRepository implements Repository<DbCardHoleResult> {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  async create(model: DbCardHoleResult): Promise<number> {
    const [result] = await this.db.query(sql`
      INSERT INTO cardHoleResults (courseHoleId, score)
      VALUES (${model.courseHoleId}, ${model.score});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbCardHoleResult): Promise<void> {
    await this.db.query(sql`
      UPDATE cardHoleResults
      SET courseHoleId=${model.courseHoleId}, score=${model.score}
      WHERE id=${model.id}
    `);
  }

  async delete(id: number): Promise<void> {
    await this.db.query(sql`
      DELETE FROM cardHoleResults
      WHERE id=${id}
    `);
  }

  async get(id: number): Promise<DbCardHoleResult> {
    const [entity] = await this.db.query(sql`
      SELECT * FROM cardHoleResults
      WHERE id=${id}
    `);

    if (entity) {
      return entity;
    }

    return null;
  }

  async getAll(): Promise<DbCardHoleResult[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM cardHoleResults
    `);

    return entities;
  }
}

export default CardHoleResultsRepository;
