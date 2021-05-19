import { keys } from 'ts-transformer-keys';
import { sql } from '@databases/mysql';
import { asyncForEach } from '@dirtleague/common';
import type { Role } from '@dirtleague/common';
import { JoinTable } from './entity-table';

export interface DbUserRole {
  userId: number;
  roleId: Role;
}

class UserRolesTable extends JoinTable<DbUserRole> {
  get columns(): Array<keyof DbUserRole> {
    return keys<DbUserRole>();
  }

  get tableName(): string {
    return 'userRoles';
  }

  getByUserId = async (userId: number): Promise<Role[]> => {
    const roles = await this.db.query(sql`
      SELECT roleId FROM userRoles
      WHERE userId=${userId}
    `);

    return roles.map(row => row.roleId);
  };

  deleteForUserId = async (userId: number): Promise<void> => {
    await this.db.query(sql`
      DELETE FROM userRoles
      WHERE userId=${userId}
    `);
  };

  updateForUserId = async (userId: number, roles: Role[]): Promise<void> => {
    await this.deleteForUserId(userId);

    asyncForEach(roles, async (roleId: number) => {
      await this.insert({ roleId, userId });
    });
  };
}

export default UserRolesTable;
