import { PlayerGroupResultModel } from '@dirtleague/common';
import { DbPlayerGroupResult } from '../entity-context/player-group-results';
import { JoinTable } from '../entity-context/entity-table';
import { JoinRepository } from './repository';

class PlayerGroupResultRepository extends JoinRepository<
  PlayerGroupResultModel,
  DbPlayerGroupResult
> {
  get entityTable(): JoinTable<DbPlayerGroupResult> {
    return this.context.playerGroupResults;
  }

  factory(row: DbPlayerGroupResult): PlayerGroupResultModel {
    return new PlayerGroupResultModel(row);
  }

  async getAllForGroup(
    id: number,
    includes?: string[]
  ): Promise<PlayerGroupResultModel[]> {
    const rows = await this.context.playerGroupResults.getAllForGroup(id);

    return rows.map(this.factory);
  }

  async deleteAllForGroup(id: number): Promise<void> {
    await this.context.playerGroupResults.deleteAllForGroup(id);
  }
}

export default PlayerGroupResultRepository;
