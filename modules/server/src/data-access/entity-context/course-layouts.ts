import { sql } from '@databases/mysql';
import { keys } from 'ts-transformer-keys';
import { Table } from './entity-table';

export interface DbCourseLayout {
  id?: number;
  name: string;
  courseId: number;
  dgcrSse: number;
  par?: number;
}

class CourseLayoutsTable extends Table<DbCourseLayout> {
  get columns(): Array<keyof DbCourseLayout> {
    return keys<DbCourseLayout>();
  }

  get tableName(): string {
    return 'courseLayouts';
  }

  async getAllForCourse(id: number): Promise<DbCourseLayout[]> {
    const entities = await this.db.query(sql`
      SELECT * FROM courseLayouts
      WHERE courseId=${id}
    `);

    return entities;
  }
}

export default CourseLayoutsTable;
