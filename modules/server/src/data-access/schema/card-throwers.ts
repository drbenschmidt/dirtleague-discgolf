import { ConnectionPool, sql } from '@databases/mysql';

// eslint-disable-next-line import/prefer-default-export
export const createCardThrowersTable = async (
  db: ConnectionPool
): Promise<void> => {
  await db.query(sql`
    CREATE TABLE cardThrowers (
      id INT NOT NULL AUTO_INCREMENT,
      teamName VARCHAR(128) NULL,
      firstPlayerId INT NULL,
      secondPlayerId INT NULL,
      thirdPlayerId INT NULL,
      PRIMARY KEY (id));
  `);
};
