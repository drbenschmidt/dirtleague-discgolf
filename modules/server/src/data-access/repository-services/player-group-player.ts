import { asyncForEach, PlayerGroupPlayerModel, set } from '@dirtleague/common';
import { DbPlayerGroupPlayer } from '../entity-context/player-group-players';
import { JoinTable } from '../entity-context/entity-table';
import { JoinRepository } from './repository';
import { getIncludes } from './utils';

class PlayerGroupPlayerRepository extends JoinRepository<
  PlayerGroupPlayerModel,
  DbPlayerGroupPlayer
> {
  get entityTable(): JoinTable<DbPlayerGroupPlayer> {
    return this.context.playerGroupPlayers;
  }

  factory(row: DbPlayerGroupPlayer): PlayerGroupPlayerModel {
    return new PlayerGroupPlayerModel(row);
  }

  async getForPlayerGroup(
    id: number,
    cardId: number,
    includes?: string[]
  ): Promise<PlayerGroupPlayerModel[]> {
    const [myIncludes, nextIncludes] = getIncludes(
      'playerGroupPlayer',
      includes
    );
    const rows = await this.context.playerGroupPlayers.getForPlayerGroup(id);
    const models = rows.map(r => new PlayerGroupPlayerModel(r));

    if (myIncludes.includes('profile')) {
      await asyncForEach(models, async model => {
        const profile = await this.servicesInstance.profiles.get(
          model.playerId
        );

        set(model.attributes, 'player', profile.toJson());
      });
    }

    if (myIncludes.includes('ratings')) {
      await asyncForEach(models, async model => {
        const profile = await this.servicesInstance.profiles.get(
          model.playerId
        );
        const rating = await this.servicesInstance.playerRatings.getForPlayerCardId(
          model.playerId,
          cardId
        );

        set(model.attributes, 'player', profile.toJson());
        set(model.attributes, 'rating', rating.toJson());
      });
    }

    return models;
  }

  async deleteForPlayerGroup(id: number): Promise<void> {
    await this.context.playerGroupPlayers.deleteForPlayerGroup(id);
  }
}

export default PlayerGroupPlayerRepository;
