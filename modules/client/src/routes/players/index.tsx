import { isNil, ProfileModel } from '@dirtleague/common';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { Link, useRouteMatch, useParams, useHistory } from 'react-router-dom';
import { Table, Button, Menu, Icon, Form, Modal } from 'semantic-ui-react';
import IfAdmin from '../../components/auth/if-admin';
import TextInput from '../../components/forms/text-input';
import Collection from '../../components/forms/collection';
import { useRepositoryServices } from '../../data-access/context';
import { useInputBinding, useTransaction } from '../../hooks/forms';
import RepositoryServices from '../../data-access/repository-services';

interface PlayerDetailsParams {
  id: string;
}

interface DeletePlayerButtonProps {
  player: ProfileModel;
  services: RepositoryServices | null;
}

const DeletePlayerButton = (props: DeletePlayerButtonProps): ReactElement => {
  const { player, services } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isInFlight, setIsInFlight] = useState(false);

  const button = (
    <Button negative size="mini">
      <Icon name="delete" />
      Delete
    </Button>
  );

  const onYesClick = useCallback(() => {
    const deleteProfile = async () => {
      try {
        setIsInFlight(true);
        await services?.profiles.delete(player.id);
        setIsOpen(false);
      } finally {
        setIsInFlight(false);
      }
    };

    deleteProfile();
  }, [services, player]);

  return (
    <Modal
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={button}
    >
      <Modal.Header>{`Delete ${player.firstName} ${player.lastName}`}</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to delete this player?</p>
      </Modal.Content>
      <Modal.Actions>
        <Button disabled={isInFlight} onClick={() => setIsOpen(false)} negative>
          No
        </Button>
        <Button loading={isInFlight} onClick={onYesClick} positive>
          Yes
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export const PlayerList = (): ReactElement => {
  const { url } = useRouteMatch();
  const services = useRepositoryServices();
  const [result, setResult] = useState<ProfileModel[]>();

  useEffect(() => {
    const doWork = async () => {
      const profiles = await services?.profiles.getAll();

      setResult(profiles);
    };

    doWork();
  }, [services?.profiles]);

  return (
    <>
      <h1>Players</h1>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>First</Table.HeaderCell>
            <Table.HeaderCell>Last</Table.HeaderCell>
            <Table.HeaderCell>Current Rating</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {result?.map(player => (
            <Table.Row key={player.id}>
              <Table.Cell>{player.firstName}</Table.Cell>
              <Table.Cell>{player.lastName}</Table.Cell>
              <Table.Cell>{player.currentRating}</Table.Cell>
              <Table.Cell textAlign="right">
                <Button as={Link} to={`${url}/${player.id}`} size="mini">
                  <Icon name="address book" />
                  View
                </Button>
                <IfAdmin>
                  <Button as={Link} to={`${url}/edit/${player.id}`} size="mini">
                    <Icon name="edit" />
                    Edit
                  </Button>
                  <DeletePlayerButton player={player} services={services} />
                </IfAdmin>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="4">
              <Menu floated="right">
                <IfAdmin>
                  <Menu.Item as={Link} to={`${url}/new`}>
                    <Icon name="add circle" /> New Player
                  </Menu.Item>
                </IfAdmin>
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  );
};

export const PlayerDetails = (): ReactElement | null => {
  const { id } = useParams<PlayerDetailsParams>();
  const services = useRepositoryServices();
  const [result, setResult] = useState<ProfileModel>();

  useEffect(() => {
    const doWork = async () => {
      const profiles = await services?.profiles.get(parseInt(id, 10));

      setResult(profiles);
    };

    doWork();
  }, [id, services?.profiles]);

  if (!result) {
    return null;
  }

  return <h1>{`${result?.firstName} ${result?.lastName}`}</h1>;
};

export const AliasFormRow = (props: any): ReactElement => {
  const { model } = props;
  const modelRef = useRef(model);
  const bindings = useInputBinding(modelRef, 'value');

  return <TextInput {...bindings} placeholder="Par Save Steve, etc." />;
};

export const PlayerForm = (props: any): ReactElement | null => {
  const { profileModel, isEditing, services } = props;
  const { model } = useTransaction<ProfileModel>(profileModel);
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
            await services?.profiles.update(model.current);

            history.push(`/players/${model.current.id}`);
          } else {
            await services?.profiles.create(model.current);

            // TODO: Move to player view?
            history.push('/players');
          }
        } finally {
          setIsInFlight(false);
        }
      }
    };

    submit();
  }, [isEditing, model, services?.profiles, history]);

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

export const PlayerFormLoader = (): ReactElement | null => {
  const { id } = useParams<PlayerDetailsParams>();
  const isEditing = !isNil(id);
  const services = useRepositoryServices();
  const [profileModel, setProfileModel] = useState<ProfileModel>();

  // Get the profile from the server if we're editing it.
  useEffect(() => {
    if (isEditing) {
      const getProfile = async () => {
        const response = await services?.profiles.get(parseInt(id, 10), {
          include: ['aliases'],
        });

        if (response) {
          setProfileModel(response);
        }
      };

      getProfile();
    } else {
      const response = new ProfileModel();

      setProfileModel(response);
    }
  }, [id, isEditing, services?.profiles]);

  if (!profileModel) {
    return null;
  }

  return (
    <PlayerForm
      profileModel={profileModel}
      isEditing={isEditing}
      services={services}
    />
  );
};
