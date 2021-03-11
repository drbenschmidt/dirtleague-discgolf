import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';
import { RoundAttributes } from './round';

export interface EventAttributes {
  id?: number;

  courseId?: number;

  seasonId?: string;

  rounds?: RoundAttributes[];

  name?: string;

  startDate?: Date;
}

export default class EventModel
  extends DirtLeagueModel<EventAttributes>
  implements Cloneable<EventModel> {
  static defaults = {
    name: '',
    startDate: new Date(),
    rounds: [] as RoundAttributes[],
  };

  constructor(obj: Record<string, any> = {}) {
    super({
      ...EventModel.defaults,
      ...obj,
    });
  }

  get id(): number {
    return this.attributes.id;
  }

  set id(value: number) {
    this.attributes.id = value;
  }

  get courseId(): number {
    return this.attributes.courseId;
  }

  set courseId(value: number) {
    this.attributes.courseId = value;
  }

  get seasonId(): number {
    return this.attributes.seasonId;
  }

  set seasonId(value: number) {
    this.attributes.seasonId = value;
  }

  get name(): string {
    return this.attributes.name;
  }

  set name(val: string) {
    this.attributes.name = val;
  }

  get startDate(): Date {
    return this.attributes.startDate;
  }

  set startDate(val: Date) {
    this.attributes.startDate = val;
  }

  clone(): EventModel {
    const obj = this.toJson();

    return new EventModel(obj);
  }
}
