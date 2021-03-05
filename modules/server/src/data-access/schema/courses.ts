import { ConnectionPool, sql } from '@databases/mysql';

// eslint-disable-next-line import/prefer-default-export
export const createCoursesTable = async (db: ConnectionPool): Promise<void> => {
  await db.query(sql`
    CREATE TABLE IF NOT EXISTS courses (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(256) NOT NULL,
      PRIMARY KEY (id));
  `);
};
