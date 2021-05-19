import { sql } from '@databases/mysql';
import { keys } from 'ts-transformer-keys';
import { Table } from './entity-table';

export interface DbRound {
  id?: number;
  eventId?: number;
  courseId?: number;
  courseLayoutId?: number;
  isComplete?: boolean;
  name?: string;
}

class RoundsTable extends Table<DbRound> {
  get columns(): Array<keyof DbRound> {
    return keys<DbRound>();
  }

  get tableName(): string {
    return 'rounds';
  }

  async getAllForEvent(id: number): Promise<DbRound[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM rounds
      WHERE eventId=${id}
    `);

    return entities;
  }
}

export default RoundsTable;
