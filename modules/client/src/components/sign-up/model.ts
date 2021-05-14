/* eslint-disable max-classes-per-file */
import {
  Cloneable,
  DirtLeagueModel,
  PlayerModel,
  UserModel,
} from '@dirtleague/common';

export interface SignUpModelAttributes {
  email?: string;
  password?: string;
  password2?: string;
  firstName?: string;
  lastName?: string;
}

export interface SignUpRequestAttributes {
  user: UserModel;
  player: PlayerModel;
}

export class SignUpRequestModel extends DirtLeagueModel<SignUpRequestAttributes> {
  get user(): UserModel {
    return this.attributes.user;
  }

  get player(): PlayerModel {
    return this.attributes.player;
  }
}

export class SignUpModel
  extends DirtLeagueModel<SignUpModelAttributes>
  implements Cloneable<SignUpModel> {
  defaults = {
    email: '',
    password: '',
    password2: '',
    firstName: '',
    lastName: '',
  };

  email?: string;
  password?: string;
  password2?: string;
  firstName?: string;
  lastName?: string;

  clone(): SignUpModel {
    return new SignUpModel(this.toJson());
  }

  toRequestModel(): SignUpRequestModel {
    const obj = this.toJson();

    return new SignUpRequestModel({
      user: new UserModel(obj),
      player: new PlayerModel(obj),
    });
  }
}
