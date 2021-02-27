import { ProfileModel } from '@dirtleague/common';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { Link, useRouteMatch, useParams } from 'react-router-dom';
import { Table, Button, Menu, Icon, Form } from 'semantic-ui-react';
import IfAdmin from '../../components/auth/if-admin';
import { useRepositoryServices } from '../../data-access/context';
import { useInputBinding, useTransaction } from '../../hooks/forms';

interface PlayerDetailsParams {
  id: string;
}

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
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {result?.map(user => (
            <Table.Row>
              <Table.Cell>{user.firstName}</Table.Cell>
              <Table.Cell>{user.lastName}</Table.Cell>
              <Table.Cell>{user.currentRating}</Table.Cell>
              <Table.Cell>
                <Button
                  icon="address book"
                  as={Link}
                  to={`${url}/${user.id}`}
                />
                <IfAdmin>
                  <Button icon="edit" as={Link} to={`${url}/edit/${user.id}`} />
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

export const PlayerDetails = (): ReactElement => {
  const { id } = useParams<PlayerDetailsParams>();

  return <h1>Player ID {id}</h1>;
};

export const PlayerCreate = (): ReactElement => {
  const services = useRepositoryServices();
  const { model } = useTransaction<ProfileModel>({} as ProfileModel);
  const firstNameBinding = useInputBinding(model, 'firstName');
  const lastNameBinding = useInputBinding(model, 'lastName');
  const [isInFlight, setIsInFlight] = useState(false);

  const onFormSubmit = useCallback(() => {
    const doWork = async () => {
      if (model.current) {
        try {
          setIsInFlight(true);
          await services?.profiles.create(model.current);
        } finally {
          setIsInFlight(false);
        }
      }
    };

    doWork();
  }, [model, services?.profiles]);

  return (
    <>
      <h1>New Player</h1>
      <Form onSubmit={onFormSubmit} loading={isInFlight}>
        <Form.Group widths="equal">
          <Form.Input
            {...firstNameBinding}
            fluid
            label="First name"
            placeholder="First name"
          />
          <Form.Input
            {...lastNameBinding}
            fluid
            label="Last name"
            placeholder="Last name"
          />
        </Form.Group>
        <Form.Button positive content="Submit" />
      </Form>
    </>
  );
};
