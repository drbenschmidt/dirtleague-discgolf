import { AliasModel, asyncForEach } from '@dirtleague/common';
import getCrud from '../../utils/getCrud';
import Repository from './repository';

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

export default AliasRepository;
