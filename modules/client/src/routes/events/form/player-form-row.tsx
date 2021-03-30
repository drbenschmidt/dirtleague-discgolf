/* eslint-disable jsx-a11y/label-has-associated-control */
import { ReactElement, useCallback, useRef } from 'react';
import { PlayerModel, PlayerGroupPlayerModel } from '@dirtleague/common';
import { useRepositoryServices } from '../../../data-access/context';
import { useSelectBinding } from '../../../hooks/forms';
import EntitySearch from '../../../components/forms/entity-search';

export interface PlayerFormRowComponentProps {
  model: PlayerGroupPlayerModel;
}

const PlayerFormRow = (props: PlayerFormRowComponentProps): ReactElement => {
  const { model } = props;
  const modelRef = useRef(model);
  const services = useRepositoryServices();
  const playerBinding = useSelectBinding(modelRef, 'playerId');

  const playerSearch = useCallback(
    async (query: string) => {
      const players = await services?.players.getAll();
      const mapper = (course: PlayerModel) => ({
        text: course.fullName,
        value: course.id,
      });

      if (!players) {
        return [];
      }

      if (query.length === 0) {
        return players.map(mapper);
      }

      return players
        ?.filter(player =>
          player.fullName
            .toLocaleLowerCase()
            .includes(query.toLocaleLowerCase())
        )
        .map(mapper);
    },
    [services?.players]
  );

  return <EntitySearch {...playerBinding} searcher={playerSearch} />;
};

export default PlayerFormRow;
