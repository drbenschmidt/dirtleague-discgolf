import { sql } from '@databases/mysql';
import { keys } from 'ts-transformer-keys';
import { Table } from './entity-table';

export interface DbCourseHole {
  id?: number;
  number: number;
  distance: number;
  par: number;
  courseLayoutId: number;
}

class CourseHolesTable extends Table<DbCourseHole> {
  get columns(): Array<keyof DbCourseHole> {
    return keys<DbCourseHole>();
  }

  get tableName(): string {
    return 'courseHoles';
  }

  async getAllForCourseLayout(id: number): Promise<DbCourseHole[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM courseHoles
      WHERE courseLayoutId=${id}
      ORDER BY number ASC
    `);

    return entities;
  }
}

export default CourseHolesTable;
