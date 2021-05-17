import { PlayerModel } from '@dirtleague/common';
import { DbPlayer } from '../entity-context/players';
import { Table } from '../entity-context/entity-table';
import Repository from './repository';

class ProfileRepository extends Repository<PlayerModel, DbPlayer> {
  get entityTable(): Table<DbPlayer> {
    return this.context.profiles;
  }

  factory(row: DbPlayer): PlayerModel {
    return new PlayerModel(row);
  }
}

export default ProfileRepository;
