import { Memoize } from 'typescript-memoize';
import { LinkedList } from 'linked-list-typescript';
import Cloneable from '../interfaces/cloneable';
import AliasModel, { AliasAttributes } from './alias';
import DirtLeagueModel from './dl-model';

export interface PlayerAttributes {
  id?: number;

  firstName?: string;

  lastName?: string;

  currentRating?: number;

  aliases?: AliasAttributes[];
}

class PlayerModel
  extends DirtLeagueModel<PlayerAttributes>
  implements Cloneable<PlayerModel> {
  defaults = {
    firstName: '',
    lastName: '',
    aliases: [] as AliasAttributes[],
    currentRating: 0,
  };

  get id(): number {
    return this.attributes.id;
  }

  set id(value: number) {
    this.attributes.id = value;
  }

  get firstName(): string {
    return this.attributes.firstName;
  }

  set firstName(value: string) {
    this.attributes.firstName = value;
  }

  get lastName(): string {
    return this.attributes.lastName;
  }

  set lastName(value: string) {
    this.attributes.lastName = value;
  }

  get currentRating(): number {
    return this.attributes.currentRating;
  }

  set currentRating(value: number) {
    this.attributes.currentRating = value;
  }

  @Memoize()
  get aliases(): LinkedList<AliasModel> {
    return new LinkedList<AliasModel>(
      ...this.attributes?.aliases?.map(
        (v: AliasAttributes) => new AliasModel(v)
      )
    );
  }

  clone(): PlayerModel {
    const obj = this.toJson();

    return new PlayerModel(obj);
  }
}

export default PlayerModel;
