import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';

export interface PlayerGroupResultAttributes {
  playerGroupId?: number;
  courseHoleId?: number;
  score?: number;
}

export default class PlayerGroupResultModel
  extends DirtLeagueModel<PlayerGroupResultAttributes>
  implements Cloneable<PlayerGroupResultModel> {
  static defaults = {};

  constructor(obj: Record<string, any> = {}) {
    super({
      ...PlayerGroupResultModel.defaults,
      ...obj,
    });
  }

  get playerGroupId(): number {
    return this.attributes.playerGroupId;
  }

  set playerGroupId(value: number) {
    this.setInt('playerGroupId', value);
  }

  get courseHoleId(): number {
    return this.attributes.courseHoleId;
  }

  set courseHoleId(value: number) {
    this.setInt('courseHoleId', value);
  }

  get score(): number {
    return this.attributes.score;
  }

  set score(value: number) {
    this.setInt('score', value);
  }

  get courseHoleNumber(): number | undefined {
    return this.getAttribute<number>('courseHoleNumber');
  }

  clone(): PlayerGroupResultModel {
    const obj = this.toJson();

    return new PlayerGroupResultModel(obj);
  }
}
