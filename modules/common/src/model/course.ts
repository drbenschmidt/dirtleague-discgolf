import {
  validate,
  ValidationError,
  ValidateNested,
  ArrayNotEmpty,
  Length,
} from 'class-validator';
import { Memoize } from 'typescript-memoize';
import { LinkedList } from 'linked-list-typescript';
import Cloneable from '../interfaces/cloneable';
import CourseLayoutModel, { CourseLayoutAttributes } from './course-layout';
import DirtLeagueModel from './dl-model';
import Validatable, { onlyClient } from '../interfaces/validatable';

export interface CourseAttributes {
  id?: number;
  name?: string;
  layouts?: CourseLayoutAttributes[];
}

export default class CourseModel
  extends DirtLeagueModel<CourseAttributes>
  implements Cloneable<CourseModel>, Validatable {
  static defaults = {
    name: '',
    layouts: [] as CourseLayoutAttributes[],
  };

  constructor(obj: Record<string, any> = {}) {
    super({
      ...CourseModel.defaults,
      ...obj,
    });
  }

  get id(): number {
    return this.attributes.id;
  }

  set id(value: number) {
    this.setInt('id', value);
  }

  @Length(1, 128, onlyClient)
  get name(): string {
    return this.attributes.name;
  }

  set name(value: string) {
    this.set('name', value);
  }

  @Memoize()
  get layouts(): LinkedList<CourseLayoutModel> {
    return new LinkedList<CourseLayoutModel>(
      ...this.attributes?.layouts?.map(
        (v: CourseLayoutAttributes) => new CourseLayoutModel(v)
      )
    );
  }

  @ArrayNotEmpty(onlyClient)
  @ValidateNested({ each: true, ...onlyClient })
  private get layoutValidator(): CourseLayoutModel[] {
    return this.layouts.toArray();
  }

  clone(): CourseModel {
    const obj = this.toJson();

    return new CourseModel(obj);
  }

  async validate(): Promise<ValidationError[]> {
    const result = await validate(this, onlyClient);

    return result;
  }
}
