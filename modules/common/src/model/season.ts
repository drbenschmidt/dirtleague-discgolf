import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';

export interface SeasonAttributes {
  id?: number;
  name?: string;
  startDate?: Date;
  endDate?: Date;
}

export default class SeasonModel
  extends DirtLeagueModel<SeasonAttributes>
  implements Cloneable<SeasonModel> {
  static defaults = {
    name: '',
    startDate: new Date(),
    endDate: new Date(),
  };

  constructor(obj: Record<string, any> = {}) {
    super({
      ...SeasonModel.defaults,
      ...obj,
    });
  }

  get id(): number {
    return this.attributes.id;
  }

  set id(value: number) {
    this.set('id', value);
  }

  get name(): string {
    return this.attributes.name;
  }

  set name(value: string) {
    this.set('name', value);
  }

  get startDate(): Date {
    if (this.attributes.startDate instanceof Date) {
      return this.attributes.startDate;
    }

    return new Date(this.attributes.startDate);
  }

  set startDate(value: Date) {
    this.set('startDate', value);
  }

  get endDate(): Date {
    if (this.attributes.endDate instanceof Date) {
      return this.attributes.endDate;
    }

    return new Date(this.attributes.endDate);
  }

  set endDate(value: Date) {
    this.set('endDate', value);
  }

  clone(): SeasonModel {
    const obj = this.toJson();

    return new SeasonModel(obj);
  }
}
