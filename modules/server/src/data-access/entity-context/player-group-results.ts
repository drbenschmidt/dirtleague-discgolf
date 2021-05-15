/* eslint-disable class-methods-use-this */
import { sql } from '@databases/mysql';
import { keys } from 'ts-transformer-keys';
import { JoinTable } from './entity-table';

export interface DbPlayerGroupResult {
  playerGroupId?: number;
  courseHoleId?: number;
  score?: number;
}

class PlayerGroupResultsTable extends JoinTable<DbPlayerGroupResult> {
  get columns(): Array<keyof DbPlayerGroupResult> {
    return keys<DbPlayerGroupResult>();
  }

  get tableName(): string {
    return 'playerGroupResults';
  }

  async getAllForGroup(playerGroupId: number): Promise<DbPlayerGroupResult[]> {
    const entities = await this.db.query(sql`
      SELECT pgr.*, ch.number as courseHoleNumber FROM playerGroupResults as pgr
      JOIN courseHoles as ch ON pgr.courseHoleId = ch.id
      WHERE pgr.playerGroupId=${playerGroupId}
      ORDER BY ch.number ASC
    `);

    return entities;
  }

  async deleteAllForGroup(playerGroupId: number): Promise<void> {
    await this.db.query(sql`
      DELETE FROM playerGroupResults
      WHERE playerGroupId=${playerGroupId}
    `);
  }
}

export default PlayerGroupResultsTable;
