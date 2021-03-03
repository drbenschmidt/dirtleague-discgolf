import { Memoize } from 'typescript-memoize';
import Cloneable from '../interfaces/cloneable';
import AliasModel, { AliasAttributes } from './alias';
import DirtLeagueModel from './dl-model';
import LinkedList from '../collections/linkedList';

interface ProfileAttributes {
  id?: number;

  firstName?: string;

  lastName?: string;

  currentRating?: number;

  aliases?: AliasAttributes[];
}

class ProfileModel
  extends DirtLeagueModel<ProfileAttributes>
  implements Cloneable<ProfileModel> {
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
      this.attributes?.aliases?.map((v: AliasAttributes) => new AliasModel(v))
    );
  }

  clone(): ProfileModel {
    const obj = this.toJson();

    return new ProfileModel(obj);
  }
}

export default ProfileModel;
