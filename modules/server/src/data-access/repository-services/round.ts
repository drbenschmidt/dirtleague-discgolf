import { RoundModel, set } from '@dirtleague/common';
import { DbRound } from '../entity-context/rounds';
import { Table } from '../entity-context/entity-table';
import Repository from './repository';

class RoundRepository extends Repository<RoundModel, DbRound> {
  get entityTable(): Table<DbRound> {
    return this.context.rounds;
  }

  factory(row: DbRound): RoundModel {
    return new RoundModel(row);
  }

  async getAllForEvent(id: number): Promise<RoundModel[]> {
    const rows = await this.context.rounds.getAllForEvent(id);

    return rows.map(round => new RoundModel(round));
  }
}

export default RoundRepository;
