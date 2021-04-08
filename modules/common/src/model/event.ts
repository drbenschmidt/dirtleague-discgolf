import {
  validate,
  Length,
  ValidationError,
  ValidateNested,
  IsDate,
  IsInt,
} from 'class-validator';
import { LinkedList } from 'linked-list-typescript';
import { Memoize } from 'typescript-memoize';
import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';
import RoundModel, { RoundAttributes } from './round';
import Validatable, { onlyClient } from '../interfaces/validatable';

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
  implements Cloneable<EventModel>, Validatable {
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
    this.setInt('id', value);
  }

  @IsInt(onlyClient)
  get seasonId(): number {
    return this.attributes.seasonId;
  }

  set seasonId(value: number) {
    this.setInt('seasonId', value);
  }

  @Length(1, 128, onlyClient)
  get name(): string {
    return this.attributes.name;
  }

  set name(value: string) {
    this.set('name', value);
  }

  @Length(1, 128, onlyClient)
  get description(): string {
    return this.attributes.description;
  }

  set description(value: string) {
    this.set('description', value);
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

  @Memoize()
  get rounds(): LinkedList<RoundModel> {
    return new LinkedList<RoundModel>(
      ...this.attributes?.rounds?.map((v: RoundAttributes) => new RoundModel(v))
    );
  }

  @ValidateNested({ each: true, ...onlyClient })
  private get roundsValidator(): RoundModel[] {
    return this.rounds.toArray();
  }

  clone(): EventModel {
    const obj = this.toJson();

    return new EventModel(obj);
  }

  async validate(): Promise<ValidationError[]> {
    const result = await validate(this, onlyClient);

    return result;
  }
}
