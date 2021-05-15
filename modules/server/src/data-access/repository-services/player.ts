import { PlayerModel } from '@dirtleague/common';
import Repository from './repository';

class PlayerRepository extends Repository {
  update = async (model: PlayerModel): Promise<void> => {
    await this.context.profiles.update(model);
  };
}

export default PlayerRepository;
