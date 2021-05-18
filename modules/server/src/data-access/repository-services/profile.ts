import { PlayerModel, set } from '@dirtleague/common';
import { DbPlayer, FeedModel } from '../entity-context/players';
import { Table } from '../entity-context/entity-table';
import Repository from './repository';

class ProfileRepository extends Repository<PlayerModel, DbPlayer> {
  get entityTable(): Table<DbPlayer> {
    return this.context.profiles;
  }

  factory(row: DbPlayer): PlayerModel {
    return new PlayerModel(row);
  }

  async getFeed(id: number): Promise<FeedModel[]> {
    return this.context.profiles.getFeed(id);
  }

  async insert(model: PlayerModel): Promise<void> {
    await super.insert(model);

    if (model.aliases) {
      this.syncCollection(
        model.aliases.toArray(),
        [],
        entity => set(entity, 'playerId', model.id),
        this.servicesInstance.aliases
      );
    }
  }

  async update(model: PlayerModel): Promise<void> {
    await super.update(model);

    if (model.aliases) {
      const dbAliases = await this.context.aliases.getForPlayerId(model.id);

      this.syncCollection(
        model.aliases.toArray(),
        dbAliases,
        entity => set(entity, 'playerId', model.id),
        this.servicesInstance.aliases
      );
    }
  }
}

export default ProfileRepository;
