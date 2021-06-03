import { sql, SQLQuery } from '@databases/mysql';
import { buildSelect2 } from './selecting';

/**
 * 1. Make a QueryContext(props) object
 * 2. Within QueryContext, have it build a map of table aliases based on rootTable + all relationships.
 * 3. Within QueryContext, have it lookup relationship mappings so it knows how to join
 * 4. Within QueryContext, have it prefix all SELECT columns with table aliases
 * 5. Within QueryContext, have it handle sorting
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

export interface QueryContextProps {
  rootTable: string;
  filter?: string;
  include?: string[];
  fields?: Map<string, string[]>;
  sort?: Sort[];
}

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
    // eslint-disable-next-line no-underscore-dangle
    return sql.__dangerous__rawValue(`_${table.toLowerCase()}`);
  }

  private getJoins(): SQLQuery {
    return sql``;
  }

  private getWhere(): SQLQuery {
    return sql``;
  }

  private getOrderBy(): SQLQuery {
    return sql``;
  }

  getSql(): SQLQuery {
    const { rootTable } = this.props;
    // eslint-disable-next-line no-underscore-dangle
    const table = sql.__dangerous__rawValue(rootTable);
    const rootAlias = this.getAlias(rootTable);
    const select = this.getSelect();
    const joins = this.getJoins();
    const where = this.getWhere();
    const orderBy = this.getOrderBy();

    return sql`SELECT ${select} FROM ${table} AS ${rootAlias} ${joins} ${where} ${orderBy}`;
  }
}

export default QueryContext;
