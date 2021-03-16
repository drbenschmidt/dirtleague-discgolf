import { ConnectionPool, sql } from '@databases/mysql';

// eslint-disable-next-line import/prefer-default-export
export const createPlayerGroupPlayersTable = async (
  db: ConnectionPool
): Promise<void> => {
  await db.query(sql`
    CREATE TABLE playerGroupPlayers (
      playerGroupId INT NOT NULL,
      playerId INT NOT NULL,
      PRIMARY KEY (playerId, playerGroupId));
  `);
};
