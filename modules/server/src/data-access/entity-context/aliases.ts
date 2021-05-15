import { sql } from '@databases/mysql';
import { keys } from 'ts-transformer-keys';
import { Table } from './entity-table';

export interface DbAlias {
  id?: number;
  playerId: number;
  value: string;
}

class AliasesTable extends Table<DbAlias> {
  get columns(): Array<keyof DbAlias> {
    return keys<DbAlias>();
  }

  get tableName(): string {
    return 'aliases';
  }

  async getForPlayerId(playerId: number): Promise<DbAlias[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM aliases
      WHERE playerId=${playerId}
    `);

    return entities;
  }
}

export default AliasesTable;
