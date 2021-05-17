import { validate, ValidationError } from 'class-validator';
import Cloneable from '../interfaces/cloneable';
import Validatable, { onlyClient } from '../interfaces/validatable';
import DirtLeagueModel from './dl-model';

// eslint-disable-next-line import/prefer-default-export
export enum RatingType {
  Event,
  League,
  Personal,
}

export interface PlayerRatingAttributes {
  id?: number;
  playerId: number;
  cardId: number;
  date: Date;
  rating: number;
  type: number;
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
