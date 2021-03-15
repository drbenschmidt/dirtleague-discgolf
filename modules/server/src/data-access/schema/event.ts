import { ConnectionPool, sql } from '@databases/mysql';

// eslint-disable-next-line import/prefer-default-export
export const createEventsTable = async (db: ConnectionPool): Promise<void> => {
  await db.query(sql`
    CREATE TABLE events (
      id INT NOT NULL AUTO_INCREMENT,
      seasonId INT NOT NULL,
      name VARCHAR(45) NOT NULL,
      description LONGTEXT NULL,
      startDate DATETIME NULL,
      PRIMARY KEY (id));
  `);
};
