import { keys } from 'ts-transformer-keys';
import { Table } from './entity-table';

export interface DbSeason {
  id?: number;
  name: string;
  startDate: Date;
  endDate: Date;
}

class SeasonsTable extends Table<DbSeason> {
  get columns(): Array<keyof DbSeason> {
    return keys<DbSeason>();
  }

  get tableName(): string {
    return 'seasons';
  }
}

export default SeasonsTable;
