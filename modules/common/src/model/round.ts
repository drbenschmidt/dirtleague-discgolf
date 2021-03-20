import { LinkedList } from 'linked-list-typescript';
import { Memoize } from 'typescript-memoize';
import { CourseAttributes, CourseLayoutModel, CourseModel } from '..';
import Cloneable from '../interfaces/cloneable';
import CardModel, { CardAttributes } from './card';
import { CourseLayoutAttributes } from './course-layout';
import DirtLeagueModel from './dl-model';

export interface RoundAttributes {
  id?: number;
  eventId?: number;
  courseId?: number;
  courseLayoutId?: number;
  isComplete: boolean;
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
    isComplete: false,
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

  get isComplete(): boolean {
    return this.attributes.isComplete;
  }

  set isComplete(value: boolean) {
    this.set('isComplete', value);
  }

  @Memoize()
  get course(): CourseModel | undefined {
    const course = this.getAttribute<CourseAttributes>('course');

    if (course) {
      return new CourseModel(course);
    }

    return undefined;
  }

  get courseLayoutId(): number {
    return this.attributes.courseLayoutId;
  }

  set courseLayoutId(value: number) {
    this.attributes.courseLayoutId = value;
  }

  @Memoize()
  get courseLayout(): CourseLayoutModel | undefined {
    const courseLayout = this.getAttribute<CourseLayoutAttributes>(
      'courseLayout'
    );

    if (courseLayout) {
      return new CourseLayoutModel(courseLayout);
    }

    return undefined;
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
