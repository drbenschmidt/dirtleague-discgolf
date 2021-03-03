/* eslint-disable max-classes-per-file */
import { Cloneable, UserModel } from '@dirtleague/common';
import DirtLeagueModel from '@dirtleague/common/src/model/dl-model';
import AuthServices, {
  AuthRequest,
  AuthResponse,
} from '../data-access/auth-services';
import type ApiFetch from '../data-access/api-fetch';

export interface AuthModelAttributes {
  email?: string;
  password?: string;
}

export class AuthModel
  extends DirtLeagueModel<AuthModelAttributes>
  implements Cloneable<AuthModel> {
  defaults = {
    email: '',
    password: '',
  };

  email?: string;

  password?: string;

  clone(): AuthModel {
    return new AuthModel(this.toJson());
  }
}

class AuthManager {
  service: AuthServices;

  isAuthenticated = false;

  user?: UserModel;

  constructor(apiFetch: ApiFetch) {
    this.service = new AuthServices({ api: apiFetch });
  }

  authenticate = async ({
    email,
    password,
  }: AuthModel): Promise<AuthResponse> => {
    const result = await this.service.auth(
      new AuthRequest({ email, password })
    );

    if (result.token) {
      this.isAuthenticated = true;
      this.user = result.user;
    }

    return result;
  };

  logout = async (): Promise<void> => {
    await this.service.logout();
    this.isAuthenticated = false;
  };

  getIsAuthenticated = async (): Promise<boolean> => {
    const result = await this.service.isAuthenticated();

    this.isAuthenticated = result.isAuthenticated;

    if (result.userData) {
      this.user = result.userData.user;
    }

    return result.isAuthenticated;
  };
}

export default AuthManager;
