import { Link, useRouteMatch, useParams } from 'react-router-dom';
import { Table, Button, Menu, Icon } from 'semantic-ui-react';

const mockData = [
  { firstName: 'ben', lastName: 'guy1', id: 1, rating: 1000 },
  { firstName: 'tim', lastName: 'guy2', id: 2, rating: 1000 },
  { firstName: 'kyle', lastName: 'guy3', id: 3, rating: 1000 },
];

export const PlayerList = () => {
  const { url } = useRouteMatch();

  return (
    <>
      <h1>Players</h1>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>First</Table.HeaderCell>
            <Table.HeaderCell>Last</Table.HeaderCell>
            <Table.HeaderCell>Rating</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {mockData.map(user => (
            <Table.Row>
              <Table.Cell>{user.firstName}</Table.Cell>
              <Table.Cell>{user.lastName}</Table.Cell>
              <Table.Cell>{user.rating}</Table.Cell>
              <Table.Cell>
                <Button
                  icon="address book"
                  as={Link}
                  to={`${url}/${user.id}`}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="4">
              <Menu floated="right" pagination>
                <Menu.Item as="a" icon>
                  <Icon name="chevron left" />
                </Menu.Item>
                <Menu.Item as="a">1</Menu.Item>
                <Menu.Item as="a">2</Menu.Item>
                <Menu.Item as="a">3</Menu.Item>
                <Menu.Item as="a">4</Menu.Item>
                <Menu.Item as="a" icon>
                  <Icon name="chevron right" />
                </Menu.Item>
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </>
  );
};

export const PlayerDetails = () => {
  const { id } = useParams<any>();

  return <h1>Player ID {id}</h1>;
};
