import ApiFetch from './api-fetch';

export class ApiRepository {
  api: ApiFetch;

  constructor(api: ApiFetch) {
    this.api = api;
  }
}

export interface ApiOptions {
  include: string[];
}

export interface Repository<TModel> {
  create(model: TModel): Promise<TModel>;
  update(model: TModel): Promise<void>;
  delete(id: number): Promise<void>;
  get(id: number, options?: ApiOptions): Promise<TModel>;
  getAll(options?: ApiOptions): Promise<TModel[]>;
}
