/* eslint-disable class-methods-use-this */
import { ConnectionPool, sql } from '@databases/mysql';
import { Repository } from '../repository';

export interface DbAlias {
  id?: number;
  playerId: number;
  value: string;
}

class AliasesRepository implements Repository<DbAlias> {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  async create(model: DbAlias): Promise<number> {
    const [result] = await this.db.query(sql`
      INSERT INTO aliases (playerId, value)
      VALUES (${model.playerId}, ${model.value});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbAlias): Promise<void> {
    await this.db.query(sql`
      UPDATE aliases
      SET playerId=${model.playerId}, value=${model.value}
      WHERE id=${model.id}
    `);
  }

  async delete(id: number): Promise<void> {
    await this.db.query(sql`
      DELETE FROM aliases
      WHERE id=${id}
    `);
  }

  async get(id: number): Promise<DbAlias> {
    const [entity] = await this.db.query(sql`
      SELECT * FROM aliases
      WHERE id=${id}
    `);

    if (entity) {
      return entity;
    }

    return null;
  }

  async getAll(): Promise<DbAlias[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM aliases
    `);

    return entities;
  }

  // TODO: Update to `getForPlayerId`.
  async getForUserId(playerId: number): Promise<DbAlias[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM aliases
      WHERE playerId=${playerId}
    `);

    return entities;
  }
}

export default AliasesRepository;
