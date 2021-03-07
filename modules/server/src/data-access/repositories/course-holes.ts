/* eslint-disable class-methods-use-this */
import { ConnectionPool, sql } from '@databases/mysql';
import { Repository } from '../repository';

export interface DbCourseHole {
  id?: number;
  number: number;
  distance: number;
  par: number;
  courseLayoutId: number;
}

class CourseHolesRepository implements Repository<DbCourseHole> {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  async create(model: DbCourseHole): Promise<number> {
    const [result] = await this.db.query(sql`
      INSERT INTO courseHoles (number, distance, par, courseLayoutId)
      VALUES (${model.number}, ${model.distance}, ${model.par}, ${model.courseLayoutId});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  }

  async update(model: DbCourseHole): Promise<void> {
    await this.db.query(sql`
      UPDATE courseHoles
      SET number=${model.number}, distance=${model.distance}, par=${model.par}
      WHERE id=${model.id}
    `);
  }

  async delete(id: number): Promise<void> {
    await this.db.query(sql`
      DELETE FROM courseHoles
      WHERE id=${id}
    `);
  }

  async get(id: number): Promise<DbCourseHole> {
    const [entity] = await this.db.query(sql`
      SELECT * FROM courseHoles
      WHERE id=${id}
    `);

    if (entity) {
      return entity;
    }

    return null;
  }

  async getAll(): Promise<DbCourseHole[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM courseHoles
    `);

    return entities;
  }

  async getAllForCourseLayout(id: number): Promise<DbCourseHole[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM courseHoles
      WHERE courseLayoutId=${id}
    `);

    return entities;
  }
}

export default CourseHolesRepository;

/**
 *
ALTER TABLE `test-db`.`courseLayouts` 
ADD INDEX `fk_courses_idx` (`courseId` ASC);
;
ALTER TABLE `test-db`.`courseLayouts` 
ADD CONSTRAINT `fk_courses`
  FOREIGN KEY (`courseId`)
  REFERENCES `test-db`.`courses` (`id`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;
 */

/**
 * ALTER TABLE `test-db`.`courseHoles` 
ADD INDEX `fk_courseLayout_idx` (`courseLayoutId` ASC);
;
ALTER TABLE `test-db`.`courseHoles` 
ADD CONSTRAINT `fk_courseLayout`
  FOREIGN KEY (`courseLayoutId`)
  REFERENCES `test-db`.`courseLayouts` (`id`)
  ON DELETE CASCADE
  ON UPDATE NO ACTION;

 */
