import {
  validate,
  Length,
  ValidationError,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { LinkedList } from 'linked-list-typescript';
import { Memoize } from 'typescript-memoize';
import CourseModel, { CourseAttributes } from './course';
import Cloneable from '../interfaces/cloneable';
import CardModel, { CardAttributes } from './card';
import CourseLayoutModel, { CourseLayoutAttributes } from './course-layout';
import DirtLeagueModel from './dl-model';
import Validatable, { onlyClient } from '../interfaces/validatable';

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
  implements Cloneable<RoundModel>, Validatable {
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
    this.setInt('id', value);
  }

  get eventId(): number {
    return this.attributes.eventId;
  }

  set eventId(value: number) {
    this.setInt('eventId', value);
  }

  @IsInt(onlyClient)
  get courseId(): number {
    return this.attributes.courseId;
  }

  set courseId(value: number) {
    this.setInt('courseId', value);
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

  @IsInt(onlyClient)
  get courseLayoutId(): number {
    return this.attributes.courseLayoutId;
  }

  set courseLayoutId(value: number) {
    this.setInt('courseLayoutId', value);
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

  set name(value: string) {
    this.set('name', value);
  }

  @Memoize()
  get cards(): LinkedList<CardModel> {
    return new LinkedList<CardModel>(
      ...this.attributes?.cards?.map((v: CardAttributes) => new CardModel(v))
    );
  }

  @ValidateNested({ each: true, ...onlyClient })
  private get cardsValidator(): CardModel[] {
    return this.cards.toArray();
  }

  clone(): RoundModel {
    const obj = this.toJson();

    return new RoundModel(obj);
  }

  async validate(): Promise<ValidationError[]> {
    const result = await validate(this, onlyClient);

    return result;
  }
}
