/* eslint-disable max-classes-per-file */
import type { Role } from '@dirtleague/common';
import { DbUserRole } from '../entity-context/user-roles';
import { JoinTable } from '../entity-context/entity-table';
import { JoinRepository } from './repository';

export class UserRoleModel {
  userId: number;
  roleId: Role;

  constructor(obj: Record<string, any>) {
    this.userId = obj.userId;
    this.roleId = obj.roleId;
  }

  toJson(): Record<string, any> {
    return {
      userId: this.userId,
      roleId: this.roleId,
    };
  }
}

class UserRoleRepository extends JoinRepository<UserRoleModel, DbUserRole> {
  get entityTable(): JoinTable<DbUserRole> {
    return this.context.userRoles;
  }

  factory(row: DbUserRole): UserRoleModel {
    return new UserRoleModel(row);
  }

  async getByUserId(id: number): Promise<Role[]> {
    return this.context.userRoles.getByUserId(id);
  }
}

export default UserRoleRepository;
