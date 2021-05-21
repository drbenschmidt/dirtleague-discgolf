import { ReactElement, useCallback, FormEvent, memo } from 'react';
import { Table, CheckboxProps } from 'semantic-ui-react';
import { UserModel, Role } from '@dirtleague/common';
import { useRepositoryServices } from '../../../data-access/context';
import Checkbox from '../../../components/semantic/checkbox';

const getRoles = (): [name: string, id: Role][] => {
  const entries = Object.entries(Role);

  return entries.slice(entries.length / 2) as [name: string, id: Role][];
};

const isBannedRole = (role: Role) => [Role.User].includes(role);

export interface UserRolesEditorProps {
  model: UserModel;
}

const UserRolesEditor = (props: UserRolesEditorProps): ReactElement | null => {
  const { model } = props;
  const services = useRepositoryServices();

  const hasRole = (roleId: string | Role) =>
    model.roles.includes(roleId as number);

  const onRoleChange = useCallback(
    (event: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
      const { checked, roleId } = data;

      if (checked) {
        services.users.addRole(model.id, roleId);
      } else {
        services.users.removeRole(model.id, roleId);
      }
    },
    [model.id, services.users]
  );

  return (
    <Table celled padded unstackable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Role Name</Table.HeaderCell>
          <Table.HeaderCell>Granted</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {getRoles().map(([name, role]) => {
          return (
            <Table.Row key={role}>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>
                <Checkbox
                  disabled={isBannedRole(role)}
                  slider
                  checked={hasRole(role)}
                  roleId={role}
                  onChange={onRoleChange}
                />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default memo(UserRolesEditor);
