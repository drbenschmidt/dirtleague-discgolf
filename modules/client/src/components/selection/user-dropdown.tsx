import { UserModel } from '@dirtleague/common';
import { ReactElement, useCallback, memo } from 'react';
import { useRepositoryServices } from '../../data-access/context';
import EntitySearch from '../forms/entity-search';

export interface PlayerSelectProps {
  onChange: (event: any, value: any) => void;
  value?: any;
  [key: string]: unknown;
}

const UserDropdown = (props: PlayerSelectProps): ReactElement => {
  const { onChange, value, ...rest } = props;
  const services = useRepositoryServices();

  const playerSearch = useCallback(
    async (query: string) => {
      const users = await services?.users.getAll();
      const mapper = (entity: UserModel) => ({
        text: entity.email,
        value: entity.id,
      });

      if (!users) {
        return [];
      }

      if (query.length === 0) {
        return users.map(mapper);
      }

      return users
        ?.filter(player =>
          player.email.toLowerCase().includes(query.toLowerCase())
        )
        .map(mapper);
    },
    [services?.users]
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

export default memo(UserDropdown);
