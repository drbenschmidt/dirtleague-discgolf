import { Menu } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import { ReactElement } from 'react';

const AdminMenuLink = (props: any): ReactElement => {
  const { to, text } = props;

  const match = useRouteMatch({
    path: to,
    exact: true,
  });

  const active = !!match;

  return (
    <Menu.Item active={active} as={Link} to={to}>
      {text}
    </Menu.Item>
  );
};

const AdminMenu = (): ReactElement => {
  const { path } = useRouteMatch();

  return (
    <Menu vertical size="small">
      <AdminMenuLink to={`${path}`} name="dashboard" text="Dashboard" />
      <AdminMenuLink to={`${path}/users`} name="users" text="Users" />
    </Menu>
  );
};

export default AdminMenu;
