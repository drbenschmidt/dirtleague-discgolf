import { ReactElement, useCallback, memo, useRef } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { UserModel } from '@dirtleague/common';
import PlayerSelect from '../../../components/selection/player-select';
import { useRepositoryServices } from '../../../data-access/context';

export interface UserProfileMapperProps {
  model: UserModel;
}

const UserProfileMapper = (
  props: UserProfileMapperProps
): ReactElement | null => {
  const { model } = props;
  const profileIdRef = useRef(model.playerId);
  const services = useRepositoryServices();

  const onChange = useCallback((event, value) => {
    profileIdRef.current = value;
  }, []);

  const onClick = useCallback(() => {
    if (profileIdRef.current) {
      services.users.patch(model.id, { playerId: profileIdRef.current });
    }
  }, [model.id, services.users]);

  return (
    <Form onSubmit={() => {}}>
      <Form.Group>
        <PlayerSelect
          value={model.playerId}
          label="Player Profile"
          onChange={onChange}
        />
        <Button onClick={onClick}>Update</Button>
      </Form.Group>
    </Form>
  );
};

export default memo(UserProfileMapper);
