/* eslint-disable class-methods-use-this */
import { ConnectionPool, sql } from '@databases/mysql';
import { Repository } from '../repository';

export interface DbPlayerGroupResult {
  playerGroupId?: number;
  courseHoleId?: number;
  score?: number;
}

class PlayerGroupResultsRepository implements Repository<DbPlayerGroupResult> {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  async create(model: DbPlayerGroupResult): Promise<number> {
    const [result] = await this.db.query(sql`
      INSERT INTO playerGroupResults (playerGroupId, courseHoleId, score)
      VALUES (${model.playerGroupId}, ${model.courseHoleId}, ${model.score});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbPlayerGroupResult): Promise<void> {
    throw new Error('Many to Many cant do this.');
  }

  async delete(id: number): Promise<void> {
    throw new Error('Many to Many cant do this.');
  }

  async get(id: number): Promise<DbPlayerGroupResult> {
    throw new Error('Many to Many cant do this.');
  }

  async getAll(): Promise<DbPlayerGroupResult[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM playerGroupResults
    `);

    return entities;
  }

  /*
  SELECT pgr.*, ch.number FROM `test-db`.playerGroupResults as pgr
JOIN `test-db`.courseHoles as ch ON pgr.courseHoleId = ch.id
ORDER BY ch.number ASC
*/
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

export default PlayerGroupResultsRepository;
