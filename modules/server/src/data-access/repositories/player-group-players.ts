/* eslint-disable class-methods-use-this */
import { ConnectionPool, sql } from '@databases/mysql';
import { Repository } from '../repository';

export interface DbPlayerGroupPlayer {
  playerGroupId?: number;
  playerId?: number;
}

// TODO: Don't extend Repository<TDBModel> for join tables.
class PlayerGroupPlayersRepository implements Repository<DbPlayerGroupPlayer> {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  async create(model: DbPlayerGroupPlayer): Promise<number> {
    const result = await this.db.query(sql`
      INSERT INTO playerGroupPlayers (playerGroupId, playerId)
      VALUES (${model.playerGroupId}, ${model.playerId});

      SELECT LAST_INSERT_ID();
    `);

    console.log(result);

    // eslint-disable-next-line no-param-reassign
    const id = ([result] as any)['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbPlayerGroupPlayer): Promise<void> {
    throw new Error('UPDATE does not work on a JOIN table');
  }

  async delete(id: number): Promise<void> {
    throw new Error('delete(id) does not work on a JOIN table');
  }

  async get(id: number): Promise<DbPlayerGroupPlayer> {
    const [entity] = await this.db.query(sql`
      SELECT * FROM playerGroupPlayers
      WHERE playerGroupId=${id}
    `);

    if (entity) {
      return entity;
    }

    return null;
  }

  async getAll(): Promise<DbPlayerGroupPlayer[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM playerGroupPlayers
    `);

    return entities;
  }

  async getForPlayerGroup(id: number): Promise<DbPlayerGroupPlayer[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM playerGroupPlayers
      WHERE playerGroupId=${id}
    `);

    return entities;
  }
}

export default PlayerGroupPlayersRepository;
