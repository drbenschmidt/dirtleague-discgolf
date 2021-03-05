import { ConnectionPool, sql } from '@databases/mysql';

// eslint-disable-next-line import/prefer-default-export
export const createCourseLayoutsTable = async (
  db: ConnectionPool
): Promise<void> => {
  await db.query(sql`
    CREATE TABLE IF NOT EXISTS courseLayouts (
      id INT NOT NULL AUTO_INCREMENT,
      courseId INT NOT NULL,
      name VARCHAR(256) NOT NULL,
      PRIMARY KEY (id));
  `);
};
