/* eslint-disable class-methods-use-this */
import { ConnectionPool, sql } from '@databases/mysql';
import { Repository } from '../repository';

export interface DbPlayerRating {
  id?: number;
  playerId: number;
  cardId: number;
  date: Date;
  rating: number;
}

class PlayerRatingRepository implements Repository<DbPlayerRating> {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  async create(model: DbPlayerRating): Promise<number> {
    const [result] = await this.db.query(sql`
      INSERT INTO playerRatings (playerId, cardId, date, rating)
      VALUES (${model.playerId}, ${model.cardId}, ${model.date}, ${model.rating});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbPlayerRating): Promise<void> {
    await this.db.query(sql`
      UPDATE playerRatings
      SET playerId=${model.playerId}, cardId=${model.cardId}, date=${model.date}, rating=${model.rating}
      WHERE id=${model.id}
    `);
  }

  async delete(id: number): Promise<void> {
    await this.db.query(sql`
      DELETE FROM playerRatings
      WHERE id=${id}
    `);
  }

  async get(id: number): Promise<DbPlayerRating> {
    const [entity] = await this.db.query(sql`
      SELECT * FROM playerRatings
      WHERE id=${id}
    `);

    if (entity) {
      return entity;
    }

    return null;
  }

  async getAll(): Promise<DbPlayerRating[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM playerRatings
    `);

    return entities;
  }

  async getForCardId(cardId: number): Promise<DbPlayerRating[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM playerRatings
      WHERE cardId=${cardId}
    `);

    return entities;
  }

  async getForPlayerId(playerId: number): Promise<DbPlayerRating[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM playerRatings
      WHERE playerId=${playerId}
    `);

    return entities;
  }

  async getForPlayerCardId(
    playerId: number,
    cardId: number
  ): Promise<DbPlayerRating> {
    const [result] = await this.db.query(sql`
      SELECT * FROM playerRatings
      WHERE playerId=${playerId} AND cardId=${cardId}
    `);

    return result;
  }
}

export default PlayerRatingRepository;
