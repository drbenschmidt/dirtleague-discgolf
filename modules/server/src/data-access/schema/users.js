/** @typedef {import('../database').default} Database */
import { sql } from '@databases/mysql';

export const createUsersTable = async (db) => {
  await db.query(sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL NOT NULL PRIMARY KEY,
      email VARCHAR(128) NOT NULL,
      favorite_color VARCHAR(50) NOT NULL,
      UNIQUE(email)
    )
  `);
};