import { CourseLayoutModel, set } from '@dirtleague/common';
import { DbCourseLayout } from '../entity-context/course-layouts';
import { Table } from '../entity-context/entity-table';
import Repository from './repository';

class CourseLayoutRepository extends Repository<
  CourseLayoutModel,
  DbCourseLayout
> {
  get entityTable(): Table<DbCourseLayout> {
    return this.context.courseLayouts;
  }

  factory(row: DbCourseLayout): CourseLayoutModel {
    return new CourseLayoutModel(row);
  }

  async insert(model: CourseLayoutModel): Promise<void> {
    await super.insert(model);

    await this.syncCollection(
      model.holes.toArray(),
      [],
      entity => set(entity, 'courseLayoutId', model.id),
      this.servicesInstance.courseHoles
    );
  }

  async update(model: CourseLayoutModel): Promise<void> {
    await super.update(model);

    // Update the CourseLayouts relationship
    const dbHoles = await this.context.courseHoles.getAllForCourseLayout(
      model.id
    );

    await this.syncCollection(
      model.holes.toArray(),
      dbHoles,
      entity => set(entity, 'courseLayoutId', model.id),
      this.servicesInstance.courseHoles
    );
  }

  getAllForCourse = async (id: number): Promise<CourseLayoutModel[]> => {
    const rows = await this.context.courseLayouts.getAllForCourse(id);

    return rows.map(row => new CourseLayoutModel(row));
  };
}

export default CourseLayoutRepository;
