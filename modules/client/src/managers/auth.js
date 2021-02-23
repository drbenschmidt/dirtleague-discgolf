import { AuthServices } from '../data-access/repositories';

class AuthManager {
  /** @type {AuthServices} */
  service = null;

  isAuthenticated = false;
  isAdmin = false;

  constructor(apiFetch) {
    this.service = new AuthServices({ api: apiFetch });
  }
  
  authenticate = async ({ email, password }) => {
    // TODO: Update for when this returns the user data and not just true/false.
    const result = await this.service.auth({ username: email, password });

    if (result) {
      this.isAuthenticated = true;
    }

    return result;
  };

  logout = async () => {
    await this.service.logout()
    this.isAuthenticated = false;
  };

  getIsAuthenticated = async () => {
    const result = await this.service.isAuthenticated();

    this.isAuthenticated = result;

    return result;
  };
}

export default AuthManager;
