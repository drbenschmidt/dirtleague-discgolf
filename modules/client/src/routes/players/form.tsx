import { AliasModel, isNil, PlayerModel } from '@dirtleague/common';
import { ReactElement, useCallback, useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import TextInput from '../../components/forms/text-input';
import Collection from '../../components/forms/collection';
import { useRepositoryServices } from '../../data-access/context';
import { useInputBinding, useTransaction } from '../../hooks/forms';
import { EntityDetailsParams } from '../types';
import FocusOnMount from '../../components/generic/focus-on-mount';
import Breadcrumbs, {
  BreadcrumbPart,
} from '../../components/generic/breadcrumbs';
import { Players } from '../../links';
import useModelValidation from '../../hooks/useModelValidation';

const AliasFormRow = (props: any): ReactElement => {
  const { model } = props;
  const modelRef = useRef(model);
  const bindings = useInputBinding(modelRef, 'value');

  return (
    <FocusOnMount>
      {ref => (
        <TextInput ref={ref} {...bindings} placeholder="Par Save Steve, etc." />
      )}
    </FocusOnMount>
  );
};

const PlayerFormComponent = (props: any): ReactElement | null => {
  const { playerModel, isEditing } = props;
  const services = useRepositoryServices();
  const { model } = useTransaction<PlayerModel>(playerModel);
  const firstNameBinding = useInputBinding(model, 'firstName');
  const lastNameBinding = useInputBinding(model, 'lastName');
  const [isInFlight, setIsInFlight] = useState(false);
  const history = useHistory();
  const isValid = useModelValidation(model);

  const onFormSubmit = useCallback(() => {
    const submit = async () => {
      if (model.current) {
        if (!(await isValid())) {
          return;
        }

        try {
          setIsInFlight(true);
          if (isEditing) {
            await services?.players.update(model.current);

            history.push(`/players/${model.current.id}`);
          } else {
            const response = await services?.players.create(model.current);

            history.push(`/players/${response?.id}`);
          }
        } finally {
          setIsInFlight(false);
        }
      }
    };

    submit();
  }, [model, isValid, isEditing, services?.players, history]);

  const title = isEditing ? 'Edit Player' : 'New Player';
  const pathPart = isEditing
    ? ([
        Players.Edit,
        { name: model.current?.fullName, id: model.current?.id },
      ] as BreadcrumbPart)
    : Players.New;

  return (
    <>
      <Breadcrumbs path={[Players.List, pathPart]} />
      <h1>{title}</h1>
      <Form onSubmit={onFormSubmit} loading={isInFlight}>
        <Form.Group widths="equal">
          <FocusOnMount>
            {ref => (
              <TextInput
                {...firstNameBinding}
                ref={ref}
                fluid
                label="First name"
                placeholder="First name"
              />
            )}
          </FocusOnMount>
          <TextInput
            {...lastNameBinding}
            fluid
            label="Last name"
            placeholder="Last name"
          />
        </Form.Group>
        <Collection
          list={model.current?.aliases}
          RowComponent={AliasFormRow}
          label="Player Aliases"
          buttonText="Add Alias"
          modelFactory={() => new AliasModel()}
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
