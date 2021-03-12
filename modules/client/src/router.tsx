import { ReactElement } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Navigation } from './body';
import Home from './routes/home/index';
import PlayerForm from './routes/players/form';
import PlayerList from './routes/players/list';
import PlayerDetails from './routes/players/details';
import CourseForm from './routes/courses/form';
import CourseList from './routes/courses/list';
import CourseDetails from './routes/courses/details';
import EventList from './routes/events/list';
import EventDetails from './routes/events/details';
import EventForm from './routes/events/form';
import SeasonList from './routes/seasons/list';
import SeasonForm from './routes/seasons/form';

const Router = (): ReactElement => {
  return (
    <BrowserRouter>
      <Navigation>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/players" component={PlayerList} />
          <Route exact path="/players/new" component={PlayerForm} />
          <Route exact path="/players/edit/:id" component={PlayerForm} />
          <Route exact path="/players/:id" component={PlayerDetails} />
          <Route exact path="/courses" component={CourseList} />
          <Route exact path="/courses/new" component={CourseForm} />
          <Route exact path="/courses/edit/:id" component={CourseForm} />
          <Route exact path="/courses/:id" component={CourseDetails} />
          <Route exact path="/events" component={EventList} />
          <Route exact path="/events/new" component={EventForm} />
          <Route exact path="/events/:id" component={EventDetails} />
          <Route exact path="/seasons" component={SeasonList} />
          <Route exact path="/seasons/new" component={SeasonForm} />
          <Route exact path="/seasons/edit/:id" component={SeasonForm} />
        </Switch>
      </Navigation>
    </BrowserRouter>
  );
};

export default Router;
