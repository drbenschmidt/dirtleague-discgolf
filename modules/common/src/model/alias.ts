import DirtLeagueModel from './dl-model';

export interface AliasAttributes {
  id?: number;

  playerId?: number;

  value?: string;
}

export default class AliasModel extends DirtLeagueModel<AliasAttributes> {
  get id(): number {
    return this.attributes.id;
  }

  set id(value: number) {
    this.attributes.id = value;
  }

  get playerId(): number {
    return this.attributes.playerId;
  }

  set playerId(value: number) {
    this.attributes.playerId = value;
  }

  get value(): string {
    return this.attributes.value;
  }

  set value(val: string) {
    this.attributes.value = val;
  }
}
