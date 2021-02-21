import 'semantic-ui-css/semantic.min.css';
import React, { useState, useCallback } from 'react';
import { Visibility, Segment, Menu, Container, Button} from 'semantic-ui-react';

const App = (props: any) => {
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
                <Button as='a' inverted={!fixed}>
                  Log in
                </Button>
                <Button as='a' inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }}>
                  Sign Up
                </Button>
              </Menu.Item>
            </Container>
          </Menu>
        </Segment>
      </Visibility>
      {children}
    </>
  )
};

export default React.memo(App);
