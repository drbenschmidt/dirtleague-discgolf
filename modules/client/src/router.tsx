import React, { ReactElement } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Navigation } from './body';
import Home from './routes/home/index';
import {
  PlayerList,
  PlayerDetails,
  PlayerCreate,
} from './routes/players/index';
import { CourseList, CourseDetails } from './routes/courses/index';
import { EventList, EventDetails } from './routes/events/index';
import { SeasonList, SeasonDetails } from './routes/seasons/index';

const Router = (): ReactElement => {
  return (
    <BrowserRouter>
      <Navigation>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/players" component={PlayerList} />
          <Route exact path="/players/new" component={PlayerCreate} />
          <Route exact path="/players/:id" component={PlayerDetails} />
          <Route exact path="/courses" component={CourseList} />
          <Route exact path="/courses/:id" component={CourseDetails} />
          <Route exact path="/events" component={EventList} />
          <Route exact path="/events/:id" component={EventDetails} />
          <Route exact path="/seasons" component={SeasonList} />
          <Route exact path="/seasons/:id" component={SeasonDetails} />
        </Switch>
      </Navigation>
    </BrowserRouter>
  );
};

export default Router;
