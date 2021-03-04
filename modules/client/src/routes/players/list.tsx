import { PlayerModel } from '@dirtleague/common';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Table, Button, Menu, Icon, Modal } from 'semantic-ui-react';
import IfAdmin from '../../components/auth/if-admin';
import RepositoryServices from '../../data-access/repository-services';
import { useRepositoryServices } from '../../data-access/context';

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

export default PlayerList;
