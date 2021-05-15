import { Queryable, sql } from '@databases/mysql';
import { asyncForEach } from '@dirtleague/common';
import type { Roles } from '@dirtleague/common';

interface DbUserRole {
  userId: number;
  roleId: Roles;
}

class UserRolesTable {
  db: Queryable;

  constructor(db: Queryable) {
    this.db = db;
  }

  insert = async (model: DbUserRole): Promise<void> => {
    await this.db.query(sql`
      INSERT INTO userRoles (userId, roleId)
      VALUES (${model.userId}, ${model.roleId});
    `);
  };

  delete = async (model: DbUserRole): Promise<void> => {
    await this.db.query(sql`
      DELETE FROM userRoles
      WHERE userId=${model.userId} AND roleId=${model.roleId}
    `);
  };

  getByUserId = async (userId: number): Promise<Roles[]> => {
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

  updateForUserId = async (userId: number, roles: Roles[]): Promise<void> => {
    await this.deleteForUserId(userId);

    asyncForEach(roles, async (roleId: number) => {
      await this.insert({ roleId, userId });
    });
  };
}

export default UserRolesTable;
