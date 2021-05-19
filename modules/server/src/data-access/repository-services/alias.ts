import { AliasModel, asyncForEach } from '@dirtleague/common';
import getCrud from '../../utils/getCrud';
import { DbAlias } from '../entity-context/aliases';
import { Table } from '../entity-context/entity-table';
import Repository from './repository';

class AliasRepository extends Repository<AliasModel, DbAlias> {
  get entityTable(): Table<DbAlias> {
    return this.context.aliases;
  }

  factory(row: DbAlias): AliasModel {
    return new AliasModel(row);
  }

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

        await transaction.aliases.insert(alias);
      });

      await asyncForEach(aliasesToUpdate, async alias => {
        await transaction.aliases.update(alias);
      });

      await asyncForEach(aliasesToDelete, async alias => {
        await transaction.aliases.delete(alias.id);
      });
    });
  };

  async getForPlayerId(id: number): Promise<AliasModel[]> {
    const rows = await this.context.aliases.getForPlayerId(id);

    return rows.map(row => new AliasModel(row));
  }
}

export default AliasRepository;
