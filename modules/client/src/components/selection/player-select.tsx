import { PlayerModel } from '@dirtleague/common';
import { ReactElement, SyntheticEvent, useCallback } from 'react';
import { useRepositoryServices } from '../../data-access/context';
import EntitySearch, { EntitySearchValue } from '../forms/entity-search';

export interface PlayerSelectProps {
  onChange: (
    event: SyntheticEvent<HTMLElement, Event>,
    data: EntitySearchValue
  ) => void;
  value: EntitySearchValue;
  searcher?: () => Promise<PlayerModel[]>;
  [key: string]: unknown;
}

const PlayerSelect = (props: PlayerSelectProps): ReactElement => {
  const services = useRepositoryServices();
  const {
    onChange,
    value,
    searcher = services?.players.getAll.bind(services),
    ...rest
  } = props;

  const playerSearch = useCallback(
    async (query: string) => {
      const players = await searcher();
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
    [searcher]
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
