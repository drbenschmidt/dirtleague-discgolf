import { useState, useCallback, useRef, useEffect, memo } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Modal, Form, Message, Icon } from 'semantic-ui-react';
import { useAuthContext } from './context';
import { useTransaction, useInputBinding } from '../../hooks/forms';
import { AuthModel } from '../../managers/auth';
import TextInput from '../forms/text-input';

interface AuthButtonProps {
  fixed: boolean;
}

const getHtmlInput = (ref: React.RefObject<HTMLElement | undefined>) =>
  ref?.current?.getElementsByTagName('input').item(0);

const FocusOnMount = (props: any) => {
  const { children } = props;
  const componentRef = useRef<HTMLElement>();

  useEffect(() => {
    const element = getHtmlInput(componentRef);
    element?.focus();
  }, []);

  return children(componentRef);
};

const defaultModel = new AuthModel({ email: '', password: '' });

const AuthButton = (props: AuthButtonProps) => {
  const { fixed } = props;
  const history = useHistory();
  const passwordInputRef = useRef<HTMLElement>();
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
    getHtmlInput(passwordInputRef)?.focus();

    if (result?.success) {
      history.go(0);
    }
  }, [context, model, history]);

  const onModalClose = useCallback(() => {
    setIsModalOpen(false);
    revertModel();
  }, [revertModel]);

  const logoutOnClick = useCallback(async () => {
    await context?.logout();
    setIsAuthenticated(false);
    history.go(0);
  }, [context, history]);

  const emailBinding = useInputBinding(model, 'email');
  const passwordBinding = useInputBinding(model, 'password');

  const onEnterPress = useCallback(
    event => {
      if (event.keyCode === 13) {
        submitOnClick();
      }
    },
    [submitOnClick]
  );

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
            <FocusOnMount>
              {(ref: React.Ref<HTMLElement>) => (
                <TextInput
                  {...emailBinding}
                  ref={ref}
                  disabled={isAuthenticating}
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="E-mail address"
                  type="email"
                />
              )}
            </FocusOnMount>
            <TextInput
              {...passwordBinding}
              ref={passwordInputRef}
              disabled={isAuthenticating}
              onKeyDown={onEnterPress}
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

export default memo(AuthButton);
