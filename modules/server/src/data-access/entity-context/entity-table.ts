export interface EntityTable<TModel> {
  create(model: TModel): Promise<number>;
  update(model: TModel): Promise<void>;
  delete(id: number): Promise<void>;
  get(id: number): Promise<TModel>;
  getAll(): Promise<TModel[]>;
}
