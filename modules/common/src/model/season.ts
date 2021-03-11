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

  get startDate(): Date {
    if (this.attributes.startDate instanceof Date) {
      return this.attributes.startDate;
    }

    return new Date(this.attributes.startDate);
  }

  set startDate(val: Date) {
    this.attributes.startDate = val;
  }

  get endDate(): Date {
    if (this.attributes.endDate instanceof Date) {
      return this.attributes.endDate;
    }

    return new Date(this.attributes.endDate);
  }

  set endDate(val: Date) {
    this.attributes.endDate = val;
  }

  clone(): SeasonModel {
    const obj = this.toJson();

    return new SeasonModel(obj);
  }
}
