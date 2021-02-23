export class ApiFetch {
  jwt = null;
  // TODO: make this configurable and work by getting the window's current scheme.
  baseUrl = `${window.location.protocol}//127.0.0.1:8081`;
  defaultRequestOptions = {
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  };

  static CreateFromLocalStorage() {
    const token = window.localStorage.getItem('DIRTY_TOKEN');
    const instance = new ApiFetch();

    instance.jwt = token;

    return instance;
  }

  buildUrl = (url) => {
    return `${this.baseUrl}/${url}`;
  };

  buildRequestOptions = (options) => {
    const reqOptions = {
      ...this.defaultRequestOptions,
      ...options,
    };

    if (this.jwt) {
      reqOptions.headers['Authorization'] = `Bearer ${this.jwt}`;
    }

    return reqOptions;
  };

  post = async (url = '', data = {}) => {
    // Default options are marked with *
    const response = await fetch(
      this.buildUrl(url),
      this.buildRequestOptions({
        method: 'POST',
        body: JSON.stringify(data)
      })
    );

    return response.json(); // parses JSON response into native JavaScript objects
  };

  get = async (url = '') => {
    const response = await fetch(
      this.buildUrl(url),
      this.buildRequestOptions({
        method: 'GET'
      })
    );

    return response.json();
  };

  delete = async (url = '') => {
    const response = await fetch(
      this.buildUrl(url),
      this.buildRequestOptions({
        method: 'DELETE',
      })
    );

    return response.json();
  };
}

export class AuthServices {
  /** @type {ApiFetch} */
  api = null;

  constructor(props) {
    const { api } = props;

    this.api = api;
  }

  auth = async (data) => {
    const { success, token } = await this.api.post('auth', data);

    // TODO: when the server returns the user data, store that as well.
    // We'll use that for the auth manager.

    if (token) {
      this.api.jwt = token;
      window.localStorage.setItem('DIRTY_TOKEN', token);
    }

    return success;
  };

  logout = async () => {
    window.localStorage.removeItem('DIRTY_TOKEN');
    this.api.jwt = null;
  };

  isAuthenticated = async () => {
    const { isAuthenticated } = await this.api.get('auth');

    return isAuthenticated
  };
}

export class RepositoryServices {
  /** @type {ApiFetch} */
  api = null;

  constructor(props) {
    const { api } = props;

    this.api = api;
  }

  getUsers = async () => {
    const result = await this.api.get('users');

    console.log(result);
  }

  getUser = async (id) => {
    const result = await this.api.get(`users/${id}`);

    console.log(result);
  }
}
