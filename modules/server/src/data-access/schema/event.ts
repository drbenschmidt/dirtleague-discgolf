import { ConnectionPool, sql } from '@databases/mysql';

// eslint-disable-next-line import/prefer-default-export
export const createEventsTable = async (db: ConnectionPool): Promise<void> => {
  await db.query(sql`
    CREATE TABLE events (
      id INT NOT NULL AUTO_INCREMENT,
      courseId INT NOT NULL,
      seasonId INT NOT NULL,
      name VARCHAR(45) NOT NULL,
      startDate DATETIME NULL,
      PRIMARY KEY (id));
  `);
};
