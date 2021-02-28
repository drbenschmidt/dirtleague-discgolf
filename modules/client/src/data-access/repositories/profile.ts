import { ProfileModel } from '@dirtleague/common';
import { ApiOptions, ApiRepository, Repository } from '../repository';

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

  async get(id: number, options?: ApiOptions): Promise<ProfileModel> {
    const result = await this.api.get<ProfileModel>(`profiles/${id}`, options);

    return result;
  }

  async getAll(): Promise<ProfileModel[]> {
    const result = await this.api.get<ProfileModel[]>('profiles');

    return result;
  }
}

export default ProfileRepository;
