import {
  PlayerAttributes,
  PlayerModel,
  FeedModel,
  FeedAttributes,
} from '@dirtleague/common';
import { ApiOptions, ApiRepository, Repository } from '../repository';

interface QueryProps {
  filter: string;
}

class PlayerRepository
  extends ApiRepository
  implements Repository<PlayerModel> {
  async create(model: PlayerModel): Promise<PlayerModel> {
    const result = await this.api.post<PlayerAttributes>('players', model);

    return new PlayerModel(result);
  }

  async update(model: PlayerModel): Promise<void> {
    await this.api.put<PlayerAttributes>(`players/${model.id}`, model);
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

  // TODO: Move to feed repository when its moved to a feed route
  async getFeed(id: number): Promise<FeedModel[]> {
    const result = await this.api.get<FeedAttributes[]>(`players/${id}/feed`);

    return result.map(obj => new FeedModel(obj));
  }

  // TODO: Make `getAll` generic and allow filter/limit/orderBy commands.
  async getAllFiltered(props: QueryProps): Promise<PlayerModel[]> {
    const { filter } = props;
    const result = await this.api.get<PlayerAttributes[]>('players', {
      filter,
    });

    return result.map(obj => new PlayerModel(obj));
  }
}

export default PlayerRepository;
