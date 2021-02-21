/** @typedef {import('../database').default} Database */
import { sql } from '@databases/mysql';

class UsersRepository {
  /** @type {Database} */
  db = null;

  constructor(db) {
    this.db = db;
  }

  insert = async (email, favoriteColor) => {
    await this.db.query(sql`
      INSERT INTO users (email, favorite_color)
      VALUES (${email}, ${favoriteColor})
    `);
  }

  update = async (email, favoriteColor) => {
    await this.db.query(sql`
      UPDATE users
      SET favorite_color=${favoriteColor}
      WHERE email=${email}
    `);
  }
  
  delete = async (email) => {
    await this.db.query(sql`
      DELETE FROM users
      WHERE email=${email}
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

  getAll = async () => {
    const users = await this.db.query(sql`
      SELECT * FROM users
    `);

    return users || [];
  }
}

export default UsersRepository;
