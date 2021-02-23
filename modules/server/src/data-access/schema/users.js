/** @typedef {import('../database').default} Database */
import { sql } from '@databases/mysql';

export const createUsersTable = async (db) => {
  await db.query(sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL NOT NULL PRIMARY KEY,
      email VARCHAR(128) NOT NULL,
      password_hash VARCHAR(256) NOT NULL,
      password_salt VARCHAR(256) NOT NULL,
      UNIQUE(email)
    )
  `);
};