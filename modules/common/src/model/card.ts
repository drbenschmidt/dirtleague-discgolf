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
import Validatable, { onlyClient, onlyServer } from '../interfaces/validatable';

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
    this.setInt('id', value);
  }

  @IsInt(onlyServer)
  get roundId(): number {
    return this.attributes.roundId;
  }

  set roundId(value: number) {
    this.setInt('roundId', value);
  }

  @Memoize()
  get playerGroups(): LinkedList<PlayerGroupModel> {
    return new LinkedList<PlayerGroupModel>(
      ...this.attributes?.playerGroups?.map(
        (v: PlayerGroupAttributes) => new PlayerGroupModel(v)
      )
    );
  }

  @ValidateNested({ each: true, ...onlyClient })
  private get playerGroupsValidator(): PlayerGroupModel[] {
    return this.playerGroups.toArray();
  }

  clone(): CardModel {
    const obj = this.toJson();

    return new CardModel(obj);
  }

  async validate(): Promise<ValidationError[]> {
    const result = await validate(this, onlyClient);

    return result;
  }
}
