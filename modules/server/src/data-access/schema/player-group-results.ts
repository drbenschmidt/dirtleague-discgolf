import { ConnectionPool, sql } from '@databases/mysql';

// eslint-disable-next-line import/prefer-default-export
export const createPlayerGroupResultsTable = async (
  db: ConnectionPool
): Promise<void> => {
  await db.query(sql`
    CREATE TABLE playerGroupResults (
      id INT NOT NULL AUTO_INCREMENT,
      cardThrowerId INT NOT NULL,
      courseHoleId INT NOT NULL,
      score INT NULL,
      PRIMARY KEY (id));
  `);
};
