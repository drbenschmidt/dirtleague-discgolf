import { PlayerGroupModel, set } from '@dirtleague/common';
import { DbPlayerGroup } from '../entity-context/player-groups';
import { Table } from '../entity-context/entity-table';
import Repository from './repository';

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

  async getForCard(id: number): Promise<PlayerGroupModel[]> {
    const rows = await this.context.playerGroups.getForCard(id);

    return rows.map(card => new PlayerGroupModel(card));
  }
}

export default PlayerGroupRepository;
