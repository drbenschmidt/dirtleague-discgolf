import { Memoize } from 'typescript-memoize';
import Cloneable from '../interfaces/cloneable';
import { CourseHoleAttributes } from './course-hole';
import LinkedList from '../collections/linkedList';
import DirtLeagueModel from './dl-model';
import { CourseHoleModel } from '..';

export interface CourseLayoutAttributes {
  id?: number;

  name?: string;

  holes?: CourseHoleAttributes[];
}

export default class CourseLayoutModel
  extends DirtLeagueModel<CourseLayoutAttributes>
  implements Cloneable<CourseLayoutModel> {
  defaults = {
    name: '',
    holes: [] as CourseHoleAttributes[],
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
  get holes(): LinkedList<CourseHoleModel> {
    return new LinkedList<CourseHoleModel>(
      this.attributes?.holes?.map(
        (v: CourseHoleAttributes) => new CourseLayoutModel(v)
      )
    );
  }

  clone(): CourseLayoutModel {
    const obj = this.toJson();

    return new CourseLayoutModel(obj);
  }
}
