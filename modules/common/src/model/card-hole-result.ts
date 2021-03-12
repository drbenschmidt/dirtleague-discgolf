import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';

export interface CardHoleResultAttributes {
  id?: number;
  cardThrowerId?: number;
  courseHoleId?: number;
  score?: number;
}

export default class CardHoleResultModel
  extends DirtLeagueModel<CardHoleResultAttributes>
  implements Cloneable<CardHoleResultModel> {
  static defaults = {};

  constructor(obj: Record<string, any> = {}) {
    super({
      ...CardHoleResultModel.defaults,
      ...obj,
    });
  }

  get id(): number {
    return this.attributes.id;
  }

  set id(value: number) {
    this.attributes.id = value;
  }

  get cardThrowerId(): number {
    return this.attributes.cardThrowerId;
  }

  set cardThrowerId(value: number) {
    this.attributes.cardThrowerId = value;
  }

  get courseHoleId(): number {
    return this.attributes.courseHoleId;
  }

  set courseHoleId(value: number) {
    this.attributes.courseHoleId = value;
  }

  get score(): number {
    return this.attributes.score;
  }

  set score(value: number) {
    this.attributes.score = value;
  }

  clone(): CardHoleResultModel {
    const obj = this.toJson();

    return new CardHoleResultModel(obj);
  }
}
