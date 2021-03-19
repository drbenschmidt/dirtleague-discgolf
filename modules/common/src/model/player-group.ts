import { LinkedList } from 'linked-list-typescript';
import { Memoize } from 'typescript-memoize';
import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';
import PlayerGroupPlayerModel, {
  PlayerGroupPlayerAttributes,
} from './player-group-player';
import PlayerGroupResultModel, {
  PlayerGroupResultAttributes,
} from './player-group-result';

export interface PlayerGroupAttributes {
  id?: number;
  cardId?: number;
  teamName?: string;
  players?: PlayerGroupPlayerAttributes[];
}

export default class PlayerGroupModel
  extends DirtLeagueModel<PlayerGroupAttributes>
  implements Cloneable<PlayerGroupModel> {
  static defaults = {
    teamName: '',
    players: [] as PlayerGroupPlayerAttributes[],
  };

  constructor(obj: Record<string, any> = {}) {
    super({
      ...PlayerGroupModel.defaults,
      ...obj,
    });
  }

  get id(): number {
    return this.attributes.id;
  }

  set id(value: number) {
    this.attributes.id = value;
  }

  get cardId(): number {
    return this.attributes.cardId;
  }

  set cardId(value: number) {
    this.attributes.cardId = value;
  }

  get teamName(): string {
    return this.attributes.teamName;
  }

  set teamName(value: string) {
    this.attributes.teamName = value;
  }

  get results(): LinkedList<PlayerGroupResultModel> | undefined {
    const results = this.getAttribute<PlayerGroupResultAttributes[]>('results');

    if (results) {
      return new LinkedList<PlayerGroupResultModel>(
        ...results.map(
          (v: PlayerGroupResultAttributes) => new PlayerGroupResultModel(v)
        )
      );
    }

    return undefined;
  }

  @Memoize()
  get players(): LinkedList<PlayerGroupPlayerModel> {
    return new LinkedList<PlayerGroupPlayerModel>(
      ...this.attributes?.players?.map(
        (v: PlayerGroupPlayerAttributes) => new PlayerGroupPlayerModel(v)
      )
    );
  }

  clone(): PlayerGroupModel {
    const obj = this.toJson();

    return new PlayerGroupModel(obj);
  }
}
