import { ConnectionPool, sql } from '@databases/mysql';

// eslint-disable-next-line import/prefer-default-export
export const createCourseLayoutsTable = async (
  db: ConnectionPool
): Promise<void> => {
  await db.query(sql`
    CREATE TABLE IF NOT EXISTS courseLayouts (
      id INT NOT NULL AUTO_INCREMENT,
      courseId INT NOT NULL,
      dgcrSse INT NOT NULL,
      name VARCHAR(256) NOT NULL,
      PRIMARY KEY (id));
  `);
};

export const alterCourseLayoutsTable = async (
  db: ConnectionPool
): Promise<void> => {
  await db.query(sql`
    ALTER TABLE courseLayouts 
      ADD INDEX fk_courses_idx (courseId ASC);
      ;
    ALTER TABLE courseLayouts 
      ADD CONSTRAINT fk_courses
        FOREIGN KEY (courseId)
        REFERENCES courses (id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION;
  `);
};
