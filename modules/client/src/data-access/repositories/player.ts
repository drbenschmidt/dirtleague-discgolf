import { PlayerAttributes, PlayerModel } from '@dirtleague/common';
import { ApiOptions, ApiRepository, Repository } from '../repository';

class PlayerRepository
  extends ApiRepository
  implements Repository<PlayerModel> {
  async create(model: PlayerModel): Promise<PlayerModel> {
    const result = await this.api.post<PlayerAttributes>('players', model);

    return new PlayerModel(result);
  }

  async update(model: PlayerModel): Promise<void> {
    await this.api.patch<PlayerAttributes>(`players/${model.id}`, model);
  }

  async delete(id: number): Promise<void> {
    await this.api.delete(`players/${id}`);
  }

  async get(id: number, options?: ApiOptions): Promise<PlayerModel> {
    const result = await this.api.get<PlayerAttributes>(
      `players/${id}`,
      options
    );

    return new PlayerModel(result);
  }

  async getAll(): Promise<PlayerModel[]> {
    const result = await this.api.get<PlayerAttributes[]>('players');

    return result.map(obj => new PlayerModel(obj));
  }
}

export default PlayerRepository;
