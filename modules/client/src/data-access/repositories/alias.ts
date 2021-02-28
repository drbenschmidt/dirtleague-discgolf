import { AliasModel } from '@dirtleague/common';
import { ApiRepository, Repository } from '../repository';

class AliasRepository extends ApiRepository implements Repository<AliasModel> {
  async create(model: AliasModel): Promise<AliasModel> {
    const result = await this.api.post<AliasModel>('aliases', model);

    return result;
  }

  async update(model: AliasModel): Promise<void> {
    await this.api.patch<AliasModel>(`aliases/${model.id}`, model);
  }

  async delete(id: number): Promise<void> {
    await this.api.delete(`aliases/${id}`);
  }

  async get(id: number): Promise<AliasModel> {
    const result = await this.api.get<AliasModel>(`aliases/${id}`);

    return result;
  }

  async getAll(): Promise<AliasModel[]> {
    const result = await this.api.get<AliasModel[]>('aliases');

    return result;
  }
}

export default AliasRepository;
