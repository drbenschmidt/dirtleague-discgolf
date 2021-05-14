import { Roles, UserAttributes, UserModel } from '@dirtleague/common';
import { SignUpModel } from '../../components/sign-up/model';
import { ApiRepository, Repository } from '../repository';

type SignUpResponse = {
  success: boolean;
  user: UserModel;
  token: string;
};

class UsersRepository extends ApiRepository implements Repository<UserModel> {
  async register(model: SignUpModel): Promise<SignUpResponse> {
    const request = model.toRequestModel();
    const result = await this.api.post<SignUpResponse>('users', request);

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async create(model: UserModel): Promise<UserModel> {
    throw new Error('UsersRepository.create is not used.');
  }

  async update(model: UserModel): Promise<void> {
    await this.api.patch<UserAttributes>(`users/${model.id}`, model);
  }

  async delete(id: number): Promise<void> {
    await this.api.delete(`users/${id}`);
  }

  async get(id: number): Promise<UserModel> {
    const result = await this.api.get<UserAttributes>(`users/${id}`);

    return new UserModel(result);
  }

  async getAll(): Promise<UserModel[]> {
    const result = await this.api.get<UserAttributes[]>('users');

    return result.map(user => new UserModel(user));
  }

  async addRole(userId: number, roleId: Roles): Promise<void> {
    await this.api.post(`users/${userId}/addRole`, { roleId });
  }

  async removeRole(userId: number, roleId: Roles): Promise<void> {
    await this.api.post(`users/${userId}/removeRole`, { roleId });
  }

  async updatePassword(userId: number, password: string): Promise<void> {
    await this.api.post(`users/${userId}/updatePassword`, { password });
  }

  async patch(userId: number, props: Record<string, unknown>): Promise<void> {
    await this.api.patch(`users/${userId}`, props);
  }
}

export default UsersRepository;
