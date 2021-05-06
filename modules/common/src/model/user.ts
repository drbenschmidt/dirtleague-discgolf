import type Role from '../security/roles';

export interface UserModel {
  id: number;
  email: string;
  roles: Role[];
  password?: string;
}
