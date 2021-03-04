import { ConnectionPool, sql } from '@databases/mysql';

// eslint-disable-next-line import/prefer-default-export
export const createPlayersTable = async (db: ConnectionPool): Promise<void> => {
  await db.query(sql`
    CREATE TABLE IF NOT EXISTS players (
      id INT NOT NULL AUTO_INCREMENT,
      firstName VARCHAR(45) NOT NULL,
      lastName VARCHAR(45) NOT NULL,
      currentRating INT NOT NULL DEFAULT 0,
      PRIMARY KEY (id));
  `);
};
