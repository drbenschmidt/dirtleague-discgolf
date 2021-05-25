import { PropsWithChildren, ReactElement } from 'react';
import {
  Dropdown,
  Menu,
  Grid,
  MenuItemProps,
  DropdownItemProps,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import AuthButton from './components/auth/button';
import SignUpButton from './components/sign-up/button';
import Toaster from './components/notifications/toaster';
import IfAuthorized from './components/auth/if-admin';

declare const VERSION: string;

const getVersion = () => {
  const versionParts = VERSION.split('-');
  if (versionParts.length === 4) {
    const [version, preRelease, commitsAhead, hash] = versionParts;

    return `${version} ${preRelease} (${hash} + ${commitsAhead})`;
  }

  const [version, commitsAhead, hash] = versionParts;

  return `${version} (${hash} + ${commitsAhead})`;
};

export const MenuLink = (
  props: PropsWithChildren<MenuItemProps>
): ReactElement => {
  const { children } = props;

  return (
    <Menu.Item as={Link} {...props}>
      {children}
    </Menu.Item>
  );
};

export const DropdownLink = (
  props: PropsWithChildren<DropdownItemProps>
): ReactElement => {
  const { children } = props;

  return (
    <Dropdown.Item as={Link} {...props}>
      {children}
    </Dropdown.Item>
  );
};

export const Footer = (): ReactElement => {
  return (
    <Grid inverted>
      <Grid.Row>
        <Grid.Column width="16" textAlign="center" verticalAlign="middle">
          Dirt League {getVersion()}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export const Body = (props: PropsWithChildren<unknown>): ReactElement => {
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
            <IfAuthorized>
              <MenuLink to="/admin">Admin</MenuLink>
            </IfAuthorized>
            <Menu.Item position="right">
              <SignUpButton fixed={false} />
              <AuthButton fixed={false} />
            </Menu.Item>
          </Grid.Row>
          <Grid.Row only="tablet mobile">
            <MenuLink to="/">Home</MenuLink>
            <Dropdown item icon="ellipsis horizontal">
              <Dropdown.Menu>
                <DropdownLink to="/players">Players</DropdownLink>
                <DropdownLink to="/courses">Courses</DropdownLink>
                <DropdownLink to="/events">Events</DropdownLink>
                <DropdownLink to="/seasons">Seasons</DropdownLink>
                <IfAuthorized>
                  <DropdownLink to="/admin">Admin</DropdownLink>
                </IfAuthorized>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item position="right">
              <SignUpButton fixed={false} />
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
