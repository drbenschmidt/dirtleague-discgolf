import { useState, useCallback, ReactElement } from 'react';
import { Visibility, Segment, Menu, Container, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import AuthButton from './components/auth/button';
import Toaster from './components/notifications/toaster';

export const MenuLink = (props: any): ReactElement => {
  const { children } = props;
  return (
    <Menu.Item as={Link} {...props}>
      {children}
    </Menu.Item>
  );
};

export const Navigation = (props: any): ReactElement => {
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
          textAlign="center"
          style={{ padding: '1em 0em' }}
          vertical
        >
          <Menu
            fixed={fixed ? 'top' : undefined}
            inverted={!fixed}
            pointing={!fixed}
            secondary={!fixed}
            size="large"
          >
            <Container>
              <MenuLink to="/">Home</MenuLink>
              <MenuLink to="/players">Players</MenuLink>
              <MenuLink to="/courses">Courses</MenuLink>
              <MenuLink to="/events">Events</MenuLink>
              <MenuLink to="/seasons">Seasons</MenuLink>
              <Menu.Item position="right">
                <AuthButton fixed={fixed} />
              </Menu.Item>
            </Container>
          </Menu>
        </Segment>
      </Visibility>
      <Segment style={{ padding: '2em 0em' }} vertical>
        <Grid container stackable verticalAlign="middle">
          <Grid.Row>
            <Grid.Column width={16}>{children}</Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      <Toaster />
    </>
  );
};
