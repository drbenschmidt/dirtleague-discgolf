import { isNil, intersect, except, getById } from '@dirtleague/common';

const getCrud = <
  TModel extends { id: number },
  TDbModel extends { id?: number }
>(
  requestModels: TModel[],
  dbModels: TDbModel[]
): [toCreate: TModel[], toUpdate: TModel[], toDelete: TDbModel[]] => {
  const dbModelIds = dbModels.map(a => a.id);
  const requestModelIds = requestModels.map(a => a.id);
  const toCreate = requestModels.filter(a => isNil(a.id));
  const toUpdate = getById(
    requestModels,
    intersect(dbModelIds, requestModelIds)
  );
  const toDelete = getById(dbModels, except(dbModelIds, requestModelIds));

  return [toCreate, toUpdate, toDelete];
};

export default getCrud;
