import { Memoize } from 'typescript-memoize';
import { LinkedList } from 'linked-list-typescript';
import Cloneable from '../interfaces/cloneable';
import CourseLayoutModel, { CourseLayoutAttributes } from './course-layout';
import DirtLeagueModel from './dl-model';

export interface CourseAttributes {
  id?: number;

  name?: string;

  layouts?: CourseLayoutAttributes[];

  dgcrSse?: number;
}

export default class CourseModel
  extends DirtLeagueModel<CourseAttributes>
  implements Cloneable<CourseModel> {
  static defaults = {
    name: '',
    layouts: [] as CourseLayoutAttributes[],
  };

  constructor(obj: Record<string, any>) {
    super({
      ...CourseModel.defaults,
      ...obj,
    });
  }

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

  get dgcrSse(): number {
    return this.attributes.dgcrSse;
  }

  set dgcrSse(value: number) {
    this.attributes.dgcrSse = value;
  }

  @Memoize()
  get layouts(): LinkedList<CourseLayoutModel> {
    return new LinkedList<CourseLayoutModel>(
      ...this.attributes?.layouts?.map(
        (v: CourseLayoutAttributes) => new CourseLayoutModel(v)
      )
    );
  }

  clone(): CourseModel {
    const obj = this.toJson();

    return new CourseModel(obj);
  }
}
