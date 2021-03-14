import { LinkedList } from 'linked-list-typescript';
import { Memoize } from 'typescript-memoize';
import Cloneable from '../interfaces/cloneable';
import CardThrowerModel, { CardThrowerAttributes } from './card-thrower';
import DirtLeagueModel from './dl-model';

export interface CardAttributes {
  id?: number;
  roundId?: number;
  cardThrowers?: CardThrowerAttributes[];
}

export default class CardModel
  extends DirtLeagueModel<CardAttributes>
  implements Cloneable<CardModel> {
  static defaults = {
    cardThrowers: [] as CardThrowerAttributes[],
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
  get cardThrowers(): LinkedList<CardThrowerModel> {
    return new LinkedList<CardThrowerModel>(
      ...this.attributes?.cardThrowers?.map(
        (v: CardThrowerAttributes) => new CardThrowerModel(v)
      )
    );
  }

  clone(): CardModel {
    const obj = this.toJson();

    return new CardModel(obj);
  }
}
