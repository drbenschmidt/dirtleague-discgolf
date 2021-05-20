import { PlayerModel, Role } from '@dirtleague/common';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import {
  Table,
  Button,
  Menu,
  Icon,
  Modal,
  Grid,
  Dropdown,
} from 'semantic-ui-react';
import IfAuthorized from '../../components/auth/if-admin';
import RepositoryServices from '../../data-access/repository-services';
import { useRepositoryServices } from '../../data-access/context';
import Breadcrumbs from '../../components/generic/breadcrumbs';
import { Players } from '../../links';
import { useAuthContext } from '../../components/auth/context';

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

const PlayerList = (): ReactElement => {
  const { url } = useRouteMatch();
  const services = useRepositoryServices();
  const [result, setResult] = useState<PlayerModel[]>();
  const [dummy, setDummy] = useState(false);
  const authManager = useAuthContext();

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

  const isCurrentUser = (profileId: number) => {
    return profileId === authManager.user?.playerId;
  };

  return (
    <>
      <Breadcrumbs path={[Players.List]} />
      <h1>Players</h1>
      <Table celled unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>First</Table.HeaderCell>
            <Table.HeaderCell>Last</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {result?.map(player => (
            <Table.Row key={player.id}>
              <Table.Cell>{player.firstName}</Table.Cell>
              <Table.Cell>{player.lastName}</Table.Cell>
              <Table.Cell textAlign="right">
                <Grid>
                  <Grid.Row only="computer" textAlign="right">
                    <Button as={Link} to={`${url}/${player.id}`} size="mini">
                      <Icon name="address book" />
                      View
                    </Button>
                    <IfAuthorized
                      roles={[Role.PlayerManagement]}
                      or={() => isCurrentUser(player.id)}
                    >
                      <Button
                        as={Link}
                        to={`${url}/${player.id}/edit`}
                        size="mini"
                      >
                        <Icon name="edit" />
                        Edit
                      </Button>
                    </IfAuthorized>
                    <IfAuthorized roles={[Role.PlayerManagement]}>
                      <DeletePlayerButton
                        player={player}
                        services={services}
                        onDelete={onDelete}
                      />
                    </IfAuthorized>
                  </Grid.Row>
                  <Grid.Row only="mobile tablet" centered>
                    <Dropdown
                      direction="left"
                      floating
                      button
                      className="mini icon"
                    >
                      <Dropdown.Menu>
                        <Dropdown.Item as={Link} to={`${url}/${player.id}`}>
                          View
                        </Dropdown.Item>
                        <IfAuthorized
                          roles={[Role.PlayerManagement]}
                          or={() => isCurrentUser(player.id)}
                        >
                          <Dropdown.Item
                            as={Link}
                            to={`${url}/${player.id}/edit`}
                          >
                            Edit
                          </Dropdown.Item>
                          <IfAuthorized roles={[Role.PlayerManagement]}>
                            <Dropdown.Item as={Link}>
                              <DeletePlayerButton
                                player={player}
                                services={services}
                                onDelete={onDelete}
                              />
                            </Dropdown.Item>
                          </IfAuthorized>
                        </IfAuthorized>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Grid.Row>
                </Grid>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="4">
              <IfAuthorized roles={[Role.PlayerManagement]}>
                <Menu floated="right">
                  <Menu.Item as={Link} to={`${url}/new`}>
                    <Icon name="add circle" /> New Player
                  </Menu.Item>
                </Menu>
              </IfAuthorized>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  );
};

export default PlayerList;
