import { sql } from '@databases/mysql';
import { keys } from 'ts-transformer-keys';
import { Table } from './entity-table';

export interface DbCard {
  id?: number;
  roundId?: number;
  authorId?: number;
}

class CardsTable extends Table<DbCard> {
  get columns(): Array<keyof DbCard> {
    return keys<DbCard>();
  }

  get tableName(): string {
    return 'cards';
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
