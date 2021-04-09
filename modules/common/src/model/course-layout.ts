import {
  validate,
  ValidationError,
  ValidateNested,
  ArrayNotEmpty,
  Length,
  IsPositive,
} from 'class-validator';
import { Memoize } from 'typescript-memoize';
import { LinkedList } from 'linked-list-typescript';
import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';
import CourseHoleModel, { CourseHoleAttributes } from './course-hole';
import filledArray from '../utils/filledArray';
import Validatable, { onlyClient } from '../interfaces/validatable';

export interface CourseLayoutAttributes {
  id?: number;
  courseId?: number;
  dgcrSse?: number;
  name?: string;
  holes?: CourseHoleAttributes[];
}

export default class CourseLayoutModel
  extends DirtLeagueModel<CourseLayoutAttributes>
  implements Cloneable<CourseLayoutModel>, Validatable {
  static defaults = {
    name: 'Default Layout',
    holes: filledArray(1, 18).map(val => ({
      number: val,
    })) as CourseHoleAttributes[],
  };

  constructor(obj: Record<string, any> = {}) {
    super({
      ...CourseLayoutModel.defaults,
      ...obj,
    });
  }

  get id(): number {
    return this.attributes.id;
  }

  set id(value: number) {
    this.setInt('id', value);
  }

  get courseId(): number {
    return this.attributes.courseId;
  }

  set courseId(value: number) {
    this.setInt('courseId', value);
  }

  @IsPositive(onlyClient)
  get dgcrSse(): number {
    return this.attributes.dgcrSse;
  }

  set dgcrSse(value: number) {
    this.setFloat('dgcrSse', value);
  }

  @Length(1, 128, onlyClient)
  get name(): string {
    return this.attributes.name;
  }

  set name(value: string) {
    this.set('name', value);
  }

  @Memoize()
  get holes(): LinkedList<CourseHoleModel> {
    return new LinkedList<CourseHoleModel>(
      ...this.attributes?.holes?.map(
        (v: CourseHoleAttributes) => new CourseHoleModel(v)
      )
    );
  }

  @ArrayNotEmpty(onlyClient)
  @ValidateNested({ each: true, ...onlyClient })
  private get holesValidator(): CourseHoleModel[] {
    return this.holes.toArray();
  }

  clone(): CourseLayoutModel {
    const obj = this.toJson();

    return new CourseLayoutModel(obj);
  }

  async validate(): Promise<ValidationError[]> {
    const result = await validate(this, onlyClient);

    return result;
  }
}
