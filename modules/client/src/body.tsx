import { ReactElement } from 'react';
import { Dropdown, Menu, Grid } from 'semantic-ui-react';
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

export const DropdownLink = (props: any): ReactElement => {
  const { children } = props;
  return (
    <Dropdown.Item as={Link} {...props}>
      {children}
    </Dropdown.Item>
  );
};

/*
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
          
        </Segment>
      </Visibility>
      <Segment style={{ padding: '2em 0em' }} vertical>
        <Grid container stackable verticalAlign="middle">
          <Grid.Row>
            <Grid.Column width={16}>{children}</Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </>
  );
};
*/

export const Footer = (): ReactElement => {
  return (
    <Grid inverted>
      <Grid.Row>
        <Grid.Column width="16" textAlign="center" verticalAlign="middle">
          Dirt League
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export const Body = (props: any): ReactElement => {
  const { children } = props;

  return (
    <>
      <Menu fixed="top" inverted size="large">
        <Grid container>
          <Grid.Row only="computer">
            <MenuLink to="/">Home</MenuLink>
            <MenuLink to="/players">Players</MenuLink>
            <MenuLink to="/courses">Courses</MenuLink>
            <MenuLink to="/events">Events</MenuLink>
            <MenuLink to="/seasons">Seasons</MenuLink>
            <Menu.Item position="right">
              <AuthButton fixed={false} />
            </Menu.Item>
          </Grid.Row>
          <Grid.Row only="tablet mobile">
            <MenuLink to="/">Home</MenuLink>
            <Dropdown item simple icon="ellipsis horizontal">
              <Dropdown.Menu>
                <DropdownLink to="/players">Players</DropdownLink>
                <DropdownLink to="/courses">Courses</DropdownLink>
                <DropdownLink to="/events">Events</DropdownLink>
                <DropdownLink to="/seasons">Seasons</DropdownLink>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item position="right">
              <AuthButton fixed={false} />
            </Menu.Item>
          </Grid.Row>
        </Grid>
      </Menu>
      <div className="content">
        <Grid container verticalAlign="middle">
          <Grid.Row>
            <Grid.Column width={16}>{children}</Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
      <Toaster />
      <footer className="footer">
        <Footer />
      </footer>
    </>
  );
};
