import {
  BaseSyntheticEvent,
  ReactElement,
  useCallback,
  useState,
  useMemo,
  memo,
} from 'react';
import { UserModel, Roles } from '@dirtleague/common';
import UserDropdown from '../../../components/selection/user-dropdown';
import useRequest from '../../../hooks/useRequest';
import RepositoryServices from '../../../data-access/repository-services';

const getRoles = (): [name: string, id: string | Roles][] => {
  const entries = Object.entries(Roles);

  return entries.slice(entries.length / 2);
};

interface UserRolesEditorProps {
  model: UserModel;
}

const UserRolesEditor = (props: UserRolesEditorProps): ReactElement | null => {
  const { model } = props;

  const hasRole = (roleId: string | Roles) =>
    model.roles.includes(roleId as number);

  return (
    <table>
      <tr>
        <td>Role Name</td>
        <td>Granted</td>
      </tr>
      {getRoles().map(([name, value]) => {
        return (
          <tr>
            <td>{name}</td>
            <td>{hasRole(value).toString()}</td>
          </tr>
        );
      })}
    </table>
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
