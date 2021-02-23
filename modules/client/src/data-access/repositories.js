export class ApiFetch {
  // TODO: make this configurable and work by getting the window's current scheme.
  baseUrl = `${window.location.protocol}//127.0.0.1:8081`;
  defaultRequestOptions = {
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  };

  buildUrl = (url) => {
    return `${this.baseUrl}/${url}`;
  };

  post = async (url = '', data = {}) => {
    // Default options are marked with *
    const response = await fetch(this.buildUrl(url), {
      ...this.defaultRequestOptions,
      method: 'POST',
      body: JSON.stringify(data)
    });

    return response.json(); // parses JSON response into native JavaScript objects
  };

  get = async (url = '') => {
    const response = await fetch(this.buildUrl(url));

    return response.json();
  };

  delete = async (url = '') => {
    const response = await fetch(this.buildUrl(url), {
      ...this.defaultRequestOptions,
      method: 'DELETE',
    });

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
    const { success } = await this.api.post('auth', data);

    // TODO: when the server returns the user data, store that as well.
    // We'll use that for the auth manager.

    return success;
  };

  logout = async () => {
    const { success } = await this.api.delete('auth');

    return success;
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
}
