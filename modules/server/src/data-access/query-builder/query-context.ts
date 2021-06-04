import { sql, SQLQuery } from '@databases/mysql';
import { buildSelect2 } from './selecting';

/**
 * 1. √ Make a QueryContext(props) object
 * 2. Within QueryContext, have it build a map of table aliases based on rootTable + all relationships.
 * 3. Within QueryContext, have it lookup relationship mappings so it knows how to join
 * 4. Within QueryContext, have it prefix all SELECT columns with table aliases
 * 5. √ Within QueryContext, have it handle sorting
 * 6. Within QueryContext, have it handle filtering
 */

// Idea, have EntityContext be able to generate the list of table names and relations.
// Have EntityContext create QueryContext objects since it'll be what knows all.

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type Sort = {
  prop: string;
  direction: SortDirection;
};

export type Pagination = {
  offset: number;
  limit: number;
};

export interface QueryContextProps {
  rootTable: string;
  filter?: string;
  include?: string[];
  fields?: Map<string, string[]>;
  sort?: Sort[];
  page?: Pagination;
}

// eslint-disable-next-line no-underscore-dangle
const rawValue = (text: string) => sql.__dangerous__rawValue(text);

class QueryContext {
  props: QueryContextProps;

  constructor(props: QueryContextProps) {
    this.props = props;
  }

  private getSelect(): SQLQuery {
    const { fields } = this.props;
    const arr = Array.from(fields.entries());
    const statements = arr.flatMap(([table, fieldNames]) => {
      return buildSelect2(fieldNames, table);
    });

    if (arr.length === 0) {
      return sql`*`;
    }

    return sql.join(statements, ', ');
  }

  private getAlias(table: string): SQLQuery {
    return rawValue(`_${table.toLowerCase()}`);
  }

  private getJoins(): SQLQuery {
    return sql``;
  }

  private getWhere(): SQLQuery | null {
    return sql``;
  }

  private getOrderBy(): SQLQuery {
    if (!this.props.sort || this.props.sort.length === 0) {
      return sql``;
    }

    const orders = sql.join(
      this.props.sort.map(({ prop, direction }) =>
        rawValue(`${prop} ${direction === SortDirection.Asc ? 'ASC' : 'DESC'}`)
      ),
      ', '
    );

    return sql`ORDER BY ${orders}`;
  }

  private getPagination(): SQLQuery {
    const { limit, offset } = this.props.page;

    if (!this.props.page) {
      return sql``;
    }

    return sql`LIMIT ${limit} OFFSET ${offset}`;
  }

  getSql(): SQLQuery {
    const { rootTable } = this.props;
    // eslint-disable-next-line no-underscore-dangle
    const table = rawValue(rootTable);
    const rootAlias = this.getAlias(rootTable);
    const select = this.getSelect();
    const joins = this.getJoins();
    const where = this.getWhere();
    const orderBy = this.getOrderBy();
    const pagination = this.getPagination();

    const result = sql`SELECT ${select} FROM ${table} ${joins} ${where} ${orderBy} ${pagination}`;

    return result;
  }
}

export default QueryContext;
