import { Memoize } from 'typescript-memoize';
import Cloneable from '../interfaces/cloneable';
import type Role from '../security/roles';
import DirtLeagueModel from './dl-model';
import PlayerModel, { PlayerAttributes } from './player';

export interface UserAttributes {
  id: number;
  email: string;
  roles: Role[];
  password?: string;
  playerId?: number;
}

export default class UserModel
  extends DirtLeagueModel<UserAttributes>
  implements Cloneable<UserModel> {
  static defaults = {
    name: '',
    email: '',
    roles: [] as Role[],
  };

  constructor(obj: Record<string, any> = {}) {
    super({
      ...UserModel.defaults,
      ...obj,
    });
  }

  get id(): number {
    return this.attributes.id;
  }

  get roles(): Role[] {
    return this.attributes.roles;
  }

  set roles(value: Role[]) {
    this.set('roles', value);
  }

  get email(): string {
    return this.attributes.email;
  }

  get playerId(): number {
    return this.attributes.playerId;
  }

  get password(): string {
    return this.attributes.password;
  }

  @Memoize()
  get player(): PlayerModel | undefined {
    const model = this.getAttribute<PlayerAttributes>('player');

    if (model) {
      return new PlayerModel(model);
    }

    return undefined;
  }

  clone(): UserModel {
    const obj = this.toJson();

    return new UserModel(obj);
  }
}
