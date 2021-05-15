/* eslint-disable import/prefer-default-export */
import { sql, SQLQuery } from '@databases/mysql';
import { getTableName } from './utils';

export const buildInsertClause = (
  tableName: string,
  validKeys: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>
): SQLQuery => {
  const entries = Object.entries(props)
    .filter(([key]) => validKeys.includes(key))
    .filter(([key]) => key !== 'id');

  const columns = sql.join(
    entries.map(([key]) => sql.ident(key)),
    ', '
  );

  const values = sql.join(
    entries.map(([, value]) => sql.value(value)),
    ', '
  );

  const table = getTableName(tableName);

  return sql`INSERT INTO ${table} (${columns}) VALUES (${values})`;
};
