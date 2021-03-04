import { isNil, PlayerModel } from '@dirtleague/common';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useState,
  useRef,
  Suspense,
} from 'react';
import { Link, useRouteMatch, useParams, useHistory } from 'react-router-dom';
import {
  Table,
  Button,
  Menu,
  Icon,
  Form,
  Modal,
  Label,
  Grid,
  Image,
  Card,
  Statistic,
} from 'semantic-ui-react';
import IfAdmin from '../../components/auth/if-admin';
import TextInput from '../../components/forms/text-input';
import Collection from '../../components/forms/collection';
import { useRepositoryServices } from '../../data-access/context';
import { useInputBinding, useTransaction } from '../../hooks/forms';
import RepositoryServices from '../../data-access/repository-services';

const LazyRatingChart = React.lazy(() => import('./rating-chart'));

interface PlayerDetailsParams {
  id: string;
}

interface DeletePlayerButtonProps {
  player: PlayerModel;
  services: RepositoryServices | null;
  onDelete: () => void;
}

const DeletePlayerButton = (props: DeletePlayerButtonProps): ReactElement => {
  const { player, services, onDelete } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isInFlight, setIsInFlight] = useState(false);

  const button = (
    <Button negative size="mini">
      <Icon name="delete" />
      Delete
    </Button>
  );

  const onYesClick = useCallback(() => {
    const deletePlayer = async () => {
      try {
        setIsInFlight(true);
        await services?.players.delete(player.id);
        setIsOpen(false);
        onDelete();
      } finally {
        setIsInFlight(false);
      }
    };

    deletePlayer();
  }, [services, player, onDelete]);

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
  const [result, setResult] = useState<PlayerModel[]>();
  const [dummy, setDummy] = useState(false);

  const onDelete = useCallback(() => {
    setDummy(v => !v);
  }, []);

  // Node: Check `dummy` so if it changes we requery data.
  useEffect(() => {
    let isMounted = true;

    const doWork = async () => {
      const players = await services?.players.getAll();

      if (isMounted) {
        setResult(players);
      }
    };

    doWork();

    return () => {
      isMounted = false;
    };
  }, [services?.players, dummy]);

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
                  <DeletePlayerButton
                    player={player}
                    services={services}
                    onDelete={onDelete}
                  />
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
  const [result, setResult] = useState<PlayerModel>();

  useEffect(() => {
    const doWork = async () => {
      const players = await services?.players.get(parseInt(id, 10), {
        include: ['aliases'],
      });

      setResult(players);
    };

    doWork();
  }, [id, services?.players]);

  if (!result) {
    return null;
  }

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width="4">
          <Card>
            <Label color="red" ribbon style={{ left: '-1rem' }}>
              3rd Place
            </Label>
            <Image src="http://placekitten.com/300/300" wrapped ui={false} />
            <Card.Content>
              <Card.Header>{`${result.firstName} ${result.lastName}`}</Card.Header>
              <Card.Meta>Joined in 2021</Card.Meta>
              <Card.Description>
                Lorem Ipsum or something, idk man.
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              {result.aliases.mapReact(alias => (
                <Label key={alias.id} as="a" tag>
                  {alias.data.value}
                </Label>
              ))}
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column width="12">
          <Statistic.Group>
            <Statistic>
              <Statistic.Value>{result.currentRating}</Statistic.Value>
              <Statistic.Label>Current Rating</Statistic.Label>
            </Statistic>
            <Statistic>
              <Statistic.Value>230</Statistic.Value>
              <Statistic.Label>Rounds Played</Statistic.Label>
            </Statistic>
            <Statistic>
              <Statistic.Value>-4</Statistic.Value>
              <Statistic.Label>Best Round (singles)</Statistic.Label>
            </Statistic>
            <Statistic>
              <Statistic.Value>-12</Statistic.Value>
              <Statistic.Label>Best Round (doubles)</Statistic.Label>
            </Statistic>
          </Statistic.Group>
          <Suspense fallback={<div>Loading...</div>}>
            <LazyRatingChart />
          </Suspense>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export const AliasFormRow = (props: any): ReactElement => {
  const { model } = props;
  const modelRef = useRef(model);
  const bindings = useInputBinding(modelRef, 'value');

  return <TextInput {...bindings} placeholder="Par Save Steve, etc." />;
};

export const PlayerForm = (props: any): ReactElement | null => {
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

export const PlayerFormLoader = (): ReactElement | null => {
  const { id } = useParams<PlayerDetailsParams>();
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
    <PlayerForm
      playerModel={playerModel}
      isEditing={isEditing}
      services={services}
    />
  );
};
