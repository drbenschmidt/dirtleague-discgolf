import { validate, IsInt, Length, ValidationError } from 'class-validator';
import Cloneable from '../interfaces/cloneable';
import Validatable, { onlyClient, onlyServer } from '../interfaces/validatable';
import DirtLeagueModel from './dl-model';

export interface AliasAttributes {
  id?: number;
  playerId?: number;
  value?: string;
}

export default class AliasModel
  extends DirtLeagueModel<AliasAttributes>
  implements Cloneable<AliasModel>, Validatable {
  static defaults = {};

  constructor(obj: Record<string, any> = {}) {
    super({
      ...AliasModel.defaults,
      ...obj,
    });
  }

  get id(): number {
    return this.attributes.id;
  }

  set id(value: number) {
    this.set('id', value);
  }

  @IsInt(onlyServer)
  get playerId(): number {
    return this.attributes.playerId;
  }

  set playerId(value: number) {
    this.set('playerId', value);
  }

  @Length(1, 128, onlyClient)
  get value(): string {
    return this.attributes.value;
  }

  set value(val: string) {
    this.set('value', val);
  }

  clone(): AliasModel {
    const obj = this.toJson();

    return new AliasModel(obj);
  }

  async validate(): Promise<ValidationError[]> {
    const result = await validate(this, onlyClient);

    return result;
  }
}
