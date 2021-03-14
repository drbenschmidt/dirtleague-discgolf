import { LinkedList } from 'linked-list-typescript';
import { Memoize } from 'typescript-memoize';
import Cloneable from '../interfaces/cloneable';
import DirtLeagueModel from './dl-model';

export interface CardThrowerAttributes {
  id?: number;
  teamName?: string;
  playerIds?: number[];
}

export default class CardThrowerModel
  extends DirtLeagueModel<CardThrowerAttributes>
  implements Cloneable<CardThrowerModel> {
  static defaults = {
    teamName: '',
    playerIds: [] as number[],
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
  get playerIds(): LinkedList<number> {
    return new LinkedList<number>(...this.attributes?.playerIds);
  }

  clone(): CardThrowerModel {
    const obj = this.toJson();

    return new CardThrowerModel(obj);
  }
}
