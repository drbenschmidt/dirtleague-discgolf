import { UserModel } from '@dirtleague/common';
import { DbUser } from '../entity-context/users';
import { Table } from '../entity-context/entity-table';
import Repository from './repository';
import hashPassword from '../../crypto/hash';

export interface NewUserProps {
  email: string;
  passwordHash: string;
  passwordSalt: string;
  playerId: number;
}

class UserRepository extends Repository<UserModel, DbUser> {
  get entityTable(): Table<DbUser> {
    return this.context.users;
  }

  factory(row: DbUser): UserModel {
    return new UserModel(row);
  }

  async newUser(props: NewUserProps): Promise<number> {
    return this.entityTable.insert(props);
  }

  async updatePassword(id: number, password: string): Promise<void> {
    const { hash: passwordHash, salt: passwordSalt } = await hashPassword(
      password
    );

    await this.entityTable.patch(id, {
      passwordHash,
      passwordSalt,
    });
  }
}

export default UserRepository;
