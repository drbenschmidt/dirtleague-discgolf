import { validate, ValidationError, IsDate, Length } from 'class-validator';
import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';
import Validatable, { onlyClient } from '../interfaces/validatable';

export interface SeasonAttributes {
  id?: number;
  name?: string;
  startDate?: Date;
  endDate?: Date;
}

export default class SeasonModel
  extends DirtLeagueModel<SeasonAttributes>
  implements Cloneable<SeasonModel>, Validatable {
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
    this.setInt('id', value);
  }

  @Length(1, 128, onlyClient)
  get name(): string {
    return this.attributes.name;
  }

  set name(value: string) {
    this.set('name', value);
  }

  @IsDate(onlyClient)
  get startDate(): Date {
    if (this.attributes.startDate instanceof Date) {
      return this.attributes.startDate;
    }

    return new Date(this.attributes.startDate);
  }

  set startDate(value: Date) {
    this.set('startDate', value);
  }

  @IsDate(onlyClient)
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

  async validate(): Promise<ValidationError[]> {
    const result = await validate(this, onlyClient);

    return result;
  }
}
