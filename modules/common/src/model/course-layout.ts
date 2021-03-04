import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';

export interface CourseLayoutAttributes {
  id?: number;

  name?: string;
}

export default class CourseLayoutModel
  extends DirtLeagueModel<CourseLayoutAttributes>
  implements Cloneable<CourseLayoutModel> {
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

  clone(): CourseLayoutModel {
    const obj = this.toJson();

    return new CourseLayoutModel(obj);
  }
}
