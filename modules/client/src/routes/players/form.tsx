import { isNil, PlayerModel } from '@dirtleague/common';
import { ReactElement, useCallback, useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import TextInput from '../../components/forms/text-input';
import Collection from '../../components/forms/collection';
import { useRepositoryServices } from '../../data-access/context';
import { useInputBinding, useTransaction } from '../../hooks/forms';
import { EntityDetailsParams } from '../types';

const AliasFormRow = (props: any): ReactElement => {
  const { model } = props;
  const modelRef = useRef(model);
  const bindings = useInputBinding(modelRef, 'value');

  return <TextInput {...bindings} placeholder="Par Save Steve, etc." />;
};

const PlayerFormComponent = (props: any): ReactElement | null => {
  const { playerModel, isEditing, services } = props;
  const { model } = useTransaction<PlayerModel>(playerModel);
  const firstNameBinding = useInputBinding(model, 'firstName');
  const lastNameBinding = useInputBinding(model, 'lastName');
  const [isInFlight, setIsInFlight] = useState(false);
  const history = useHistory();

  const onFormSubmit = useCallback(() => {
    const submit = async () => {
      if (model.current) {
        try {
          setIsInFlight(true);
          if (isEditing) {
            await services?.players.update(model.current);

            history.push(`/players/${model.current.id}`);
          } else {
            await services?.players.create(model.current);

            // TODO: Move to player view?
            history.push('/players');
          }
        } finally {
          setIsInFlight(false);
        }
      }
    };

    submit();
  }, [isEditing, model, services?.players, history]);

  return (
    <>
      <h1>{isEditing ? 'Edit Player' : 'New Player'}</h1>
      <Form onSubmit={onFormSubmit} loading={isInFlight}>
        <Form.Group widths="equal">
          <TextInput
            {...firstNameBinding}
            fluid
            label="First name"
            placeholder="First name"
          />
          <TextInput
            {...lastNameBinding}
            fluid
            label="Last name"
            placeholder="Last name"
          />
        </Form.Group>
        <Collection
          model={model}
          propName="aliases"
          RowComponent={AliasFormRow}
          label="Player Aliases"
          buttonText="Add Alias"
        />
        <Form.Button positive content="Submit" />
      </Form>
    </>
  );
};

const PlayerForm = (): ReactElement | null => {
  const { id } = useParams<EntityDetailsParams>();
  const isEditing = !isNil(id);
  const services = useRepositoryServices();
  const [playerModel, setPlayerModel] = useState<PlayerModel>();

  // Get the player from the server if we're editing it.
  useEffect(() => {
    if (isEditing) {
      const getPlayer = async () => {
        const response = await services?.players.get(parseInt(id, 10), {
          include: ['aliases'],
        });

        if (response) {
          setPlayerModel(response);
        }
      };

      getPlayer();
    } else {
      const response = new PlayerModel();

      setPlayerModel(response);
    }
  }, [id, isEditing, services?.players]);

  if (!playerModel) {
    return null;
  }

  return (
    <PlayerFormComponent
      playerModel={playerModel}
      isEditing={isEditing}
      services={services}
    />
  );
};

export default PlayerForm;
