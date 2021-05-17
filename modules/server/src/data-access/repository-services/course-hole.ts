import { CourseHoleModel } from '@dirtleague/common';
import { DbCourseHole } from '../entity-context/course-holes';
import { Table } from '../entity-context/entity-table';
import Repository from './repository';

class CourseHoleRepository extends Repository<CourseHoleModel, DbCourseHole> {
  get entityTable(): Table<DbCourseHole> {
    return this.context.courseHoles;
  }

  factory(row: DbCourseHole): CourseHoleModel {
    return new CourseHoleModel(row);
  }

  getAllForCourseLayout = async (id: number): Promise<CourseHoleModel[]> => {
    const rows = await this.context.courseHoles.getAllForCourseLayout(id);

    return rows.map(row => new CourseHoleModel(row));
  };
}

export default CourseHoleRepository;
