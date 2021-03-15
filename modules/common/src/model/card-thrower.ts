import { LinkedList } from 'linked-list-typescript';
import { Memoize } from 'typescript-memoize';
import { IdNamePairModel } from '..';
import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';
import { IdNamePairAttributes } from './id-name-pair';

export interface CardThrowerAttributes {
  id?: number;
  teamName?: string;
  playerIds?: IdNamePairAttributes[];
}

export default class CardThrowerModel
  extends DirtLeagueModel<CardThrowerAttributes>
  implements Cloneable<CardThrowerModel> {
  static defaults = {
    teamName: '',
    playerIds: [] as IdNamePairAttributes[],
  };

  constructor(obj: Record<string, any> = {}) {
    super({
      ...CardThrowerModel.defaults,
      ...obj,
    });
  }

  get id(): number {
    return this.attributes.id;
  }

  set id(value: number) {
    this.attributes.id = value;
  }

  get teamName(): string {
    return this.attributes.teamName;
  }

  set teamName(value: string) {
    this.attributes.teamName = value;
  }

  @Memoize()
  get playerIds(): LinkedList<IdNamePairModel> {
    return new LinkedList<IdNamePairModel>(
      ...this.attributes?.playerIds?.map(
        (v: IdNamePairAttributes) => new IdNamePairModel(v)
      )
    );
  }

  clone(): CardThrowerModel {
    const obj = this.toJson();

    return new CardThrowerModel(obj);
  }
}
