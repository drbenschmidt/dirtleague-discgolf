import { LinkedList } from 'linked-list-typescript';
import { Memoize } from 'typescript-memoize';
import Cloneable from '../interfaces/cloneable';
import PlayerGroupModel, { PlayerGroupAttributes } from './player-group';
import DirtLeagueModel from './dl-model';

export interface CardAttributes {
  id?: number;
  roundId?: number;
  playerGroups?: PlayerGroupAttributes[];
}

export default class CardModel
  extends DirtLeagueModel<CardAttributes>
  implements Cloneable<CardModel> {
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
    this.attributes.id = value;
  }

  get roundId(): number {
    return this.attributes.roundId;
  }

  set roundId(value: number) {
    this.attributes.roundId = value;
  }

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
}
