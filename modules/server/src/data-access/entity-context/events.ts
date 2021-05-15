import { keys } from 'ts-transformer-keys';
import { Table } from './entity-table';

export interface DbEvent {
  id?: number;
  name: string;
  description: string;
  seasonId: number;
  startDate: Date;
}

class EventsTable extends Table<DbEvent> {
  get columns(): Array<keyof DbEvent> {
    return keys<DbEvent>();
  }

  get tableName(): string {
    return 'events';
  }
}

export default EventsTable;
