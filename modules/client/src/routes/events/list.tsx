import { EventModel, Role } from '@dirtleague/common';
import { ReactElement, useCallback, useEffect, useState, memo } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { Table, Button, Menu, Icon, Grid, Dropdown } from 'semantic-ui-react';
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
      <Table celled unstackable>
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
                <Grid>
                  <Grid.Row
                    only="computer"
                    style={{
                      justifyContent: 'flex-end',
                      marginRight: '0.7rem',
                    }}
                  >
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
                      <Button
                        as={Link}
                        to={`${url}/${entity.id}/edit`}
                        size="mini"
                      >
                        <Icon name="edit" />
                        Edit
                      </Button>
                      <DeleteEntityButton
                        modelName="Event"
                        id={entity.id}
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
                        <Dropdown.Item as={Link} to={`${url}/${entity.id}`}>
                          View
                        </Dropdown.Item>
                        <Dropdown.Item
                          as={Link}
                          to={`${url}/${entity.id}/results`}
                        >
                          Results
                        </Dropdown.Item>
                        <IfAuthorized roles={[Role.EventManagement]}>
                          <Dropdown.Item
                            as={Link}
                            to={`${url}/${entity.id}/edit`}
                          >
                            Edit
                          </Dropdown.Item>
                          <IfAuthorized roles={[Role.EventManagement]}>
                            <Dropdown.Item as={Link}>
                              <DeleteEntityButton
                                modelName="Event"
                                id={entity.id}
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
