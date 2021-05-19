import { SeasonModel } from '@dirtleague/common';
import { DbSeason } from '../entity-context/seasons';
import { Table } from '../entity-context/entity-table';
import Repository from './repository';

class SeasonRepository extends Repository<SeasonModel, DbSeason> {
  get entityTable(): Table<DbSeason> {
    return this.context.seasons;
  }

  factory(row: DbSeason): SeasonModel {
    return new SeasonModel(row);
  }
}

export default SeasonRepository;
