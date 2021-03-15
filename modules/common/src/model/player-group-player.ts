import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';

export interface PlayerGroupPlayerAttributes {
  playerGroupId?: number;
  playerId?: number;
}

export default class PlayerGroupPlayerModel
  extends DirtLeagueModel<PlayerGroupPlayerAttributes>
  implements Cloneable<PlayerGroupPlayerModel> {
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
    this.attributes.playerGroupId = value;
  }

  get playerId(): number {
    return this.attributes.playerId;
  }

  set playerId(value: number) {
    this.attributes.playerId = value;
  }

  clone(): PlayerGroupPlayerModel {
    const obj = this.toJson();

    return new PlayerGroupPlayerModel(obj);
  }
}
