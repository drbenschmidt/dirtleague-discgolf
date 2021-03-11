import { ConnectionPool, sql } from '@databases/mysql';

// eslint-disable-next-line import/prefer-default-export
export const createSeasonsTable = async (db: ConnectionPool): Promise<void> => {
  await db.query(sql`
    CREATE TABLE IF NOT EXISTS seasons (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(45) NOT NULL,
      startDate DATETIME NOT NULL,
      endDate DATETIME NOT NULL,
      PRIMARY KEY (id));
  `);
};
