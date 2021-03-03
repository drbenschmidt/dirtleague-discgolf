/* eslint-disable class-methods-use-this */
import { ConnectionPool, sql } from '@databases/mysql';
import { Repository } from '../repository';

interface DbProfile {
  id?: number;
  firstName: string;
  lastName: string;
  currentRating: number;
}

class UsersRepository implements Repository<DbProfile> {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  async create(model: DbProfile): Promise<DbProfile> {
    const [result] = await this.db.query(sql`
      INSERT INTO profiles (firstName, lastName, currentRating)
      VALUES (${model.firstName}, ${model.lastName}, ${model.currentRating});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    model.id = result['LAST_INSERT_ID()'];

    return model;
  }

  async update(model: DbProfile): Promise<void> {
    await this.db.query(sql`
      UPDATE profiles
      SET firstName=${model.firstName}, lastName=${model.lastName}, currentRating=${model.currentRating}
      WHERE id=${model.id}
    `);
  }

  async delete(id: number): Promise<void> {
    await this.db.query(sql`
      DELETE FROM profiles
      WHERE id=${id}
    `);

    // TODO: Re-learn how to make foreign keys so I can make cascading deletes.
    await this.db.query(sql`
      DELETE FROM aliases
      WHERE playerId=${id}
    `);
  }

  async get(id: number): Promise<DbProfile> {
    const [entity] = await this.db.query(sql`
      SELECT * FROM profiles
      WHERE id=${id}
    `);

    if (entity) {
      return entity;
    }

    return null;
  }

  async getAll(): Promise<DbProfile[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM profiles
    `);

    return entities;
  }
}

export default UsersRepository;
