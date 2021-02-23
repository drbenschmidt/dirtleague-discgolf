import React, { useState, useCallback } from 'react';
import { Button } from 'semantic-ui-react';
import { useAuthContext } from './context';
import { RepositoryServices, ApiFetch } from '../../data-access/repositories';

const apiFetch = new ApiFetch();
const services = new RepositoryServices({ api: apiFetch });

const AuthButton = (props) => {
  const { fixed } = props;
  const context = useAuthContext();
  const [isAuthenticated, setIsAuthenticated] = useState(context.isAuthenticated);

  const loginOnClick = useCallback(async () => {
    const result = await context.authenticate({ email: 'ben@dirtleague.org', password: 'foobar' });

    setIsAuthenticated(result);
  }, [context]);

  const signupOnClick = useCallback(async () => {
    await services.getUser(1);
  }, []);

  const logoutOnClick = useCallback(async () => {
    await context.logout();
    setIsAuthenticated(false);
  }, [context]);

  if (isAuthenticated) {
    return (
      <>
      <Button as='a' inverted={!fixed} onClick={logoutOnClick}>
        Log Out
      </Button>
      <Button as='a' inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }} onClick={signupOnClick}>
        Sign Up
      </Button>
      </>
    );
  }

  return (
    <>
      <Button as='a' inverted={!fixed} onClick={loginOnClick}>
        Log in
      </Button>
      <Button as='a' inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }} onClick={signupOnClick}>
        Sign Up
      </Button>
    </>
  );
};

export default AuthButton;