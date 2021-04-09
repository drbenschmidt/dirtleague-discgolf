import { validate, ValidationError, IsInt, IsPositive } from 'class-validator';
import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';
import Validatable, { onlyClient } from '../interfaces/validatable';

export interface CourseHoleAttributes {
  id?: number;
  courseLayoutId?: number;
  number?: number;
  distance?: number;
  par?: number;
}

export default class CourseHoleModel
  extends DirtLeagueModel<CourseHoleAttributes>
  implements Cloneable<CourseHoleModel>, Validatable {
  static defaults = {
    number: 0,
    distance: 1,
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
    this.setInt('id', value);
  }

  get courseLayoutId(): number {
    return this.attributes.courseLayoutId;
  }

  set courseLayoutId(value: number) {
    this.setInt('courseLayoutId', value);
  }

  @IsInt(onlyClient)
  @IsPositive(onlyClient)
  get number(): number {
    return this.attributes.number;
  }

  set number(value: number) {
    this.setInt('number', value);
  }

  @IsInt(onlyClient)
  @IsPositive(onlyClient)
  get distance(): number {
    return this.attributes.distance;
  }

  set distance(value: number) {
    this.setInt('distance', value);
  }

  @IsInt(onlyClient)
  @IsPositive(onlyClient)
  get par(): number {
    return this.attributes.par;
  }

  set par(value: number) {
    this.setInt('par', value);
  }

  clone(): CourseHoleModel {
    const obj = this.toJson();

    return new CourseHoleModel(obj);
  }

  async validate(): Promise<ValidationError[]> {
    const result = await validate(this, onlyClient);

    return result;
  }
}
