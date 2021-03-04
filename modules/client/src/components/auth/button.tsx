import React, { useState, useCallback } from 'react';
import { Button, Modal, Form, Message, Icon } from 'semantic-ui-react';
import { useAuthContext } from './context';
import { useTransaction, useInputBinding } from '../../hooks/forms';
import { AuthModel } from '../../managers/auth';

interface AuthButtonProps {
  fixed: boolean;
}

const defaultModel = new AuthModel({ email: '', password: '' });

const AuthButton = (props: AuthButtonProps) => {
  const { fixed } = props;
  const context = useAuthContext();
  const [isAuthenticated, setIsAuthenticated] = useState(
    // eslint-disable-next-line react/destructuring-assignment
    context?.isAuthenticated
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [shouldShowMessage, setShouldShowMessage] = useState(false);
  const { model, revertModel } = useTransaction(defaultModel);

  const loginOnClick = useCallback(() => {
    setShouldShowMessage(false);
    setIsModalOpen(true);
  }, []);

  const submitOnClick = useCallback(async () => {
    if (!model.current) {
      return;
    }

    setShouldShowMessage(false);
    setIsAuthenticating(true);
    const result = await context?.authenticate(model.current);
    setIsAuthenticating(false);
    setIsAuthenticated(result?.success);
    setShouldShowMessage(true);
  }, [context, model]);

  const onModalClose = useCallback(() => {
    setIsModalOpen(false);
    revertModel();
  }, [revertModel]);

  const logoutOnClick = useCallback(async () => {
    await context?.logout();
    setIsAuthenticated(false);
  }, [context]);

  const emailBinding = useInputBinding(model, 'email');
  const passwordBinding = useInputBinding(model, 'password');

  if (isAuthenticated) {
    return (
      <Button as="a" inverted={!fixed} onClick={logoutOnClick}>
        Log Out
      </Button>
    );
  }

  const showMessage = shouldShowMessage && !isAuthenticated;
  const message = !showMessage ? null : (
    <Message warning>
      <Icon name="warning" />
      Invalid email or password. Please try again.
    </Message>
  );

  return (
    <>
      <Button as="a" inverted={!fixed} onClick={loginOnClick}>
        Log in
      </Button>
      <Modal open={isModalOpen} onClose={onModalClose} size="small">
        <Modal.Header>Login</Modal.Header>
        <Modal.Content>
          <Form size="large">
            <Form.Input
              {...emailBinding}
              disabled={isAuthenticating}
              fluid
              icon="user"
              iconPosition="left"
              placeholder="E-mail address"
              type="email"
            />
            <Form.Input
              {...passwordBinding}
              disabled={isAuthenticating}
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
            />
          </Form>
          {message}
        </Modal.Content>
        <Modal.Actions>
          <Button negative disabled={isAuthenticating} onClick={onModalClose}>
            Cancel
          </Button>
          <Button positive loading={isAuthenticating} onClick={submitOnClick}>
            Submit
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default React.memo(AuthButton);
