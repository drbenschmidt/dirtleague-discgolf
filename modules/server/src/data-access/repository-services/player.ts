import { PlayerModel } from '@dirtleague/common';
import Repository from './repository';
import { DbPlayer } from '../entity-context/players';
import { Table } from '../entity-context/entity-table';

class PlayerRepository extends Repository<PlayerModel, DbPlayer> {
  get entityTable(): Table<DbPlayer> {
    return this.context.profiles;
  }

  factory(row: DbPlayer): PlayerModel {
    return new PlayerModel(row);
  }
}

export default PlayerRepository;
