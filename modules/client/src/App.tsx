import 'semantic-ui-css/semantic.min.css';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Visibility, Segment, Menu, Container } from 'semantic-ui-react';
import AuthContext from './components/auth/context';
import AuthManager from './managers/auth';
import AuthButton from './components/auth/button';
import { ApiFetch } from './data-access/repositories';

const Body = (props: any) => {
  const { children } = props;
  const [fixed, setFixed] = useState(false);
  const showFixedMenu = useCallback(() => setFixed(true), []);
  const hideFixedMenu = useCallback(() => setFixed(false), []);

  return (
    <>
      <Visibility
        once={false}
        onBottomPassed={showFixedMenu}
        onBottomPassedReverse={hideFixedMenu}
      >
        <Segment
          inverted
          textAlign='center'
          style={{ minHeight: 700, padding: '1em 0em' }}
          vertical
        >
          <Menu
            fixed={fixed ? 'top' : undefined}
            inverted={!fixed}
            pointing={!fixed}
            secondary={!fixed}
            size='large'
          >
            <Container>
              <Menu.Item as='a' active>
                Home
              </Menu.Item>
              <Menu.Item as='a'>Players</Menu.Item>
              <Menu.Item as='a'>Courses</Menu.Item>
              <Menu.Item as='a'>Events</Menu.Item>
              <Menu.Item as='a'>Seasons</Menu.Item>
              <Menu.Item position='right'>
                <AuthButton fixed={fixed} />
              </Menu.Item>
            </Container>
          </Menu>
        </Segment>
      </Visibility>
      {children}
    </>
  )
};

function useOnce<T>(fn: () => T): T {
  return useMemo(fn, []);
}

const App = () => {
  const apiFetch = useOnce(() => ApiFetch.CreateFromLocalStorage());
  const authManager = useOnce(() => new AuthManager(apiFetch));
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const doWork = async () => {
      await authManager.getIsAuthenticated();
      setIsLoaded(true);
    };

    doWork();
  }, [authManager]);

  if (!isLoaded) {
    // TODO: Show loading screen.
    return null;
  }

  return (
    <AuthContext.Provider value={authManager}>
      <Body />
    </AuthContext.Provider>
  )
};

export default React.memo(App);
