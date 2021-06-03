import { sql, SQLQuery } from '@databases/mysql';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
export const spliceObject = <TReturn>(obj: any, prefix: string): TReturn => {
  const newObj = Object.entries(obj)
    .filter(([key]) => key.startsWith(prefix))
    .reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key.replace(`${prefix}_`, '')]: value,
      };
    }, {});

  return newObj as TReturn;
};

export const buildSelect = (names: string[], prefix: string): SQLQuery => {
  const fields = names.map(key =>
    // eslint-disable-next-line no-underscore-dangle
    sql.__dangerous__rawValue(`${prefix}.${key} as "${prefix}_${key}"`)
  );

  return sql.join(fields, ', ');
};

export const buildSelect2 = (names: string[], prefix: string): SQLQuery => {
  const fields = names.map(key => {
    if (prefix.length === 0) {
      // eslint-disable-next-line no-underscore-dangle
      return sql.__dangerous__rawValue(`${key}`);
    }

    // eslint-disable-next-line no-underscore-dangle
    return sql.__dangerous__rawValue(`${prefix}.${key}`);
  });

  return sql.join(fields, ', ');
};

export const buildSelects = (
  kvps: [fields: string[], prefix: string][]
): SQLQuery => {
  return sql.join(
    kvps.map(([fields, prefix]) => buildSelect(fields, prefix)),
    ', '
  );
};
