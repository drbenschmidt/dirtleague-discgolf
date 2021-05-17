import { validate, ValidationError } from 'class-validator';
import Cloneable from '../interfaces/cloneable';
import Validatable, { onlyClient } from '../interfaces/validatable';
import DirtLeagueModel from './dl-model';

// eslint-disable-next-line import/prefer-default-export
export enum RatingType {
  Event = 0,
  League = 1,
  Personal = 2,
}

export interface PlayerRatingAttributes {
  id?: number;
  playerId: number;
  cardId: number;
  date: Date;
  rating: number;
  type: RatingType;
}

class PlayerRatingModel
  extends DirtLeagueModel<PlayerRatingAttributes>
  implements Cloneable<PlayerRatingModel>, Validatable {
  static defaults = {
    firstName: '',
    lastName: '',
    aliases: [] as PlayerRatingAttributes[],
  };

  constructor(obj: Record<string, any> = {}) {
    super({
      ...PlayerRatingModel.defaults,
      ...obj,
    });
  }

  get id(): number {
    return this.attributes.id;
  }

  set id(value: number) {
    this.setInt('id', value);
  }

  get playerId(): number {
    return this.attributes.playerId;
  }

  set playerId(value: number) {
    this.setInt('playerId', value);
  }

  get cardId(): number {
    return this.attributes.cardId;
  }

  set cardId(value: number) {
    this.setInt('cardId', value);
  }

  get date(): Date {
    return new Date(this.attributes.date);
  }

  set date(value: Date) {
    this.set('date', value);
  }

  get rating(): number {
    return this.attributes.rating;
  }

  set rating(value: number) {
    this.setInt('rating', value);
  }

  get type(): RatingType {
    return this.attributes.type;
  }

  set type(value: RatingType) {
    this.setInt('type', value);
  }

  clone(): PlayerRatingModel {
    const obj = this.toJson();

    return new PlayerRatingModel(obj);
  }

  async validate(): Promise<ValidationError[]> {
    const result = await validate(this, onlyClient);

    return result;
  }
}

export default PlayerRatingModel;
