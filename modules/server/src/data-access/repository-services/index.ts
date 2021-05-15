/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/* eslint-disable react/static-property-placement */
import {
  AliasModel,
  asyncForEach,
  PlayerModel,
  UserModel,
} from '@dirtleague/common';
import TransactionOptions from '@databases/mysql/lib/types/TransactionOptions';
import EntityContext from '../entity-context';
import getCrud from '../../utils/getCrud';

class Repository {
  protected user: UserModel = null;
  protected context: EntityContext = null;

  constructor(user: UserModel, context: EntityContext) {
    this.user = user;
    this.context = context;
  }
}

class AliasRepository extends Repository {
  updateForPlayer = async (
    playerId: number,
    models: AliasModel[]
  ): Promise<void> => {
    const dbAliases = await this.context.aliases.getForPlayerId(playerId);

    const [aliasesToCreate, aliasesToUpdate, aliasesToDelete] = getCrud(
      models,
      dbAliases
    );

    await this.context.tx(async transaction => {
      await asyncForEach(aliasesToCreate, async alias => {
        // eslint-disable-next-line no-param-reassign
        alias.playerId = playerId;

        await transaction.aliases.create(alias);
      });

      await asyncForEach(aliasesToUpdate, async alias => {
        await transaction.aliases.update(alias);
      });

      await asyncForEach(aliasesToDelete, async alias => {
        await transaction.aliases.delete(alias.id);
      });
    });
  };
}

class PlayerRepository extends Repository {
  update = async (model: PlayerModel): Promise<void> => {
    await this.context.profiles.update(model);
  };
}

export default class RepositoryServices {
  private user: UserModel = null;
  private context: EntityContext = null;

  get players(): PlayerRepository {
    return new PlayerRepository(this.user, this.context);
  }

  get aliases(): AliasRepository {
    return new AliasRepository(this.user, this.context);
  }

  constructor(user: UserModel, context: EntityContext) {
    this.user = user;
    this.context = context;
  }

  async tx<T>(
    fn: (ctx: RepositoryServices) => Promise<T>,
    options?: TransactionOptions
  ): Promise<T> {
    return this.context.tx(async (ctx: EntityContext) => {
      return fn(new RepositoryServices(this.user, ctx));
    }, options);
  }
}
