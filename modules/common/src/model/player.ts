import {
  validate,
  Length,
  ValidationError,
  ValidateNested,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Memoize } from 'typescript-memoize';
import { LinkedList } from 'linked-list-typescript';
import Cloneable from '../interfaces/cloneable';
import AliasModel, { AliasAttributes } from './alias';
import DirtLeagueModel from './dl-model';
import Validatable, { onlyClient } from '../interfaces/validatable';

export interface PlayerAttributes {
  id?: number;
  firstName?: string;
  lastName?: string;
  currentRating?: number;
  yearJoined: number;
  bio: string;
  aliases?: AliasAttributes[];
}

class PlayerModel
  extends DirtLeagueModel<PlayerAttributes>
  implements Cloneable<PlayerModel>, Validatable {
  static defaults = {
    firstName: '',
    lastName: '',
    aliases: [] as AliasAttributes[],
  };

  constructor(obj: Record<string, any> = {}) {
    super({
      ...PlayerModel.defaults,
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
  get firstName(): string {
    return this.attributes.firstName;
  }

  set firstName(value: string) {
    this.set('firstName', value);
  }

  @Length(1, 128, onlyClient)
  get lastName(): string {
    return this.attributes.lastName;
  }

  set lastName(value: string) {
    this.set('lastName', value);
  }

  get currentRating(): number {
    return this.attributes.currentRating;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @IsOptional(onlyClient)
  @Min(2015, onlyClient)
  @Max(2099, onlyClient)
  get yearJoined(): number {
    return this.attributes.yearJoined;
  }

  set yearJoined(value: number) {
    this.setInt('yearJoined', value);
  }

  @Length(0, 1028, onlyClient)
  get bio(): string {
    return this.attributes.bio;
  }

  set bio(value: string) {
    this.attributes.bio = value;
  }

  @Memoize()
  get aliases(): LinkedList<AliasModel> {
    return new LinkedList<AliasModel>(
      ...this.attributes?.aliases?.map(
        (v: AliasAttributes) => new AliasModel(v)
      )
    );
  }

  @ValidateNested({ each: true, ...onlyClient })
  private get aliasValidator(): AliasModel[] {
    return this.aliases.toArray();
  }

  clone(): PlayerModel {
    const obj = this.toJson();

    return new PlayerModel(obj);
  }

  async validate(): Promise<ValidationError[]> {
    const result = await validate(this, onlyClient);

    return result;
  }
}

export default PlayerModel;
