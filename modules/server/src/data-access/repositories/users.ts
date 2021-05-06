import { ConnectionPool, sql } from '@databases/mysql';

interface DbUser {
  id?: number;
  playerId?: number;
  email: string;
  passwordHash: string;
  passwordSalt: string;
}

class UsersRepository {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  insert = async (model: DbUser): Promise<number> => {
    const [result] = await this.db.query(sql`
      INSERT INTO users (email, passwordHash, passwordSalt, playerId)
      VALUES (${model.email}, ${model.passwordHash}, ${model.passwordSalt}, ${model.playerId});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  };

  update = async (model: DbUser): Promise<void> => {
    await this.db.query(sql`
      UPDATE users
      SET passwordHash=${model.passwordHash}, passwordSalt=${model.passwordSalt}, playerId=${model.playerId}
      WHERE email=${model.email}
    `);
  };

  delete = async (id: number): Promise<void> => {
    await this.db.query(sql`
      DELETE FROM users
      WHERE id=${id}
    `);
  };

  get = async (id: number): Promise<DbUser> => {
    const users = await this.db.query(sql`
      SELECT * FROM users
      WHERE id=${id}
    `);

    if (users.length === 0) {
      return null;
    }

    return users[0];
  };

  getByEmail = async (email: string): Promise<DbUser> => {
    const users = await this.db.query(sql`
      SELECT * FROM users
      WHERE email=${email}
    `);

    if (users.length === 0) {
      return null;
    }

    return users[0];
  };

  getAll = async (): Promise<Array<DbUser>> => {
    const users = await this.db.query(sql`
      SELECT * FROM users
    `);

    return users || [];
  };
}

export default UsersRepository;
