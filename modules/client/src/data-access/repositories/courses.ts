import {
  CourseAttributes,
  CourseLayoutAttributes,
  CourseLayoutModel,
  CourseModel,
} from '@dirtleague/common';
import { ApiOptions, ApiRepository, Repository } from '../repository';

class CourseRepository
  extends ApiRepository
  implements Repository<CourseModel> {
  async create(model: CourseModel): Promise<CourseModel> {
    const result = await this.api.post<CourseAttributes>('courses', model);

    return new CourseModel(result);
  }

  async update(model: CourseModel): Promise<void> {
    await this.api.put<CourseAttributes>(`courses/${model.id}`, model);
  }

  async delete(id: number): Promise<void> {
    await this.api.delete(`courses/${id}`);
  }

  async get(id: number, options?: ApiOptions): Promise<CourseModel> {
    const result = await this.api.get<CourseAttributes>(
      `courses/${id}`,
      options
    );

    return new CourseModel(result);
  }

  async getLayoutsForCourse(id: number): Promise<CourseLayoutModel[]> {
    const result = await this.api.get<CourseLayoutAttributes[]>(
      `courses/${id}/layouts`
    );

    return result.map(obj => new CourseLayoutModel(obj));
  }

  async getAll(): Promise<CourseModel[]> {
    const result = await this.api.get<CourseAttributes[]>('courses');

    return result.map(obj => new CourseModel(obj));
  }
}

export default CourseRepository;
