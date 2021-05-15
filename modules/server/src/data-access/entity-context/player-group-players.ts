import { sql } from '@databases/mysql';
import { keys } from 'ts-transformer-keys';
import { JoinTable } from './entity-table';

export interface DbPlayerGroupPlayer {
  playerGroupId?: number;
  playerId?: number;
}

class PlayerGroupPlayersTable extends JoinTable<DbPlayerGroupPlayer> {
  get columns(): Array<keyof DbPlayerGroupPlayer> {
    return keys<DbPlayerGroupPlayer>();
  }

  get tableName(): string {
    return 'playerGroupPlayers';
  }

  async getForPlayerGroup(id: number): Promise<DbPlayerGroupPlayer[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM playerGroupPlayers
      WHERE playerGroupId=${id}
    `);

    return entities;
  }

  async deleteForPlayerGroup(id: number): Promise<void> {
    await this.db.query(sql`
      DELETE FROM playerGroupPlayers
      WHERE playerGroupId=${id}
    `);
  }
}

export default PlayerGroupPlayersTable;
