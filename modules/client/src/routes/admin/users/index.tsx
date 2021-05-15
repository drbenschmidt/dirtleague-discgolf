import {
  ReactElement,
  useCallback,
  useState,
  useMemo,
  memo,
  SyntheticEvent,
} from 'react';
import { Form, Segment } from 'semantic-ui-react';
import { UserModel } from '@dirtleague/common';
import UserDropdown from '../../../components/selection/user-dropdown';
import useRequest from '../../../hooks/useRequest';
import RepositoryServices from '../../../data-access/repository-services';
import UserProfileMapper from './user-profile-mapper';
import SetPassword from './set-password';
import UserRolesEditor from './user-roles-editor';
import { EntitySearchValue } from '../../../components/forms/entity-search';

interface UserProfileHOCProps {
  userId: number;
}

const UserProfileHOC = (props: UserProfileHOCProps): ReactElement | null => {
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
    <Segment>
      {userData && <UserProfileMapper model={userData} />}
      {userData && <SetPassword model={userData} />}
      {userData && <UserRolesEditor model={userData} />}
    </Segment>
  );
};

const AdminUsers = (): ReactElement => {
  const [userId, setUserId] = useState<number>();
  const onUserSelect = useCallback(
    (
      event: SyntheticEvent<HTMLElement, Event>,
      selectedUserId: EntitySearchValue
    ) => {
      setUserId(selectedUserId as number);
    },
    []
  );

  return (
    <>
      <Form>
        <UserDropdown onChange={onUserSelect} label="User Email" />
      </Form>
      {userId && <UserProfileHOC userId={userId} key={userId} />}
    </>
  );
};

export default memo(AdminUsers);
