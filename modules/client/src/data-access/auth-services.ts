import type ApiFetch from './api-fetch';

interface AuthServicesProps {
  api: ApiFetch;
}

interface AuthRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
}

interface AuthCheckResponse {
  isAuthenticated: boolean;
}

class AuthServices {
  api: ApiFetch;

  constructor(props: AuthServicesProps) {
    const { api } = props;

    this.api = api;
  }

  auth = async (request: AuthRequest) => {
    const response = await this.api.post<AuthResponse>('auth', request);

    if (response.token) {
      this.api.setToken(response.token);
    }

    return response;
  };

  logout = () => {
    this.api.removeToken();
  };

  isAuthenticated = async () => {
    const { isAuthenticated } = await this.api.get<AuthCheckResponse>('auth');

    return isAuthenticated;
  };
}

export default AuthServices;
