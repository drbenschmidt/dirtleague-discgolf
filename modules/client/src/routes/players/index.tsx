import { isNil, ProfileModel } from '@dirtleague/common';
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
            <Table.Row key={user.id}>
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

const StatefulInput = (props: any): ReactElement => {
  const { value: originalValue, onChange: parentOnChange, ...rest } = props;
  const [value, setValue] = useState(originalValue);

  const onChange = useCallback(
    (event, data) => {
      const { value: newValue } = data;
      setValue(newValue);
      parentOnChange(event, data);
    },
    [parentOnChange]
  );

  const inputProps = {
    ...rest,
    value,
    onChange,
  };

  return <Form.Input {...inputProps} />;
};

export const PlayerForm = (): ReactElement | null => {
  const { id } = useParams<PlayerDetailsParams>();
  const isEditing = !isNil(id);
  const services = useRepositoryServices();
  const [profileModel, setProfileModel] = useState<ProfileModel>();
  const { model } = useTransaction<ProfileModel>(profileModel);
  const firstNameBinding = useInputBinding(model, 'firstName');
  const lastNameBinding = useInputBinding(model, 'lastName');
  const [isInFlight, setIsInFlight] = useState(false);

  // Get the profile from the server if we're editing it.
  useEffect(() => {
    if (isEditing) {
      const getProfile = async () => {
        const response = await services?.profiles.get(parseInt(id, 10));

        if (response) {
          setProfileModel(response);
        }
      };

      getProfile();
    }
  }, [id, isEditing, services?.profiles]);

  const onFormSubmit = useCallback(() => {
    const submit = async () => {
      if (model.current) {
        try {
          setIsInFlight(true);
          if (isEditing) {
            await services?.profiles.update(model.current);
          } else {
            await services?.profiles.create(model.current);
          }
        } finally {
          setIsInFlight(false);
        }
      }
    };

    submit();
  }, [isEditing, model, services?.profiles]);

  if (isEditing && !profileModel) {
    return null;
  }

  return (
    <>
      <h1>{isEditing ? 'Edit Player' : 'New Player'}</h1>
      <Form onSubmit={onFormSubmit} loading={isInFlight}>
        <Form.Group widths="equal">
          <StatefulInput
            {...firstNameBinding}
            fluid
            label="First name"
            placeholder="First name"
          />
          <StatefulInput
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
