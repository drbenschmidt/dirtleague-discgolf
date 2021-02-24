import React, { useState, useCallback } from 'react';
import { Visibility, Segment, Menu, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import AuthButton from './components/auth/button';

export const FancyLink = (props: any) => (
  <Menu.Item
    as={Link}
    {...props}
  >
    {props.children}
  </Menu.Item>
);

export const Navigation = (props: any) => {
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
        style={{ padding: '1em 0em' }}
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
            <FancyLink to="/">Home</FancyLink>
            <FancyLink to="/players">Players</FancyLink>
            <FancyLink to="/courses">Courses</FancyLink>
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
