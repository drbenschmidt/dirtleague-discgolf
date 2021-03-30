/* eslint-disable jsx-a11y/label-has-associated-control */
import { ReactElement } from 'react';
import { CardModel, PlayerGroupModel } from '@dirtleague/common';
import Collection from '../../../components/forms/collection';
import PlayerGroupFormRow from './player-group-form-row';

export interface CardFormComponentProps {
  model: CardModel;
}

const CardForm = (props: CardFormComponentProps): ReactElement => {
  const { model } = props;

  return (
    <Collection
      tableColor="blue"
      buttonText="Add Player Group"
      label="Card"
      list={model.playerGroups}
      RowComponent={PlayerGroupFormRow}
      modelFactory={() => new PlayerGroupModel()}
    />
  );
};

export default CardForm;
