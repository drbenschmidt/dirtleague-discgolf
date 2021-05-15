/* eslint-disable class-methods-use-this */
import { Queryable, sql } from '@databases/mysql';
import { EntityTable } from './entity-table';

export interface DbCard {
  id?: number;
  roundId?: number;
  authorId?: number;
}

class CardsTable implements EntityTable<DbCard> {
  db: Queryable;

  constructor(db: Queryable) {
    this.db = db;
  }

  async create(model: DbCard): Promise<number> {
    const [result] = await this.db.query(sql`
      INSERT INTO cards (roundId, authorId)
      VALUES (${model.roundId}, ${model.authorId});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbCard): Promise<void> {
    await this.db.query(sql`
      UPDATE cards
      SET roundId=${model.roundId}, authorId=${model.authorId}
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

export default CardsTable;
