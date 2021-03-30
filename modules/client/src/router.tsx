import { ReactElement, Suspense, lazy } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Navigation } from './body';

const Home = lazy(() => import('./routes/home/index'));
const PlayerForm = lazy(() => import('./routes/players/form'));
const PlayerList = lazy(() => import('./routes/players/list'));
const PlayerDetails = lazy(() => import('./routes/players/details'));
const CourseForm = lazy(() => import('./routes/courses/form'));
const CourseList = lazy(() => import('./routes/courses/list'));
const CourseDetails = lazy(() => import('./routes/courses/details'));
const EventList = lazy(() => import('./routes/events/list'));
const EventDetails = lazy(() => import('./routes/events/details'));
const EventForm = lazy(() => import('./routes/events/form'));
const EventResults = lazy(() => import('./routes/events/results'));
const SeasonList = lazy(() => import('./routes/seasons/list'));
const SeasonForm = lazy(() => import('./routes/seasons/form'));

const Router = (): ReactElement => {
  return (
    <BrowserRouter>
      <Navigation>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/players" component={PlayerList} />
            <Route exact path="/players/new" component={PlayerForm} />
            <Route exact path="/players/:id" component={PlayerDetails} />
            <Route exact path="/players/:id/edit" component={PlayerForm} />
            <Route exact path="/courses" component={CourseList} />
            <Route exact path="/courses/new" component={CourseForm} />
            <Route exact path="/courses/:id" component={CourseDetails} />
            <Route exact path="/courses/:id/edit" component={CourseForm} />
            <Route exact path="/events" component={EventList} />
            <Route exact path="/events/new" component={EventForm} />
            <Route exact path="/events/:id" component={EventDetails} />
            <Route exact path="/events/:id/edit" component={EventForm} />
            <Route exact path="/events/:id/results" component={EventResults} />
            <Route exact path="/seasons" component={SeasonList} />
            <Route exact path="/seasons/new" component={SeasonForm} />
            <Route exact path="/seasons/:id/edit" component={SeasonForm} />
          </Switch>
        </Suspense>
      </Navigation>
    </BrowserRouter>
  );
};

export default Router;
