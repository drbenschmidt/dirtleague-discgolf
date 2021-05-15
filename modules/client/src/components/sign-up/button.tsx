import { useState, useCallback, useRef, memo } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Modal, Form, Message, Icon } from 'semantic-ui-react';
import { getHtmlInput } from '@dirtleague/common';
import { useAuthContext } from '../auth/context';
import { useTransaction, useInputBinding } from '../../hooks/forms';
import { SignUpModel } from './model';
import TextInput from '../forms/text-input';
import FocusOnMount from '../generic/focus-on-mount';
import { useRepositoryServices } from '../../data-access/context';

interface AuthButtonProps {
  fixed: boolean;
}

const defaultModel = new SignUpModel();

const SignUpButton = (props: AuthButtonProps) => {
  const { fixed } = props;
  const history = useHistory();
  const passwordInputRef = useRef<HTMLElement>(null);
  const context = useAuthContext();
  const [isAuthenticated, setIsAuthenticated] = useState(
    // eslint-disable-next-line react/destructuring-assignment
    context?.isAuthenticated
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [shouldShowMessage, setShouldShowMessage] = useState(false);
  const { model, revertModel } = useTransaction(defaultModel);
  const services = useRepositoryServices();

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
    const result = await services.users.register(model.current);
    setIsAuthenticating(false);
    setIsAuthenticated(result?.success);
    setShouldShowMessage(true);
    getHtmlInput(passwordInputRef)?.focus();

    if (result?.success) {
      context?.setUser(result.user, result.token);
      history.go(0);
    }
  }, [model, services.users, context, history]);

  const onModalClose = useCallback(() => {
    setIsModalOpen(false);
    revertModel();
  }, [revertModel]);

  const emailBinding = useInputBinding(model, 'email');
  const passwordBinding = useInputBinding(model, 'password');
  const password2Binding = useInputBinding(model, 'password2');
  const firstNameBinding = useInputBinding(model, 'firstName');
  const lastNameBinding = useInputBinding(model, 'lastName');

  if (isAuthenticated) {
    return null;
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
      <Button
        as="a"
        inverted={fixed}
        color="youtube"
        onClick={loginOnClick}
        style={{ marginRight: '5px' }}
      >
        Sign Up
      </Button>
      <Modal open={isModalOpen} onClose={onModalClose} size="small">
        <Modal.Header>Sign Up</Modal.Header>
        <Modal.Content>
          <Form size="large">
            <FocusOnMount>
              {ref => (
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
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
            />
            <TextInput
              {...password2Binding}
              disabled={isAuthenticating}
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Repeat Password"
              type="password"
            />
            <Form.Group widths="2">
              <TextInput
                {...firstNameBinding}
                disabled={isAuthenticating}
                fluid
                placeholder="Johnny"
                label="First Name"
              />
              <TextInput
                {...lastNameBinding}
                disabled={isAuthenticating}
                fluid
                placeholder="Discgolf"
                label="Last Name"
              />
            </Form.Group>
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

export default memo(SignUpButton);
