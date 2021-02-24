import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import { Navigation } from './body';
import Home from './routes/home/index';
import Players, { PlayerDetails } from './routes/players/index';

const Courses = () => {
  return <h1>Courses</h1>;
};

const Router = () => {
  return (
    <BrowserRouter>
      <Navigation>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/players" component={Players} />
          <Route path="/players/:id" component={PlayerDetails} />
          <Route path="/courses" component={Courses} />
        </Switch>
      </Navigation>
    </BrowserRouter>
  );
};

export default Router;
