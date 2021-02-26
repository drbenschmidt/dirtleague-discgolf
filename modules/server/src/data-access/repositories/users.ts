import { ConnectionPool, sql } from '@databases/mysql';

// TODO: Prevent user hashes and salts from being sent down by service.
class UsersRepository {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  insert = async (
    email: string,
    passwordHash: string,
    passwordSalt: string
  ) => {
    await this.db.query(sql`
      INSERT INTO users (email, password_hash, password_salt)
      VALUES (${email}, ${passwordHash}, ${passwordSalt})
    `);
  };

  update = async (
    email: string,
    passwordHash: string,
    passwordSalt: string
  ) => {
    await this.db.query(sql`
      UPDATE users
      SET password_hash=${passwordHash}, password_salt=${passwordSalt}
      WHERE email=${email}
    `);
  };

  delete = async (id: number) => {
    await this.db.query(sql`
      DELETE FROM users
      WHERE id=${id}
    `);
  };

  get = async (id: number) => {
    const users = await this.db.query(sql`
      SELECT * FROM users
      WHERE id=${id}
    `);
    if (users.length === 0) {
      return null;
    }
    return users[0];
  };

  getByEmail = async (email: string) => {
    const users = await this.db.query(sql`
      SELECT * FROM users
      WHERE email=${email}
    `);
    if (users.length === 0) {
      return null;
    }
    return users[0];
  };

  getAll = async () => {
    const users = await this.db.query(sql`
      SELECT * FROM users
    `);

    return users || [];
  };
}

export default UsersRepository;
