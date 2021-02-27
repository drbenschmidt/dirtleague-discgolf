/* eslint-disable max-classes-per-file */
import type { ProfileModel } from '@dirtleague/common';
import type ApiFetch from './api-fetch';

interface RepositoryServicesProps {
  api: ApiFetch;
}

class ApiRepository {
  api: ApiFetch;

  constructor(api: ApiFetch) {
    this.api = api;
  }
}

interface Repository<TModel> {
  create(model: TModel): Promise<TModel>;
  update(model: TModel): Promise<void>;
  delete(id: number): Promise<void>;
  get(id: number): Promise<TModel>;
  getAll(): Promise<TModel[]>;
}

class ProfileRepository
  extends ApiRepository
  implements Repository<ProfileModel> {
  async create(model: ProfileModel): Promise<ProfileModel> {
    const result = await this.api.post<ProfileModel>('profiles', model);

    return result;
  }

  async update(model: ProfileModel): Promise<void> {
    await this.api.patch<ProfileModel>(`profiles/${model.id}`, model);
  }

  async delete(id: number): Promise<void> {
    await this.api.delete(`profiles/${id}`);
  }

  async get(id: number): Promise<ProfileModel> {
    const result = await this.api.get<ProfileModel>(`profiles/${id}`);

    return result;
  }

  async getAll(): Promise<ProfileModel[]> {
    const result = await this.api.get<ProfileModel[]>('profiles');

    return result;
  }
}

class RepositoryServices {
  api: ApiFetch;

  profiles: ProfileRepository;

  constructor(props: RepositoryServicesProps) {
    const { api } = props;

    this.api = api;
    this.profiles = new ProfileRepository(this.api);
  }
}

export default RepositoryServices;
