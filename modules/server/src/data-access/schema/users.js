/** @typedef {import('../database').default} Database */
import { sql } from '@databases/mysql';

export const createUsersTable = async (db) => {
  await db.query(sql`
    CREATE TABLE 'users' (
      'id' int(11) NOT NULL AUTO_INCREMENT,
      'email' varchar(128) NOT NULL,
      'password_hash' varchar(256) NOT NULL,
      'password_salt' varchar(256) NOT NULL,
      'isAdmin' tinyint(1) DEFAULT '0',
      PRIMARY KEY ('id'),
      UNIQUE KEY 'email_UNIQUE' ('email')
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
  `);
};