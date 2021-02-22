/** @typedef {import('../database').default} Database */
import { sql } from '@databases/mysql';

// TODO: Prevent user hashes and salts from being sent down by service.
class UsersRepository {
  /** @type {Database} */
  db = null;

  constructor(db) {
    this.db = db;
  }

  insert = async (email, passwordHash, passwordSalt) => {
    await this.db.query(sql`
      INSERT INTO users (email, password_hash, password_salt)
      VALUES (${email}, ${passwordHash}, ${passwordSalt})
    `);
  }

  update = async (email, passwordHash, passwordSalt) => {
    await this.db.query(sql`
      UPDATE users
      SET password_hash=${passwordHash}, password_salt=${passwordSalt}
      WHERE email=${email}
    `);
  }
  
  delete = async (id) => {
    await this.db.query(sql`
      DELETE FROM users
      WHERE id=${id}
    `);
  }
  
  get = async (id) => {
    const users = await this.db.query(sql`
      SELECT * FROM users
      WHERE id=${id}
    `);
    if (users.length === 0) {
      return null;
    }
    return users[0];
  }

  getByEmail = async (email) => {
    const users = await this.db.query(sql`
      SELECT * FROM users
      WHERE email=${email}
    `);
    if (users.length === 0) {
      return null;
    }
    return users[0];
  }

  getAll = async () => {
    const users = await this.db.query(sql`
      SELECT * FROM users
    `);

    return users || [];
  }
}

export default UsersRepository;
