/* eslint-disable class-methods-use-this */
import { ConnectionPool, sql } from '@databases/mysql';
import { Repository } from '../repository';

export interface DbCard {
  id?: number;
  roundId?: number;
}

class CardsRepository implements Repository<DbCard> {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  async create(model: DbCard): Promise<number> {
    const [result] = await this.db.query(sql`
      INSERT INTO cards (roundId)
      VALUES (${model.roundId});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbCard): Promise<void> {
    await this.db.query(sql`
      UPDATE cards
      SET roundId=${model.roundId}
      WHERE id=${model.id}
    `);
  }

  async delete(id: number): Promise<void> {
    await this.db.query(sql`
      DELETE FROM cards
      WHERE id=${id}
    `);
  }

  async get(id: number): Promise<DbCard> {
    const [entity] = await this.db.query(sql`
      SELECT * FROM cards
      WHERE id=${id}
    `);

    if (entity) {
      return entity;
    }

    return null;
  }

  async getAll(): Promise<DbCard[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM cards
    `);

    return entities;
  }

  async getForRound(id: number): Promise<DbCard[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM cards
      WHERE roundId=${id}
    `);

    return entities;
  }
}

export default CardsRepository;
