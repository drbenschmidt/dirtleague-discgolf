import { ReactElement, useCallback, memo, useRef } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { UserModel } from '@dirtleague/common';
import { useRepositoryServices } from '../../../data-access/context';

export interface SetPasswordProps {
  model: UserModel;
}

const SetPassword = (props: SetPasswordProps): ReactElement => {
  const { model } = props;
  const passwordRef = useRef<string>();
  const services = useRepositoryServices();

  const onClick = useCallback(() => {
    if (passwordRef.current) {
      services.users.updatePassword(model.id, passwordRef.current);
    }
  }, [model.id, services.users]);

  const onChange = useCallback((event, data) => {
    const { value } = data;

    passwordRef.current = value;
  }, []);

  return (
    <Form>
      <Form.Group>
        <Form.Input
          label="Enter Password to set"
          onChange={onChange}
          action={<Button onClick={onClick}>Update</Button>}
        />
      </Form.Group>
    </Form>
  );
};

export default memo(SetPassword);
