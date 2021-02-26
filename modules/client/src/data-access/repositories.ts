import type ApiFetch from './api-fetch';

interface RepositoryServicesProps {
  api: ApiFetch;
}

// TODO: Move users into user repository class.
class RepositoryServices {
  api: ApiFetch;

  constructor(props: RepositoryServicesProps) {
    const { api } = props;

    this.api = api;
  }

  getUsers = async (): Promise<void> => {
    const result = await this.api.get('users');

    console.log(result);
  };

  getUser = async (id: number): Promise<void> => {
    const result = await this.api.get(`users/${id}`);

    console.log(result);
  };
}

export default RepositoryServices;
