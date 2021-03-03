export interface Repository<TModel> {
  create(model: TModel): Promise<TModel>;
  update(model: TModel): Promise<void>;
  delete(id: number): Promise<void>;
  get(id: number): Promise<TModel>;
  getAll(): Promise<TModel[]>;
}
