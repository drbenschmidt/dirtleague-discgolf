/* eslint-disable class-methods-use-this */
import { ConnectionPool, sql } from '@databases/mysql';
import { Repository } from '../repository';

export interface DbPlayerGroup {
  id?: number;
  cardId?: number;
  teamName?: string;
  score?: number;
  par?: number;
}

class PlayerGroupsRepository implements Repository<DbPlayerGroup> {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  async create(model: DbPlayerGroup): Promise<number> {
    const [result] = await this.db.query(sql`
      INSERT INTO playerGroups (teamName, cardId)
      VALUES (${model.teamName}, ${model.cardId});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbPlayerGroup): Promise<void> {
    await this.db.query(sql`
      UPDATE playerGroups
      SET teamName=${model.teamName}, cardId=${model.cardId}, score=${model.score}, par=${model.par}
      WHERE id=${model.id}
    `);
  }

  async delete(id: number): Promise<void> {
    await this.db.query(sql`
      DELETE FROM playerGroups
      WHERE id=${id}
    `);
  }

  async get(id: number): Promise<DbPlayerGroup> {
    const [entity] = await this.db.query(sql`
      SELECT * FROM playerGroups
      WHERE id=${id}
    `);

    if (entity) {
      return entity;
    }

    return null;
  }

  async getAll(): Promise<DbPlayerGroup[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM playerGroups
    `);

    return entities;
  }

  async getForCard(id: number): Promise<DbPlayerGroup[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM playerGroups
      WHERE cardId=${id}
    `);

    return entities;
  }
}

export default PlayerGroupsRepository;
