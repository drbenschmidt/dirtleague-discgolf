import { sql, SQLQuery } from '@databases/mysql';

export const buildEquals = (columnName: string, value: unknown): SQLQuery => {
  const dbValue = sql`${value}`;
  // eslint-disable-next-line no-underscore-dangle
  const dbColumn = sql.__dangerous__rawValue(columnName);

  // eslint-disable-next-line no-underscore-dangle
  return sql`${dbColumn}=${dbValue}`;
};

export const buildWhereClause = (
  validKeys: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>
): SQLQuery => {
  const equals = sql.join(
    Object.entries(props)
      .filter(([key]) => validKeys.includes(key))
      .filter(([key]) => key !== 'id')
      .map(([key, value]) => buildEquals(key, value)),
    ' AND '
  );

  return sql`WHERE ${equals}`;
};
