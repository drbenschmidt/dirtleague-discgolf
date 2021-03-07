import { Memoize } from 'typescript-memoize';
import { LinkedList } from 'linked-list-typescript';
import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';
import CourseHoleModel, { CourseHoleAttributes } from './course-hole';

const filledArray = (start: number, size: number): number[] => {
  return new Array(size).fill(true).map((v, index) => start + index);
};

export interface CourseLayoutAttributes {
  id?: number;

  courseId?: number;

  name?: string;

  holes?: CourseHoleAttributes[];
}

export default class CourseLayoutModel
  extends DirtLeagueModel<CourseLayoutAttributes>
  implements Cloneable<CourseLayoutModel> {
  defaults = {
    name: 'Default Layout',
    holes: [] as CourseHoleAttributes[],
  };

  get id(): number {
    return this.attributes.id;
  }

  set id(value: number) {
    this.attributes.id = value;
  }

  get courseId(): number {
    return this.attributes.courseId;
  }

  set courseId(value: number) {
    this.attributes.courseId = value;
  }

  get name(): string {
    return this.attributes.name;
  }

  set name(val: string) {
    this.attributes.name = val;
  }

  @Memoize()
  get holes(): LinkedList<CourseHoleModel> {
    return new LinkedList<CourseHoleModel>(
      ...this.attributes?.holes?.map(
        (v: CourseHoleAttributes) => new CourseHoleModel(v)
      )
    );
  }

  clone(): CourseLayoutModel {
    const obj = this.toJson();

    return new CourseLayoutModel(obj);
  }

  static createDefault(): CourseLayoutModel {
    return new CourseLayoutModel({
      name: 'New Layout',
      holes: filledArray(1, 18).map(val => ({
        number: val,
      })),
    });
  }
}
