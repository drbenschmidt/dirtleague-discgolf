import { ConnectionPool, sql } from '@databases/mysql';

// eslint-disable-next-line import/prefer-default-export
export const createPlayerGroupResultsTable = async (
  db: ConnectionPool
): Promise<void> => {
  await db.query(sql`
    CREATE TABLE playerRatings (
      id INT NOT NULL AUTO_INCREMENT,
      playerId INT NOT NULL,
      cardId INT NOT NULL,
      date DATETIME NOT NULL,
      rating INT NOT NULL,
      PRIMARY KEY (id));
  `);
};
