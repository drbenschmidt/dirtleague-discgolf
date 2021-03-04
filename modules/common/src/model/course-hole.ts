import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';

export interface CourseHoleAttributes {
  id?: number;

  number?: number;

  distance?: number;

  par?: number;
}

export default class CourseHoleModel
  extends DirtLeagueModel<CourseHoleAttributes>
  implements Cloneable<CourseHoleModel> {
  defaults = {
    name: '',
    number: 0,
    distance: 0,
    par: 3,
  };

  get id(): number {
    return this.attributes.id;
  }

  set id(value: number) {
    this.attributes.id = value;
  }

  get number(): number {
    return this.attributes.number;
  }

  set number(value: number) {
    this.attributes.number = value;
  }

  get distance(): number {
    return this.attributes.distance;
  }

  set distance(value: number) {
    this.attributes.distance = value;
  }

  get par(): number {
    return this.attributes.par;
  }

  set par(value: number) {
    this.attributes.par = value;
  }

  clone(): CourseHoleModel {
    const obj = this.toJson();

    return new CourseHoleModel(obj);
  }
}
