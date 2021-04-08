import { validate, IsInt, ValidationError } from 'class-validator';
import { Memoize } from 'typescript-memoize';
import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';
import PlayerModel, { PlayerAttributes } from './player';
import Validatable, { onlyClient } from '../interfaces/validatable';

export interface PlayerGroupPlayerAttributes {
  playerGroupId?: number;
  playerId?: number;
}

export default class PlayerGroupPlayerModel
  extends DirtLeagueModel<PlayerGroupPlayerAttributes>
  implements Cloneable<PlayerGroupPlayerModel>, Validatable {
  static defaults = {};

  constructor(obj: Record<string, any> = {}) {
    super({
      ...PlayerGroupPlayerModel.defaults,
      ...obj,
    });
  }

  get playerGroupId(): number {
    return this.attributes.playerGroupId;
  }

  set playerGroupId(value: number) {
    this.setInt('playerGroupId', value);
  }

  get playerId(): number {
    return this.attributes.playerId;
  }

  @IsInt(onlyClient)
  set playerId(value: number) {
    this.setInt('playerId', value);
  }

  @Memoize()
  get player(): PlayerModel | undefined {
    const player = this.getAttribute<PlayerAttributes>('player');

    if (player) {
      return new PlayerModel(player);
    }

    return undefined;
  }

  @Memoize()
  get rating(): number | undefined {
    const rating = this.getAttribute<number>('rating');

    if (rating) {
      return rating;
    }

    return undefined;
  }

  clone(): PlayerGroupPlayerModel {
    const obj = this.toJson();

    return new PlayerGroupPlayerModel(obj);
  }

  async validate(): Promise<ValidationError[]> {
    const result = await validate(this, onlyClient);

    return result;
  }
}
