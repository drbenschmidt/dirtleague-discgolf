import { UserModel } from '@dirtleague/common';
import type ApiFetch from './api-fetch';

export interface AuthServicesProps {
  api: ApiFetch;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: UserModel;
}

export interface AuthCheckResponse {
  isAuthenticated: boolean;
  userData: {
    iat: number;
    user: UserModel;
  };
}

class AuthServices {
  api: ApiFetch;

  constructor(props: AuthServicesProps) {
    const { api } = props;

    this.api = api;
  }

  auth = async (request: AuthRequest): Promise<AuthResponse> => {
    const response = await this.api.post<AuthResponse>('auth', request);

    if (response.token) {
      this.api.setToken(response.token);
    }

    return response;
  };

  logout = (): void => {
    this.api.removeToken();
  };

  isAuthenticated = async (): Promise<AuthCheckResponse> => {
    const result = await this.api.get<AuthCheckResponse>('auth');

    return result;
  };
}

export default AuthServices;
