import { EventAttributes, CourseLayoutModel } from '@dirtleague/common';
import { ApiOptions, ApiRepository, Repository } from '../repository';

class EventRepository
  extends ApiRepository
  implements Repository<CourseLayoutModel> {
  async create(model: CourseLayoutModel): Promise<CourseLayoutModel> {
    const result = await this.api.post<EventAttributes>('courseLayouts', model);

    return new CourseLayoutModel(result);
  }

  async update(model: CourseLayoutModel): Promise<void> {
    await this.api.put<EventAttributes>(`courseLayouts/${model.id}`, model);
  }

  async delete(id: number): Promise<void> {
    await this.api.delete(`courseLayouts/${id}`);
  }

  async get(id: number, options?: ApiOptions): Promise<CourseLayoutModel> {
    const result = await this.api.get<EventAttributes>(
      `courseLayouts/${id}`,
      options
    );

    return new CourseLayoutModel(result);
  }

  async getAll(): Promise<CourseLayoutModel[]> {
    const result = await this.api.get<EventAttributes[]>('courseLayouts');

    return result.map(obj => new CourseLayoutModel(obj));
  }
}

export default EventRepository;
