import { ConnectionPool, sql } from '@databases/mysql';

// eslint-disable-next-line import/prefer-default-export
export const createUsersTable = async (db: ConnectionPool): Promise<void> => {
  await db.query(sql`
    CREATE TABLE IF NOT EXISTS users (
      id int(11) NOT NULL AUTO_INCREMENT,
      email VARCHAR(128) NOT NULL,
      passwordHash VARCHAR(256) NOT NULL,
      passwordSalt VARCHAR(256) NOT NULL,
      isAdmin TINYINT(1) DEFAULT '0',
      PRIMARY KEY (id),
      UNIQUE KEY email_UNIQUE (email)
    )
  `);
};
