import { LinkedList } from 'linked-list-typescript';
import { Memoize } from 'typescript-memoize';
import { CourseLayoutModel, CourseModel } from '..';
import Cloneable from '../interfaces/cloneable';
import CardModel, { CardAttributes } from './card';
import DirtLeagueModel from './dl-model';

export interface RoundAttributes {
  id?: number;
  eventId?: number;
  courseId?: number;
  courseLayoutId?: number;
  cards?: CardAttributes[];
  name?: string;
}

export default class RoundModel
  extends DirtLeagueModel<RoundAttributes>
  implements Cloneable<RoundModel> {
  static defaults = {
    name: 'New Round',
    startDate: new Date(),
    cards: [] as CardAttributes[],
  };

  constructor(obj: Record<string, any> = {}) {
    super({
      ...RoundModel.defaults,
      ...obj,
    });
  }

  get id(): number {
    return this.attributes.id;
  }

  set id(value: number) {
    this.attributes.id = value;
  }

  get eventId(): number {
    return this.attributes.eventId;
  }

  set eventId(value: number) {
    this.attributes.eventId = value;
  }

  get courseId(): number {
    return this.attributes.courseId;
  }

  set courseId(value: number) {
    this.set('courseId', value);
  }

  get course(): CourseModel | undefined {
    return (this.attributes as any).course;
  }

  get courseLayoutId(): number {
    return this.attributes.courseLayoutId;
  }

  set courseLayoutId(value: number) {
    this.attributes.courseLayoutId = value;
  }

  get courseLayout(): CourseLayoutModel | undefined {
    return (this.attributes as any).courseLayout;
  }

  get name(): string {
    return this.attributes.name;
  }

  set name(val: string) {
    this.attributes.name = val;
  }

  @Memoize()
  get cards(): LinkedList<CardModel> {
    return new LinkedList<CardModel>(
      ...this.attributes?.cards?.map((v: CardAttributes) => new CardModel(v))
    );
  }

  clone(): RoundModel {
    const obj = this.toJson();

    return new RoundModel(obj);
  }
}
