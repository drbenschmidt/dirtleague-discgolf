import { sql } from '@databases/mysql';
import { RatingType } from '@dirtleague/common';
import { keys } from 'ts-transformer-keys';
import { Table } from './entity-table';

export interface DbPlayerRating {
  id?: number;
  playerId: number;
  cardId: number;
  date: Date;
  rating: number;
  type: number;
}

export type RatingTypeResult = {
  event: number;
  league: number;
  personal: number;
};

class PlayerRatingTable extends Table<DbPlayerRating> {
  get columns(): Array<keyof DbPlayerRating> {
    return keys<DbPlayerRating>();
  }

  get tableName(): string {
    return 'playerRatings';
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

  async getRunningAverages(
    playerId: number,
    limit = 3
  ): Promise<RatingTypeResult> {
    const [{ avgRating: event }] = await this.db.query(sql`
      SELECT AVG(rating) as avgRating FROM playerRatings
      WHERE playerId=${playerId} AND type=${RatingType.Event}
      ORDER BY id DESC
      LIMIT ${limit}
    `);

    const [{ avgRating: league }] = await this.db.query(sql`
      SELECT AVG(rating) as avgRating FROM playerRatings
      WHERE playerId=${playerId} AND type=${RatingType.League}
      ORDER BY id DESC
      LIMIT ${limit}
    `);

    const [{ avgRating: personal }] = await this.db.query(sql`
      SELECT AVG(rating) as avgRating FROM playerRatings
      WHERE playerId=${playerId} AND type=${RatingType.Personal}
      ORDER BY id DESC
      LIMIT ${limit}
    `);

    return {
      event,
      league,
      personal,
    };
  }

  async getRatingCounts(playerId: number): Promise<RatingTypeResult> {
    const result = {
      event: 0,
      league: 0,
      personal: 0,
    };

    const results = await this.db.query(sql`
      SELECT type, COUNT(*) as total FROM playerRatings
      WHERE playerID=${playerId}
      GROUP BY type
    `);

    // eslint-disable-next-line no-restricted-syntax
    for (const count of results) {
      // eslint-disable-next-line default-case
      switch (count?.type) {
        case RatingType.Event:
          result.event = count?.total;
          break;

        case RatingType.League:
          result.league = count?.total;
          break;

        case RatingType.Personal:
          result.personal = count?.total;
          break;
      }
    }

    return result;
  }
}

export default PlayerRatingTable;
