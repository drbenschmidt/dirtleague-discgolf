import { EventModel, Role } from '@dirtleague/common';
import { ReactElement, useCallback, useEffect, useState, memo } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Table, Button, Menu, Icon } from 'semantic-ui-react';
import IfAuthorized from '../../components/auth/if-admin';
import { useRepositoryServices } from '../../data-access/context';
import DeleteEntityButton from '../../components/generic/delete-entity-button';
import Breadcrumbs from '../../components/generic/breadcrumbs';
import { Events } from '../../links';

const EventList = (): ReactElement => {
  const { url } = useRouteMatch();
  const services = useRepositoryServices();
  const [result, setResult] = useState<EventModel[]>();
  const [dummy, setDummy] = useState(false);

  const onDelete = useCallback(
    async (id: number) => {
      await services?.events.delete(id);
      setDummy(v => !v);
    },
    [services?.events]
  );

  // Node: Check `dummy` so if it changes we requery data.
  useEffect(() => {
    let isMounted = true;

    const doWork = async () => {
      const entities = await services?.events.getAll();

      if (isMounted) {
        setResult(entities);
      }
    };

    doWork();

    return () => {
      isMounted = false;
    };
  }, [services?.events, dummy]);

  return (
    <>
      <Breadcrumbs path={[Events.List]} />
      <h1>Events</h1>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell textAlign="right">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {result?.map(entity => (
            <Table.Row key={entity.id}>
              <Table.Cell>{entity.name}</Table.Cell>
              <Table.Cell textAlign="right">
                <Button as={Link} to={`${url}/${entity.id}`} size="mini">
                  <Icon name="address book" />
                  View
                </Button>
                <Button
                  as={Link}
                  to={`${url}/${entity.id}/results`}
                  size="mini"
                >
                  <Icon name="chart bar" />
                  Results
                </Button>
                <IfAuthorized roles={[Role.EventManagement]}>
                  <Button as={Link} to={`${url}/${entity.id}/edit`} size="mini">
                    <Icon name="edit" />
                    Edit
                  </Button>
                  <DeleteEntityButton
                    modelName="Event"
                    id={entity.id}
                    onDelete={onDelete}
                  />
                </IfAuthorized>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="4">
              <IfAuthorized roles={[Role.EventManagement]}>
                <Menu floated="right">
                  <Menu.Item as={Link} to={`${url}/new`}>
                    <Icon name="add circle" /> New Event
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

export default memo(EventList);
