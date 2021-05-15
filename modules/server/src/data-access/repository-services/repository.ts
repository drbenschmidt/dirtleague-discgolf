import { UserModel } from '@dirtleague/common';
import EntityContext from '../entity-context';

export default class Repository {
  protected user: UserModel = null;
  protected context: EntityContext = null;

  constructor(user: UserModel, context: EntityContext) {
    this.user = user;
    this.context = context;
  }
}
