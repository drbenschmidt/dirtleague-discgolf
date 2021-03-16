import { LinkedList } from 'linked-list-typescript';
import { Memoize } from 'typescript-memoize';
import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';
import RoundModel, { RoundAttributes } from './round';

export interface EventAttributes {
  id?: number;
  name?: string;
  description?: string;
  seasonId?: number;
  startDate?: Date;
  rounds?: RoundAttributes[];
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

  get description(): string {
    return this.attributes.description;
  }

  set description(val: string) {
    this.attributes.description = val;
  }

  get startDate(): Date {
    if (this.attributes.startDate instanceof Date) {
      return this.attributes.startDate;
    }

    return new Date(this.attributes.startDate);
  }

  set startDate(val: Date) {
    this.attributes.startDate = val;
  }

  @Memoize()
  get rounds(): LinkedList<RoundModel> {
    return new LinkedList<RoundModel>(
      ...this.attributes?.rounds?.map((v: RoundAttributes) => new RoundModel(v))
    );
  }

  clone(): EventModel {
    const obj = this.toJson();

    return new EventModel(obj);
  }
}
