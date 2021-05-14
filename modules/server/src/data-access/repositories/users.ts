import { ConnectionPool, sql, SQLQuery } from '@databases/mysql';
import { keys } from 'ts-transformer-keys';

const buildSet = (columnName: string, value: unknown): SQLQuery => {
  const dbValue = sql`${value}`;
  // eslint-disable-next-line no-underscore-dangle
  const dbColumn = sql.__dangerous__rawValue(columnName);

  // eslint-disable-next-line no-underscore-dangle
  return sql`${dbColumn}=${dbValue}`;
};

const buildSets = (
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

export interface DbUser {
  id?: number;
  playerId?: number;
  email: string;
  passwordHash: string;
  passwordSalt: string;
}

class UsersRepository {
  db: ConnectionPool;

  constructor(db: ConnectionPool) {
    this.db = db;
  }

  insert = async (model: DbUser): Promise<number> => {
    const [result] = await this.db.query(sql`
      INSERT INTO users (email, passwordHash, passwordSalt, playerId)
      VALUES (${model.email}, ${model.passwordHash}, ${model.passwordSalt}, ${model.playerId});

      SELECT LAST_INSERT_ID();
    `);

    // eslint-disable-next-line no-param-reassign
    const id = result['LAST_INSERT_ID()'] as number;

    return id;
  };

  update = async (model: DbUser): Promise<void> => {
    await this.db.query(sql`
      UPDATE users
      SET passwordHash=${model.passwordHash}, passwordSalt=${model.passwordSalt}, playerId=${model.playerId}
      WHERE email=${model.email}
    `);
  };

  delete = async (id: number): Promise<void> => {
    await this.db.query(sql`
      DELETE FROM users
      WHERE id=${id}
    `);
  };

  get = async (id: number): Promise<DbUser> => {
    const users = await this.db.query(sql`
      SELECT * FROM users
      WHERE id=${id}
    `);

    if (users.length === 0) {
      return null;
    }

    return users[0];
  };

  getByEmail = async (email: string): Promise<DbUser> => {
    const users = await this.db.query(sql`
      SELECT * FROM users
      WHERE email=${email}
    `);

    if (users.length === 0) {
      return null;
    }

    return users[0];
  };

  getAll = async (): Promise<Array<DbUser>> => {
    const users = await this.db.query(sql`
      SELECT * FROM users
    `);

    return users || [];
  };

  patch = async (id: number, props: Record<string, unknown>): Promise<void> => {
    const validKeys = keys<DbUser>();
    const setClause = buildSets(props, validKeys);

    // eslint-disable-next-line no-underscore-dangle
    if ((setClause as any)._items.length === 0) {
      throw new Error('Error, props did not contain any valid properties.');
    }

    await this.db.query(sql`
      UPDATE users
      SET ${setClause}
      WHERE id=${id}
    `);
  };
}

export default UsersRepository;
