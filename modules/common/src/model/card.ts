import {
  validate,
  IsInt,
  ValidationError,
  ValidateNested,
} from 'class-validator';
import { LinkedList } from 'linked-list-typescript';
import { Memoize } from 'typescript-memoize';
import Cloneable from '../interfaces/cloneable';
import PlayerGroupModel, { PlayerGroupAttributes } from './player-group';
import DirtLeagueModel from './dl-model';
import Validatable from '../interfaces/validatable';

export interface CardAttributes {
  id?: number;
  roundId?: number;
  playerGroups?: PlayerGroupAttributes[];
}

export default class CardModel
  extends DirtLeagueModel<CardAttributes>
  implements Cloneable<CardModel>, Validatable {
  static defaults = {
    playerGroups: [] as PlayerGroupAttributes[],
  };

  constructor(obj: Record<string, any> = {}) {
    super({
      ...CardModel.defaults,
      ...obj,
    });
  }

  get id(): number {
    return this.attributes.id;
  }

  set id(value: number) {
    this.set('id', value);
  }

  @IsInt()
  get roundId(): number {
    return this.attributes.roundId;
  }

  set roundId(value: number) {
    this.set('roundId', value);
  }

  @ValidateNested()
  @Memoize()
  get playerGroups(): LinkedList<PlayerGroupModel> {
    return new LinkedList<PlayerGroupModel>(
      ...this.attributes?.playerGroups?.map(
        (v: PlayerGroupAttributes) => new PlayerGroupModel(v)
      )
    );
  }

  clone(): CardModel {
    const obj = this.toJson();

    return new CardModel(obj);
  }

  async validate(): Promise<ValidationError[]> {
    const result = await validate(this);

    return result;
  }
}
