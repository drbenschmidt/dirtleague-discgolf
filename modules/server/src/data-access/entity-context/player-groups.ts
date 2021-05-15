import { sql } from '@databases/mysql';
import { keys } from 'ts-transformer-keys';
import { Table } from './entity-table';

export interface DbPlayerGroup {
  id?: number;
  cardId?: number;
  teamName?: string;
  score?: number;
  par?: number;
}

class PlayerGroupsTable extends Table<DbPlayerGroup> {
  get columns(): Array<keyof DbPlayerGroup> {
    return keys<DbPlayerGroup>();
  }

  get tableName(): string {
    return 'playerGroups';
  }

  async getForCard(id: number): Promise<DbPlayerGroup[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM playerGroups
      WHERE cardId=${id}
    `);

    return entities;
  }
}

export default PlayerGroupsTable;
