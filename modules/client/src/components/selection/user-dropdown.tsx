import { UserModel } from '@dirtleague/common';
import { ReactElement, useCallback, memo, SyntheticEvent } from 'react';
import { useRepositoryServices } from '../../data-access/context';
import EntitySearch, { EntitySearchValue } from '../forms/entity-search';

export interface UserDropdownProps {
  onChange: (
    event: SyntheticEvent<HTMLElement, Event>,
    data: EntitySearchValue
  ) => void;
  value?: EntitySearchValue;
  [key: string]: unknown;
}

const UserDropdown = (props: UserDropdownProps): ReactElement => {
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
