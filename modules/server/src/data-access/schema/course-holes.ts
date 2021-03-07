import { ConnectionPool, sql } from '@databases/mysql';

// eslint-disable-next-line import/prefer-default-export
export const createCourseHolesTable = async (
  db: ConnectionPool
): Promise<void> => {
  await db.query(sql`
    CREATE TABLE IF NOT EXISTS courseHoles (
      id INT NOT NULL AUTO_INCREMENT,
      courseLayoutId INT NOT NULL,
      number INT NOT NULL,
      distance INT NOT NULL,
      par INT NOT NULL,
      PRIMARY KEY (id));
  `);
};

export const alterCourseHolesTable = async (
  db: ConnectionPool
): Promise<void> => {
  await db.query(sql`
    ALTER TABLE courseHoles 
      ADD INDEX fk_courseLayout_idx (courseLayoutId ASC);
      ;
    ALTER TABLE courseHoles 
      ADD CONSTRAINT fk_courseLayout
        FOREIGN KEY (courseLayoutId)
        REFERENCES courseLayouts (id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION;
  `);
};
