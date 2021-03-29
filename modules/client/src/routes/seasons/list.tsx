import { SeasonModel } from '@dirtleague/common';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Table, Button, Menu, Icon, Modal } from 'semantic-ui-react';
import IfAdmin from '../../components/auth/if-admin';
import RepositoryServices from '../../data-access/repository-services';
import { useRepositoryServices } from '../../data-access/context';
import Breadcrumbs from '../../components/generic/breadcrumbs';
import { Seasons } from '../../links';

interface DeleteSeasonButtonProps {
  season: SeasonModel;
  services: RepositoryServices | null;
  onDelete: () => void;
}

const DeleteSeasonButton = (props: DeleteSeasonButtonProps): ReactElement => {
  const { season, services, onDelete } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isInFlight, setIsInFlight] = useState(false);

  const button = (
    <Button negative size="mini">
      <Icon name="delete" />
      Delete
    </Button>
  );

  const onYesClick = useCallback(() => {
    const deleteEntity = async () => {
      try {
        setIsInFlight(true);
        await services?.seasons.delete(season.id);
        setIsOpen(false);
        onDelete();
      } finally {
        setIsInFlight(false);
      }
    };

    deleteEntity();
  }, [services, season, onDelete]);

  return (
    <Modal
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      trigger={button}
    >
      <Modal.Header>{`Delete ${season.name}`}</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to delete this course?</p>
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

const SeasonList = (): ReactElement => {
  const { url } = useRouteMatch();
  const services = useRepositoryServices();
  const [result, setResult] = useState<SeasonModel[]>();
  const [dummy, setDummy] = useState(false);

  const onDelete = useCallback(() => {
    setDummy(v => !v);
  }, []);

  // Node: Check `dummy` so if it changes we requery data.
  useEffect(() => {
    let isMounted = true;

    const doWork = async () => {
      const entities = await services?.seasons.getAll();

      if (isMounted) {
        setResult(entities);
      }
    };

    doWork();

    return () => {
      isMounted = false;
    };
  }, [services?.seasons, dummy]);

  return (
    <>
      <Breadcrumbs path={[Seasons.List]} />
      <h1>Seasons</h1>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Start Date</Table.HeaderCell>
            <Table.HeaderCell>End Date</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {result?.map(season => (
            <Table.Row key={season.id}>
              <Table.Cell>{season.name}</Table.Cell>
              <Table.Cell>{season.startDate.toDateString()}</Table.Cell>
              <Table.Cell>{season.endDate.toDateString()}</Table.Cell>
              <Table.Cell textAlign="right">
                <IfAdmin>
                  <Button as={Link} to={`${url}/edit/${season.id}`} size="mini">
                    <Icon name="edit" />
                    Edit
                  </Button>
                  <DeleteSeasonButton
                    season={season}
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
                    <Icon name="add circle" /> New Season
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

export default SeasonList;
