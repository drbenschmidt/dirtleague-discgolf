import { asyncForEach, set, UserModel } from '@dirtleague/common';
import getCrud from '../../utils/getCrud';
import EntityContext from '../entity-context';
import { Table } from '../entity-context/entity-table';
import type RepositoryServices from './index';

export default abstract class Repository<
  TModel extends { toJson: () => any },
  TDbRow
> {
  protected user: UserModel = null;
  protected context: EntityContext = null;
  protected servicesInstance: RepositoryServices = null;

  abstract get entityTable(): Table<TDbRow>;
  abstract factory(row: TDbRow): TModel;

  constructor(
    servicesInstance: RepositoryServices,
    user: UserModel,
    context: EntityContext
  ) {
    this.servicesInstance = servicesInstance;
    this.user = user;
    this.context = context;
  }

  delete = async (id: number): Promise<void> => {
    await this.entityTable.delete(id);
  };

  get = async (id: number): Promise<TModel> => {
    const dbRow = await this.entityTable.get(id);

    return this.factory(dbRow);
  };

  getAll = async (): Promise<TModel[]> => {
    const dbRows = await this.entityTable.getAll();

    return dbRows.map(this.factory);
  };

  async insert(model: TModel): Promise<void> {
    const id = await this.entityTable.insert(model.toJson() as TDbRow);

    set(model, 'id', id);
  }

  async update(model: TModel): Promise<void> {
    await this.entityTable.update(model.toJson() as TDbRow);
  }

  updateMany = async (models: TModel[]): Promise<void> => {
    await asyncForEach(models, this.update);
  };

  syncCollection = async <
    TOtherModel extends { id: number; toJson: () => any },
    TOtherDbRow extends { id?: number },
    TRepository extends Repository<TOtherModel, TOtherDbRow>
  >(
    reqCollection: TOtherModel[],
    dbCollection: TOtherDbRow[],
    associator: (model: TOtherModel) => void,
    repository: TRepository
  ): Promise<void> => {
    const [toCreate, toUpdate, toDelete] = getCrud(reqCollection, dbCollection);

    await asyncForEach(toCreate, async model => {
      associator(model);
      await repository.insert(model);
    });

    await asyncForEach(toUpdate, async model => {
      await repository.update(model);
    });

    await asyncForEach(toDelete, async model => {
      await repository.delete(model.id);
    });
  };
}