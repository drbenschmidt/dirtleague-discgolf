import { ConnectionPool, sql } from '@databases/mysql';

// eslint-disable-next-line import/prefer-default-export
export const createCardsTable = async (db: ConnectionPool): Promise<void> => {
  await db.query(sql`
    CREATE TABLE cards (
      id INT NOT NULL AUTO_INCREMENT,
      roundId INT NOT NULL,
      PRIMARY KEY (id));
  `);
};
