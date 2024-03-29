/* eslint-disable max-classes-per-file */
import { Queryable, sql } from '@databases/mysql';
import { buildWhereClause } from '../query-builder/filtering';
import { buildInsertClause } from '../query-builder/inserting';
import { buildUpdateStatement } from '../query-builder/setting';
import { getTableName } from '../query-builder/utils';

export interface EntityTable<TModel> {
  insert(model: TModel): Promise<number>;
  update(model: TModel): Promise<void>;
  delete(id: number): Promise<void>;
  get(id: number): Promise<TModel>;
  getAll(): Promise<TModel[]>;
}

export abstract class Table<TRow extends { id?: number }>
  implements EntityTable<TRow> {
  protected db: Queryable;

  abstract get columns(): Array<keyof TRow>;

  abstract get tableName(): string;

  constructor(db: Queryable) {
    this.db = db;
  }

  insert = async (model: TRow): Promise<number> => {
    const insertClause = buildInsertClause(
      this.tableName,
      this.columns as string[],
      model
    );

    const [result] = await this.db.query(sql`
      ${insertClause};

      SELECT LAST_INSERT_ID();
    `);

    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  };

  update = async (model: TRow): Promise<void> => {
    const updateClause = buildUpdateStatement(
      this.tableName,
      this.columns as string[],
      model.id,
      model
    );

    await this.db.query(updateClause);
  };

  patch = async (id: number, props: Record<string, unknown>): Promise<void> => {
    const updateClause = buildUpdateStatement(
      this.tableName,
      this.columns as string[],
      id,
      props
    );

    await this.db.query(updateClause);
  };

  delete = async (id: number): Promise<void> => {
    const table = getTableName(this.tableName);

    await this.db.query(sql`
      DELETE FROM ${table}
      WHERE id=${id}
    `);
  };

  get = async (id: number): Promise<TRow> => {
    const table = getTableName(this.tableName);

    const rows = await this.db.query(sql`
      SELECT * FROM ${table}
      WHERE id=${id}
    `);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  };

  getAll = async (): Promise<Array<TRow>> => {
    const table = getTableName(this.tableName);

    const users = await this.db.query(sql`
      SELECT * FROM ${table}
    `);

    return users || [];
  };
}

export abstract class JoinTable<TRow> {
  protected db: Queryable;

  abstract get columns(): Array<keyof TRow>;

  abstract get tableName(): string;

  constructor(db: Queryable) {
    this.db = db;
  }

  insert = async (model: TRow): Promise<number> => {
    const insertClause = buildInsertClause(
      this.tableName,
      this.columns as string[],
      model
    );

    const [result] = await this.db.query(sql`
      ${insertClause};

      SELECT LAST_INSERT_ID();
    `);

    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  };

  delete = async (model: TRow): Promise<void> => {
    const table = getTableName(this.tableName);
    const whereClause = buildWhereClause(this.columns as string[], model);

    await this.db.query(sql`
      DELETE FROM ${table}
      WHERE ${whereClause}
    `);
  };
}
