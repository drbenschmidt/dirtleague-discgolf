import {
  BaseSyntheticEvent,
  ReactElement,
  useCallback,
  useState,
  useMemo,
  memo,
  FormEvent,
} from 'react';
import { Table, Checkbox, CheckboxProps } from 'semantic-ui-react';
import { UserModel, Role } from '@dirtleague/common';
import UserDropdown from '../../../components/selection/user-dropdown';
import useRequest from '../../../hooks/useRequest';
import RepositoryServices from '../../../data-access/repository-services';
import { useRepositoryServices } from '../../../data-access/context';

const StatefulCheckbox = (props: CheckboxProps): ReactElement => {
  const { checked: parentChecked, onChange: parentOnChanged, ...rest } = props;
  const [checked, setChecked] = useState(parentChecked);
  const onChange = useCallback(
    (event, data) => {
      setChecked(prev => !prev);
      parentOnChanged?.(event, data);
    },
    [parentOnChanged]
  );

  return <Checkbox {...rest} checked={checked} onChange={onChange} />;
};

const getRoles = (): [name: string, id: Role][] => {
  const entries = Object.entries(Role);

  return entries.slice(entries.length / 2) as [name: string, id: Role][];
};

const isBannedRole = (role: Role) => [Role.User].includes(role);

interface UserRolesEditorProps {
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
    <Table celled padded>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Role Name</Table.HeaderCell>
          <Table.HeaderCell>Granted</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {getRoles().map(([name, role]) => {
          return (
            <Table.Row>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>
                <StatefulCheckbox
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

interface UserProfileMapperProps {
  model: UserModel;
}

const UserProfileMapper = (
  props: UserProfileMapperProps
): ReactElement | null => {
  const { model } = props;

  return (
    <div>
      UserID: {model.id}, PlayerID: {model.playerId}
    </div>
  );
};

const UserProfileHOC = (props: any): ReactElement | null => {
  const { userId } = props;
  const [userData, setUserData] = useState<UserModel>();

  const query = useMemo(
    () => ({
      request: (services: RepositoryServices) => {
        return services.users.get(userId);
      },
      onData: setUserData,
    }),
    [userId]
  );

  useRequest<UserModel>(query);

  return (
    <>
      {userData && <UserProfileMapper model={userData} />}
      {userData && <UserRolesEditor model={userData} />}
    </>
  );
};

const AdminUsers = (): ReactElement => {
  const [userId, setUserId] = useState<number>();
  const onUserSelect = useCallback(
    (event: BaseSyntheticEvent, selectedUserId: number) => {
      setUserId(selectedUserId);
    },
    []
  );

  return (
    <>
      <div>ADMIN USERS</div>
      <UserDropdown onChange={onUserSelect} label="User Email" />
      {userId && <UserProfileHOC userId={userId} key={userId} />}
    </>
  );
};

export default memo(AdminUsers);
