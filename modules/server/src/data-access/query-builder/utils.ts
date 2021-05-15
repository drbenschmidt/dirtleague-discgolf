import { sql, SQLQuery } from '@databases/mysql';

export const isEmptyQuery = (query: SQLQuery): boolean =>
  // eslint-disable-next-line no-underscore-dangle,@typescript-eslint/no-explicit-any
  (query as any)._items.length === 0;

const validTableNames = ['users'];

export const getTableName = (tableName: string): SQLQuery => {
  if (!validTableNames.includes(tableName)) {
    throw new Error(`Table name ${tableName} is not valid.`);
  }

  // eslint-disable-next-line no-underscore-dangle
  const table = sql.__dangerous__rawValue(tableName);

  return table;
};
