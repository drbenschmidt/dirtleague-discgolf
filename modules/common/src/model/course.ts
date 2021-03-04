import { Memoize } from 'typescript-memoize';
import LinkedList from '../collections/linkedList';
import Cloneable from '../interfaces/cloneable';
import CourseLayoutModel, { CourseLayoutAttributes } from './course-layout';
import DirtLeagueModel from './dl-model';

export interface CourseAttributes {
  id?: number;

  name?: string;

  courseLayouts?: CourseLayoutAttributes[];
}

export default class CourseModel
  extends DirtLeagueModel<CourseAttributes>
  implements Cloneable<CourseModel> {
  defaults = {
    name: '',
  };

  get id(): number {
    return this.attributes.id;
  }

  set id(value: number) {
    this.attributes.id = value;
  }

  get name(): string {
    return this.attributes.name;
  }

  set name(val: string) {
    this.attributes.name = val;
  }

  @Memoize()
  get courseLayouts(): LinkedList<CourseLayoutModel> {
    return new LinkedList<CourseLayoutModel>(
      this.attributes?.courseLayouts?.map(
        (v: CourseLayoutAttributes) => new CourseLayoutModel(v)
      )
    );
  }

  clone(): CourseModel {
    const obj = this.toJson();

    return new CourseModel(obj);
  }
}
