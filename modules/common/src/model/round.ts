import Cloneable from '../interfaces/cloneable';
import { CardAttributes } from './card';
import DirtLeagueModel from './dl-model';

export interface RoundAttributes {
  id?: number;
  eventId?: number;
  courseLayoutId?: number;
  cards?: CardAttributes[];
  name?: string;
}

export default class RoundModel
  extends DirtLeagueModel<RoundAttributes>
  implements Cloneable<RoundModel> {
  static defaults = {
    name: '',
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

  get courseLayoutId(): number {
    return this.attributes.courseLayoutId;
  }

  set courseLayoutId(value: number) {
    this.attributes.courseLayoutId = value;
  }

  get name(): string {
    return this.attributes.name;
  }

  set name(val: string) {
    this.attributes.name = val;
  }

  clone(): RoundModel {
    const obj = this.toJson();

    return new RoundModel(obj);
  }
}
