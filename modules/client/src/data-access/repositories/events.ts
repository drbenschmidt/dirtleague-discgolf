import { EventAttributes, EventModel } from '@dirtleague/common';
import { ApiOptions, ApiRepository, Repository } from '../repository';

class EventRepository extends ApiRepository implements Repository<EventModel> {
  async create(model: EventModel): Promise<EventModel> {
    const result = await this.api.post<EventAttributes>('events', model);

    return new EventModel(result);
  }

  async update(model: EventModel): Promise<void> {
    await this.api.patch<EventAttributes>(`events/${model.id}`, model);
  }

  async delete(id: number): Promise<void> {
    await this.api.delete(`events/${id}`);
  }

  async get(id: number, options?: ApiOptions): Promise<EventModel> {
    const result = await this.api.get<EventAttributes>(`events/${id}`, options);

    return new EventModel(result);
  }

  async getAll(): Promise<EventModel[]> {
    const result = await this.api.get<EventAttributes[]>('events');

    return result.map(obj => new EventModel(obj));
  }
}

export default EventRepository;
