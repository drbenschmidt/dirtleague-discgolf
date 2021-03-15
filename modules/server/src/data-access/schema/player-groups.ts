import { ConnectionPool, sql } from '@databases/mysql';

// eslint-disable-next-line import/prefer-default-export
export const createPlayerGroupsTable = async (
  db: ConnectionPool
): Promise<void> => {
  await db.query(sql`
    CREATE TABLE playerGroups (
      id INT NOT NULL AUTO_INCREMENT,
      teamName VARCHAR(128) NULL,
      cardId INT NOT NULL,
      PRIMARY KEY (id));
  `);
};
