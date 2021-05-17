import { EventModel, set } from '@dirtleague/common';
import { DbEvent } from '../entity-context/events';
import { Table } from '../entity-context/entity-table';
import Repository from './repository';

class EventRepository extends Repository<EventModel, DbEvent> {
  get entityTable(): Table<DbEvent> {
    return this.context.events;
  }

  factory(row: DbEvent): EventModel {
    return new EventModel(row);
  }
}

export default EventRepository;
