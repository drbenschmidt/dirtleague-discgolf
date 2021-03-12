/* eslint-disable class-methods-use-this */
import { ConnectionPool, sql } from '@databases/mysql';
import { Repository } from '../repository';

export interface DbCardThrower {
  id?: number;
  teamName?: string;
}

class CardThrowersRepository implements Repository<DbCardThrower> {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  async create(model: DbCardThrower): Promise<number> {
    const [result] = await this.db.query(sql`
      INSERT INTO cardThrowers (teamName)
      VALUES (${model.teamName});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbCardThrower): Promise<void> {
    await this.db.query(sql`
      UPDATE cardThrowers
      SET teamName=${model.teamName}
      WHERE id=${model.id}
    `);
  }

  async delete(id: number): Promise<void> {
    await this.db.query(sql`
      DELETE FROM cardThrowers
      WHERE id=${id}
    `);
  }

  async get(id: number): Promise<DbCardThrower> {
    const [entity] = await this.db.query(sql`
      SELECT * FROM cardThrowers
      WHERE id=${id}
    `);

    if (entity) {
      return entity;
    }

    return null;
  }

  async getAll(): Promise<DbCardThrower[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM cardThrowers
    `);

    return entities;
  }
}

export default CardThrowersRepository;
