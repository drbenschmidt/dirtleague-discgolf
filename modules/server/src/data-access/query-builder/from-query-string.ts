import type { ParsedQs } from 'qs';
import { SQLQuery } from '@databases/mysql';
import QueryContext, {
  Pagination,
  QueryContextProps,
  Sort,
  SortDirection,
} from './query-context';

type QsLike = string | string[] | ParsedQs | ParsedQs[];

const parseInclude = (include: QsLike): string[] => {
  if (!include) {
    return [];
  }

  const includes = (include as string).split(',');

  return includes;
};

const parseFields = (fields: QsLike): Map<string, string[]> => {
  const result = new Map<string, string[]>();

  if (typeof fields === 'string') {
    // TODO: Now with a result set of ['attrName', 'relation.attrName'] we need to split one more time and group by left side.
    const parts = (fields as string).split(',');

    result.set('', parts);
  } else if (typeof fields === 'object') {
    Object.entries(fields).forEach(([key, value]) => {
      result.set(key, (value as string).split(','));
    });
  }

  return result;
};

const parseSort = (sort: QsLike): Sort[] => {
  if (!sort) {
    return [];
  }

  // TODO: Now with a result set of ['attrName', 'relation.attrName'] we need to split one more time and group by left side.
  const parts = (sort as string).split(',');

  const getDirection = (name: string) => {
    return name.charAt(0) === '-' ? SortDirection.Desc : SortDirection.Asc;
  };

  return parts.map(prop => ({ prop, direction: getDirection(prop) }));
};

const parsePage = (page: QsLike): Pagination => {
  if (!page) {
    return null;
  }

  const { offset, limit } = page as ParsedQs;

  return {
    offset: parseInt(offset as string, 10),
    limit: parseInt(limit as string, 10),
  };
};

// Take a query string and convert it into an object we can build a queryable object off of.
// ex: ?include=author&fields[article]=id,subject,body&fields[people]=name&sort=-author.name,author.id
//     &filter={hard part, come up with a way to parse this}
export const parseQueryString = (
  rootTable: string,
  qs: ParsedQs
): QueryContextProps => {
  const { include, fields, sort, filter, page } = qs;

  const result = {
    rootTable,
    filter,
    page: parsePage(page),
    include: parseInclude(include),
    fields: parseFields(fields),
    sort: parseSort(sort),
  } as QueryContextProps;

  return result;
};

export const fromQueryString = (rootTable: string, qs: ParsedQs): SQLQuery => {
  const props = parseQueryString(rootTable, qs);
  const queryContext = new QueryContext(props);

  return queryContext.getSql();
};
