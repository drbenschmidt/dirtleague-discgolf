import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';

export interface CourseHoleAttributes {
  id?: number;
  courseLayoutId?: number;
  number?: number;
  distance?: number;
  par?: number;
}

export default class CourseHoleModel
  extends DirtLeagueModel<CourseHoleAttributes>
  implements Cloneable<CourseHoleModel> {
  static defaults = {
    number: 0,
    distance: 0,
    par: 3,
  };

  constructor(obj: Record<string, any> = {}) {
    super({
      ...CourseHoleModel.defaults,
      ...obj,
    });
  }

  get id(): number {
    return this.attributes.id;
  }

  set id(value: number) {
    this.set('id', value);
  }

  get courseLayoutId(): number {
    return this.attributes.courseLayoutId;
  }

  set courseLayoutId(value: number) {
    this.set('courseLayoutId', value);
  }

  get number(): number {
    return this.attributes.number;
  }

  set number(value: number) {
    this.set('number', value);
  }

  get distance(): number {
    return this.attributes.distance;
  }

  set distance(value: number) {
    this.set('distance', value);
  }

  get par(): number {
    return this.attributes.par;
  }

  set par(value: number) {
    this.set('par', value);
  }

  clone(): CourseHoleModel {
    const obj = this.toJson();

    return new CourseHoleModel(obj);
  }
}
