import { Menu } from 'semantic-ui-react';
import { Link, useRouteMatch } from 'react-router-dom';
import { ReactElement } from 'react';

interface AdminMenuLinkProps {
  to: string;
  text: string;
}

const AdminMenuLink = (props: AdminMenuLinkProps): ReactElement => {
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
    <Menu fluid vertical>
      <AdminMenuLink to={`${path}`} text="Dashboard" />
      <AdminMenuLink to={`${path}/users`} text="Users" />
    </Menu>
  );
};

export default AdminMenu;
