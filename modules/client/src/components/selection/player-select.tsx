import { PlayerModel } from '@dirtleague/common';
import { ReactElement, useCallback } from 'react';
import { useRepositoryServices } from '../../data-access/context';
import EntitySearch from '../forms/entity-search';

export interface PlayerSelectProps {
  onChange: (event: any, value: any) => void;
  value?: any;
  [key: string]: unknown;
}

const PlayerSelect = (props: PlayerSelectProps): ReactElement => {
  const { onChange, value, ...rest } = props;
  const services = useRepositoryServices();

  const playerSearch = useCallback(
    async (query: string) => {
      const players = await services?.players.getAll();
      const mapper = (entity: PlayerModel) => ({
        text: entity.fullName,
        value: entity.id,
      });

      if (!players) {
        return [];
      }

      if (query.length === 0) {
        return players.map(mapper);
      }

      return players
        ?.filter(player =>
          player.fullName.toLowerCase().includes(query.toLowerCase())
        )
        .map(mapper);
    },
    [services?.players]
  );

  return (
    <EntitySearch
      onChange={onChange}
      searcher={playerSearch}
      value={value}
      {...rest}
    />
  );
};

export default PlayerSelect;
