import React, { useState, useCallback } from 'react';
import { Button } from 'semantic-ui-react';
import { useAuthContext } from './context';

const AuthButton = (props) => {
  const { fixed } = props;
  const context = useAuthContext();
  const [isAuthenticated, setIsAuthenticated] = useState(context.isAuthenticated);

  const loginOnClick = useCallback(async () => {
    const result = await context.authenticate({ email: 'ben@dirtleague.org', password: 'foobar' });

    setIsAuthenticated(result);
  }, [context]);

  const signupOnClick = useCallback(async () => {
    console.log('signup?');
  }, []);

  const logoutOnClick = useCallback(async () => {
    const result = await context.logout();

    setIsAuthenticated(!result);
  }, [context]);

  if (isAuthenticated) {
    return (
      <Button as='a' inverted={!fixed} onClick={logoutOnClick}>
        Log Out
      </Button>
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