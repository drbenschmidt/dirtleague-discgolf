import { sql } from '@databases/mysql';
import db from './database.js';

export const createUsersTable = async () => {
  await db.query(sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL NOT NULL PRIMARY KEY,
      email VARCHAR(128) NOT NULL,
      favorite_color VARCHAR(50) NOT NULL,
      UNIQUE(email)
    )
  `);
};

const Repositories = {
  users: {
    insert: async (email, favoriteColor) => {
      await db.query(sql`
        INSERT INTO users (email, favorite_color)
        VALUES (${email}, ${favoriteColor})
      `);
    },

    update: async (email, favoriteColor) => {
      await db.query(sql`
        UPDATE users
        SET favorite_color=${favoriteColor}
        WHERE email=${email}
      `);
    },
    
    delete: async (email) => {
      await db.query(sql`
        DELETE FROM users
        WHERE email=${email}
      `);
    },
    
    get: async (id) => {
      const users = await db.query(sql`
        SELECT * FROM users
        WHERE id=${id}
      `);
      if (users.length === 0) {
        return null;
      }
      return users[0];
    },

    getAll: async () => {
      const users = await db.query(sql`
        SELECT * FROM users
      `);

      return users || [];
    }
  }
};

export default Repositories;
