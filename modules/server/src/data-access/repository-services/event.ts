import { asyncForEach, EventModel, set } from '@dirtleague/common';
import { DbEvent } from '../entity-context/events';
import { Table } from '../entity-context/entity-table';
import Repository from './repository';
import { getIncludes } from './utils';
import toJson from '../../utils/toJson';

class EventRepository extends Repository<EventModel, DbEvent> {
  get entityTable(): Table<DbEvent> {
    return this.context.events;
  }

  factory(row: DbEvent): EventModel {
    return new EventModel(row);
  }

  async get(id: number, includes?: string[]): Promise<EventModel> {
    const model = await super.get(id);
    const [myIncludes, nextIncludes] = getIncludes('event', includes);

    if (myIncludes.includes('rounds')) {
      const rounds = await this.servicesInstance.rounds.getAllForEvent(
        id,
        nextIncludes
      );

      set(model.attributes, 'rounds', rounds.map(toJson));
    }

    return model;
  }

  async insert(model: EventModel): Promise<void> {
    const id = await this.entityTable.insert(model.toJson() as DbEvent);

    set(model, 'id', id);

    if (model.rounds) {
      await this.syncCollection(
        model.rounds.toArray(),
        [],
        entity => set(entity, 'eventId', model.id),
        this.servicesInstance.rounds
      );
    }
  }

  async update(model: EventModel): Promise<void> {
    await this.entityTable.update(model.toJson() as DbEvent);

    if (model.rounds) {
      const dbRounds = await this.context.rounds.getAllForEvent(model.id);

      await this.syncCollection(
        model.rounds.toArray(),
        dbRounds,
        entity => set(entity, 'eventId', model.id),
        this.servicesInstance.rounds
      );
    }
  }
}

export default EventRepository;
