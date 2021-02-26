import AuthServices, { AuthResponse } from '../data-access/auth-services';
import type ApiFetch from '../data-access/api-fetch';

export interface AuthModel {
  email: string;
  password: string;
}

class AuthManager {
  service: AuthServices;

  isAuthenticated = false;

  isAdmin = false;

  constructor(apiFetch: ApiFetch) {
    this.service = new AuthServices({ api: apiFetch });
  }

  authenticate = async ({
    email,
    password,
  }: AuthModel): Promise<AuthResponse> => {
    const result = await this.service.auth({ email, password });

    if (result.token) {
      this.isAuthenticated = true;
    }

    return result;
  };

  logout = async (): Promise<void> => {
    await this.service.logout();
    this.isAuthenticated = false;
  };

  getIsAuthenticated = async (): Promise<boolean> => {
    const result = await this.service.isAuthenticated();

    this.isAuthenticated = result;

    return result;
  };
}

export default AuthManager;
