import DirtLeagueModel from './dl-model';

export interface IdNamePairAttributes {
  id?: number;

  name?: string;
}

export default class IdNamePairModel extends DirtLeagueModel<IdNamePairAttributes> {
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
}
