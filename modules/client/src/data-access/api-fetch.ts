import DirtLeagueModel from '@dirtleague/common/src/model/dl-model';

const buildUrl = (
  baseUrl: string,
  url: string,
  options?: Record<string, any>
) => {
  const temp = new URL(url, baseUrl);

  if (options) {
    temp.search = new URLSearchParams(options).toString();
  }

  return temp.toString();
};

const defaultRequestOptions = {
  mode: 'cors', // no-cors, *cors, same-origin
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, *same-origin, omit
  headers: {
    'Content-Type': 'application/json',
  },
  redirect: 'follow', // manual, *follow, error
  referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
};

const buildRequestOptions = (jwt: string | null, options: any) => {
  const reqOptions = {
    ...defaultRequestOptions,
    ...options,
  };

  if (jwt) {
    reqOptions.headers.Authorization = `Bearer ${jwt}`;
  }

  return reqOptions;
};

/**
 * Handles communication between client and server.
 * TODO: Have it look for invalid JWTs and callback an onUnauthenticated function to reset app state.
 */
class ApiFetch {
  jwt: string | null;

  // TODO: make this configurable and work by getting the window's current scheme.
  baseUrl = `${window.location.protocol}//localhost:8081`;

  constructor(token: string | null) {
    this.jwt = token;
  }

  static CreateFromLocalStorage(): ApiFetch {
    const token = window.localStorage.getItem('DIRTY_TOKEN');
    const instance = new ApiFetch(token);

    return instance;
  }

  setToken = (token: string): void => {
    this.jwt = token;
    window.localStorage.setItem('DIRTY_TOKEN', token);
  };

  removeToken = (): void => {
    this.jwt = null;
    window.localStorage.removeItem('DIRTY_TOKEN');
  };

  post = async <TResponse>(
    url = '',
    data: DirtLeagueModel<unknown>,
    queryParams = {}
  ): Promise<TResponse> => {
    // Default options are marked with *
    const response = await fetch(
      buildUrl(this.baseUrl, url, queryParams),
      buildRequestOptions(this.jwt, {
        method: 'POST',
        body: JSON.stringify(data?.toJson() || {}),
      })
    );

    return response.json(); // parses JSON response into native JavaScript objects
  };

  get = async <TResponse>(url = '', queryParams = {}): Promise<TResponse> => {
    const response = await fetch(
      buildUrl(this.baseUrl, url, queryParams),
      buildRequestOptions(this.jwt, {
        method: 'GET',
      })
    );

    return response.json();
  };

  delete = async <TResponse>(url = ''): Promise<TResponse> => {
    const response = await fetch(
      buildUrl(this.baseUrl, url),
      buildRequestOptions(this.jwt, {
        method: 'DELETE',
      })
    );

    return response.json();
  };

  patch = async <TResponse>(
    url = '',
    data: DirtLeagueModel<unknown>,
    queryParams = {}
  ): Promise<TResponse | null> => {
    const response = await fetch(
      buildUrl(this.baseUrl, url, queryParams),
      buildRequestOptions(this.jwt, {
        method: 'PATCH',
        body: JSON.stringify(data?.toJson() || {}),
      })
    );

    const length = response.headers.get('Content-Length');

    if (length && parseInt(length, 10) > 0) {
      return response.json();
    }

    return null;
  };
}

export default ApiFetch;
