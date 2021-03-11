import DirtLeagueModel from './dl-model';

export interface SeasonAttributes {
  id?: number;

  name?: string;

  startDate?: Date;

  endDate?: Date;
}

export default class SeasonModel extends DirtLeagueModel<SeasonAttributes> {
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
    return this.attributes.startDate;
  }

  set startDate(val: Date) {
    this.attributes.startDate = val;
  }

  get endDate(): Date {
    return this.attributes.endDate;
  }

  set endDate(val: Date) {
    this.attributes.endDate = val;
  }
}
