import { SeasonAttributes, SeasonModel } from '@dirtleague/common';
import { ApiOptions, ApiRepository, Repository } from '../repository';

class SeasonRepository
  extends ApiRepository
  implements Repository<SeasonModel> {
  async create(model: SeasonModel): Promise<SeasonModel> {
    const result = await this.api.post<SeasonAttributes>('seasons', model);

    return new SeasonModel(result);
  }

  async update(model: SeasonModel): Promise<void> {
    await this.api.patch<SeasonAttributes>(`seasons/${model.id}`, model);
  }

  async delete(id: number): Promise<void> {
    await this.api.delete(`seasons/${id}`);
  }

  async get(id: number, options?: ApiOptions): Promise<SeasonModel> {
    const result = await this.api.get<SeasonAttributes>(
      `seasons/${id}`,
      options
    );

    return new SeasonModel(result);
  }

  async getAll(): Promise<SeasonModel[]> {
    const result = await this.api.get<SeasonAttributes[]>('seasons');

    return result.map(obj => new SeasonModel(obj));
  }
}

export default SeasonRepository;
