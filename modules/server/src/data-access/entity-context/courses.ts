import { keys } from 'ts-transformer-keys';
import { Table } from './entity-table';

export interface DbCourse {
  id?: number;
  name: string;
}

class CoursesTable extends Table<DbCourse> {
  get columns(): Array<keyof DbCourse> {
    return keys<DbCourse>();
  }

  get tableName(): string {
    return 'courses';
  }
}

export default CoursesTable;
