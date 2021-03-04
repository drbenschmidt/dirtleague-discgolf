/* eslint-disable class-methods-use-this */
import { ConnectionPool, sql } from '@databases/mysql';
import { Repository } from '../repository';

interface DbPlayer {
  id?: number;
  firstName: string;
  lastName: string;
  currentRating: number;
}

class PlayerRepository implements Repository<DbPlayer> {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  async create(model: DbPlayer): Promise<number> {
    const [result] = await this.db.query(sql`
      INSERT INTO players (firstName, lastName, currentRating)
      VALUES (${model.firstName}, ${model.lastName}, ${model.currentRating});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbPlayer): Promise<void> {
    await this.db.query(sql`
      UPDATE players
      SET firstName=${model.firstName}, lastName=${model.lastName}, currentRating=${model.currentRating}
      WHERE id=${model.id}
    `);
  }

  async delete(id: number): Promise<void> {
    await this.db.query(sql`
      DELETE FROM players
      WHERE id=${id}
    `);

    // TODO: Re-learn how to make foreign keys so I can make cascading deletes.
    await this.db.query(sql`
      DELETE FROM aliases
      WHERE playerId=${id}
    `);
  }

  async get(id: number): Promise<DbPlayer> {
    const [entity] = await this.db.query(sql`
      SELECT * FROM players
      WHERE id=${id}
    `);

    if (entity) {
      return entity;
    }

    return null;
  }

  async getAll(): Promise<DbPlayer[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM players
    `);

    return entities;
  }
}

export default PlayerRepository;
