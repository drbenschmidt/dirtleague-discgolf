/* eslint-disable jsx-a11y/label-has-associated-control */
import { ReactElement, useRef } from 'react';
import { PlayerGroupModel, PlayerGroupPlayerModel } from '@dirtleague/common';
import { Form } from 'semantic-ui-react';
import TextInput from '../../../components/forms/text-input';
import { useInputBinding } from '../../../hooks/forms';
import Collection from '../../../components/forms/collection';
import PlayerFormRow from './player-form-row';

export interface PlayerGroupFormRowComponentProps {
  model: PlayerGroupModel;
}

const PlayerGroupFormRow = (
  props: PlayerGroupFormRowComponentProps
): ReactElement => {
  const { model } = props;
  const modelRef = useRef(model);
  const teamNameBinding = useInputBinding(modelRef, 'teamName');

  return (
    <>
      <Form.Group widths="equal">
        <TextInput {...teamNameBinding} label="Team Name (optional)" />
      </Form.Group>
      <Collection
        tableColor="green"
        buttonText="Add Player"
        list={model.players}
        label="Players"
        RowComponent={PlayerFormRow}
        modelFactory={() => new PlayerGroupPlayerModel()}
      />
    </>
  );
};

export default PlayerGroupFormRow;
