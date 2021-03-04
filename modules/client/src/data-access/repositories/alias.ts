import { AliasAttributes, AliasModel } from '@dirtleague/common';
import { ApiRepository, Repository } from '../repository';

class AliasRepository extends ApiRepository implements Repository<AliasModel> {
  async create(model: AliasModel): Promise<AliasModel> {
    const result = await this.api.post<AliasAttributes>('aliases', model);

    return new AliasModel(result);
  }

  async update(model: AliasModel): Promise<void> {
    await this.api.patch<AliasAttributes>(`aliases/${model.id}`, model);
  }

  async delete(id: number): Promise<void> {
    await this.api.delete(`aliases/${id}`);
  }

  async get(id: number): Promise<AliasModel> {
    const result = await this.api.get<AliasAttributes>(`aliases/${id}`);

    return new AliasModel(result);
  }

  async getAll(): Promise<AliasModel[]> {
    const result = await this.api.get<AliasAttributes[]>('aliases');

    return result.map(alias => new AliasModel(alias));
  }
}

export default AliasRepository;
