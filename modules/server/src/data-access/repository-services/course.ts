import { CourseModel, set } from '@dirtleague/common';
import { DbCourse } from '../entity-context/courses';
import { Table } from '../entity-context/entity-table';
import Repository from './repository';

class CourseRepository extends Repository<CourseModel, DbCourse> {
  get entityTable(): Table<DbCourse> {
    return this.context.courses;
  }

  factory(row: DbCourse): CourseModel {
    return new CourseModel(row);
  }

  async insert(model: CourseModel): Promise<void> {
    await super.insert(model);

    await this.syncCollection(
      model.layouts.toArray(),
      [],
      entity => set(entity, 'courseId', model.id),
      this.servicesInstance.courseLayouts
    );
  }

  async update(model: CourseModel): Promise<void> {
    await super.update(model);

    // Update the CourseLayouts relationship
    const dbLayouts = await this.context.courseLayouts.getAllForCourse(
      model.id
    );

    await this.syncCollection(
      model.layouts.toArray(),
      dbLayouts,
      entity => set(entity, 'courseId', model.id),
      this.servicesInstance.courseLayouts
    );
  }
}

export default CourseRepository;
