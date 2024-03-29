import DirtLeagueModel from '@dirtleague/common/src/model/dl-model';
import { getConfig } from '../managers/config';

const buildUrl = (
  baseUrl: string,
  url: string,
  options?: string | string[][] | Record<string, string> | URLSearchParams
) => {
  const temp = new URL(`api/${url}`, baseUrl);

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  static getBaseUrl(): string {
    const { REACT_APP_API_ROOT } = getConfig();
    const {
      location: { protocol, hostname },
    } = window;

    const result = `${protocol}//${REACT_APP_API_ROOT || `${hostname}:8081`}`;

    return result;
  }

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
    data: DirtLeagueModel<unknown> | Record<string, unknown>,
    queryParams = {}
  ): Promise<TResponse> => {
    let body = {};

    if (data instanceof DirtLeagueModel) {
      body = data.toJson();
    } else {
      body = data;
    }

    // Default options are marked with *
    const response = await fetch(
      buildUrl(ApiFetch.getBaseUrl(), url, queryParams),
      buildRequestOptions(this.jwt, {
        method: 'POST',
        body: JSON.stringify(body || {}),
      })
    );

    return response.json(); // parses JSON response into native JavaScript objects
  };

  get = async <TResponse>(url = '', queryParams = {}): Promise<TResponse> => {
    const response = await fetch(
      buildUrl(ApiFetch.getBaseUrl(), url, queryParams),
      buildRequestOptions(this.jwt, {
        method: 'GET',
      })
    );

    return response.json();
  };

  delete = async <TResponse>(url = ''): Promise<TResponse> => {
    const response = await fetch(
      buildUrl(ApiFetch.getBaseUrl(), url),
      buildRequestOptions(this.jwt, {
        method: 'DELETE',
      })
    );

    return response.json();
  };

  put = async <TResponse>(
    url = '',
    data: DirtLeagueModel<unknown> | Record<string, unknown>,
    queryParams = {}
  ): Promise<TResponse | null> => {
    let body = {};

    if (data instanceof DirtLeagueModel) {
      body = data.toJson();
    } else {
      body = data;
    }

    const response = await fetch(
      buildUrl(ApiFetch.getBaseUrl(), url, queryParams),
      buildRequestOptions(this.jwt, {
        method: 'PUT',
        body: JSON.stringify(body || {}),
      })
    );

    const length = response.headers.get('Content-Length');

    if (length && parseInt(length, 10) > 0) {
      return response.json();
    }

    return null;
  };

  patch = async <TResponse>(
    url = '',
    data: DirtLeagueModel<unknown> | Record<string, unknown>,
    queryParams = {}
  ): Promise<TResponse | null> => {
    let body = {};

    if (data instanceof DirtLeagueModel) {
      body = data.toJson();
    } else {
      body = data;
    }

    const response = await fetch(
      buildUrl(ApiFetch.getBaseUrl(), url, queryParams),
      buildRequestOptions(this.jwt, {
        method: 'PATCH',
        body: JSON.stringify(body || {}),
      })
    );

    const length = response.headers.get('Content-Length');

    if (length && parseInt(length, 10) > 0) {
      return response.json();
    }

    return null;
  };

  putFile = async <TResponse>(
    url = '',
    data: FormData,
    queryParams = {}
  ): Promise<TResponse | null> => {
    const response = await fetch(
      buildUrl(ApiFetch.getBaseUrl(), url, queryParams),
      buildRequestOptions(this.jwt, {
        method: 'PUT',
        body: data,
        headers: {},
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
