import { PlayerGroupPlayerModel, set } from '@dirtleague/common';
import { DbPlayerGroupPlayer } from '../entity-context/player-group-players';
import { JoinTable } from '../entity-context/entity-table';
import { JoinRepository } from './repository';

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

  async getForPlayerGroup(id: number): Promise<PlayerGroupPlayerModel[]> {
    const rows = await this.context.playerGroupPlayers.getForPlayerGroup(id);

    return rows.map(r => new PlayerGroupPlayerModel(r));
  }

  async deleteForPlayerGroup(id: number): Promise<void> {
    await this.context.playerGroupPlayers.deleteForPlayerGroup(id);
  }
}

export default PlayerGroupPlayerRepository;
