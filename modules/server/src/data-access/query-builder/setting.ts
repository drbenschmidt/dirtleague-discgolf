import { sql, SQLQuery } from '@databases/mysql';
import { getTableName, isEmptyQuery } from './utils';

export const buildSet = (columnName: string, value: unknown): SQLQuery => {
  const dbValue = sql`${value}`;
  // eslint-disable-next-line no-underscore-dangle
  const dbColumn = sql.__dangerous__rawValue(columnName);

  // eslint-disable-next-line no-underscore-dangle
  return sql`${dbColumn}=${dbValue}`;
};

export const buildSetClause = (
  props: Record<string, unknown>,
  validKeys: string[]
): SQLQuery => {
  return sql.join(
    Object.entries(props)
      .filter(([key]) => validKeys.includes(key))
      .filter(([key]) => key !== 'id')
      .map(([key, value]) => buildSet(key, value)),
    ', '
  );
};

export const buildUpdateStatement = (
  tableName: string,
  validKeys: string[],
  primaryKey: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>
): SQLQuery => {
  const table = getTableName(tableName);

  const set = buildSetClause(props, validKeys);

  if (isEmptyQuery(set)) {
    throw new Error('Error, props did not contain any valid properties.');
  }

  // TODO: Make PK the WHERE.
  return sql`UPDATE ${table} SET ${set} WHERE id=${primaryKey}`;
};
