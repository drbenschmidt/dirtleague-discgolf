import { sql } from '@databases/mysql';
import { keys } from 'ts-transformer-keys';
import { Table } from './entity-table';

export interface DbUser {
  id?: number;
  playerId?: number;
  email: string;
  passwordHash: string;
  passwordSalt: string;
}

class UsersTable extends Table<DbUser> {
  get columns(): Array<keyof DbUser> {
    return keys<DbUser>();
  }

  get tableName(): string {
    return 'users';
  }

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
}

export default UsersTable;
