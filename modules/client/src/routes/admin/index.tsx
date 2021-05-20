import { lazy, ReactElement } from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import AdminMenu from './menu';

const Dashboard = lazy(() => import('./dashboard'));
const Users = lazy(() => import('./users/index'));

const Admin = (): ReactElement => {
  const { path } = useRouteMatch();

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column computer="3" mobile="16">
          <AdminMenu />
        </Grid.Column>
        <Grid.Column computer="13" mobile="16">
          <Switch>
            <Route exact path={`${path}/`} component={Dashboard} />
            <Route exact path={`${path}/users`} component={Users} />
          </Switch>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

Admin.whyDidYouRender = true;

export default Admin;
