import { asyncForEach, PlayerGroupModel, set } from '@dirtleague/common';
import { DbPlayerGroup } from '../entity-context/player-groups';
import { Table } from '../entity-context/entity-table';
import Repository from './repository';
import { getIncludes } from './utils';
import toJson from '../../utils/toJson';

class PlayerGroupRepository extends Repository<
  PlayerGroupModel,
  DbPlayerGroup
> {
  get entityTable(): Table<DbPlayerGroup> {
    return this.context.playerGroups;
  }

  factory(row: DbPlayerGroup): PlayerGroupModel {
    return new PlayerGroupModel(row);
  }

  async getForCard(
    id: number,
    includes?: string[]
  ): Promise<PlayerGroupModel[]> {
    const [myIncludes, nextIncludes] = getIncludes('playerGroup', includes);
    const rows = await this.context.playerGroups.getForCard(id);
    const models = rows.map(card => new PlayerGroupModel(card));

    if (myIncludes.includes('playerGroupPlayers')) {
      await asyncForEach(models, async model => {
        const playerGroupPlayers = await this.servicesInstance.playerGroupPlayers.getForPlayerGroup(
          model.id,
          model.cardId,
          nextIncludes
        );

        set(model.attributes, 'players', playerGroupPlayers.map(toJson));
      });
    }

    if (myIncludes.includes('playerGroupResults')) {
      await asyncForEach(models, async model => {
        const playerGroupResults = await this.servicesInstance.playerGroupResults.getAllForGroup(
          model.id,
          nextIncludes
        );

        set(model.attributes, 'results', playerGroupResults.map(toJson));
      });
    }

    return models;
  }
}

export default PlayerGroupRepository;
