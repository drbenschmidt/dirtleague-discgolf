/* eslint-disable max-classes-per-file */
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

type Mapping = {
  [key: string]: string;
};

type Mappings = {
  [key: string]: Mapping;
};

class JoinMappings {
  private mappings: Mappings = {
    users: {
      players: 'from.playerId = to.id',
    },
    players: {
      users: 'from.id = to.playerId',
    },
  };

  get(fromTable: string, fromAlias: string, toTable: string, toAlias: string) {
    const mapping = this.mappings?.[fromTable]?.[toTable];

    if (mapping) {
      return mapping.replace('from', fromAlias).replace('to', toAlias);
    }

    return null;
  }
}

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
  mappings = new JoinMappings();

  constructor(props: QueryContextProps) {
    this.props = props;
  }

  private getSelect(): SQLQuery {
    // TODO: Check to see if there are includes as we'll need prefixes fa-sho.
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

  private getAliasName(table: string): string {
    return `_${table.toLowerCase()}`;
  }

  private getAlias(table: string): SQLQuery {
    return rawValue(this.getAliasName(table));
  }

  private getJoins(): SQLQuery {
    if (this.props.include?.length === 0) {
      return sql``;
    }

    // We're going to assume that the include names will provide the join direction as well.
    // ex) include = ['user', 'user.userRoles']
    // Since 'user' has no prefix, it's assumed to be rootTable. 'user.userRoles' has a prefix, so its direction will be users -> userRoles
    const joins = this.props.include.map(relation => {
      let [from, to] = relation.split('.');

      // Case: include was not prefixed.
      if (from && !to) {
        to = from;
        from = this.props.rootTable;
      }

      const fromAs = this.getAliasName(from);
      const toAs = this.getAliasName(to);

      const result = this.mappings.get(from, fromAs, to, toAs);

      return rawValue(`JOIN ${to} AS ${toAs} ON ${result}`);
    });

    return sql.join(joins, '');
  }

  private getWhere(): SQLQuery | null {
    // TODO: Check to see if there are includes as we'll need prefixes fa-sho.
    return sql``;
  }

  private getOrderBy(): SQLQuery {
    // TODO: Check to see if there are includes as we'll need prefixes fa-sho.
    if (!this.props.sort || this.props.sort.length === 0) {
      return sql``;
    }

    const orders = sql.join(
      this.props.sort.map(({ prop, direction }) =>
        rawValue(`${prop} ${direction === SortDirection.Asc ? 'ASC' : 'DESC'}`)
      ),
      ', '
    );

    return sql` ORDER BY ${orders}`;
  }

  private getPagination(): SQLQuery {
    const { limit, offset } = this.props.page;

    if (!this.props.page) {
      return sql``;
    }

    return sql` LIMIT ${limit} OFFSET ${offset}`;
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

    const result = sql`SELECT ${select} FROM ${table} AS ${rootAlias} ${joins}${where}${orderBy}${pagination}`;

    return result;
  }
}

export default QueryContext;
