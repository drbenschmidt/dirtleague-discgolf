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
}

export interface AuthCheckResponse {
  isAuthenticated: boolean;
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

  isAuthenticated = async (): Promise<boolean> => {
    const { isAuthenticated } = await this.api.get<AuthCheckResponse>('auth');

    return isAuthenticated;
  };
}

export default AuthServices;
