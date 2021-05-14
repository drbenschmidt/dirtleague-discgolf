/* eslint-disable jsx-a11y/label-has-associated-control */
import { ReactElement, useRef } from 'react';
import { PlayerGroupPlayerModel } from '@dirtleague/common';
import { useSelectBinding } from '../../../hooks/forms';
import PlayerSelect from '../../../components/selection/player-select';

export interface PlayerFormRowComponentProps {
  model: PlayerGroupPlayerModel;
}

const PlayerFormRow = (props: PlayerFormRowComponentProps): ReactElement => {
  const { model } = props;
  const modelRef = useRef(model);
  const playerBinding = useSelectBinding(modelRef, 'playerId');

  return <PlayerSelect {...playerBinding} />;
};

export default PlayerFormRow;
