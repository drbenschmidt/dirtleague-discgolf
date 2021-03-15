import { ConnectionPool, sql } from '@databases/mysql';

// eslint-disable-next-line import/prefer-default-export
export const createRoundsTable = async (db: ConnectionPool): Promise<void> => {
  await db.query(sql`
    CREATE TABLE rounds (
      id INT NOT NULL AUTO_INCREMENT,
      eventId INT NOT NULL,
      courseId INT NOT NULL,
      courseLayoutId INT NOT NULL,
      name VARCHAR(45) NULL,
      PRIMARY KEY (id));
  `);
};
