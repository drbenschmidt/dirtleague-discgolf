import express from 'express';
import morgan from 'morgan';
import { applyToken } from './auth/handler';
import RepositoryServices from './data-access/repository-services';
import buildUsersRoute from './routes/users';
import buildAuthRoute from './routes/auth';
import buildProfilesRoute from './routes/players';
import buildAliasesRoute from './routes/aliases';
import buildCoursesRoute from './routes/courses';
import buildSeasonsRoute from './routes/seasons';
import buildEventsRoute from './routes/events';
import buildCourseLayoutsRoute from './routes/course-layouts';
import genericErrorHandler from './http/generic-error-handler';
import corsHandler from './http/cors-handler';

const app = express();
const port = 8081; // TODO: Make configurable.
const services = new RepositoryServices();

// Setup our handlers/middlewares.
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(applyToken);
app.use(genericErrorHandler);

// For now, just tell express that any OPTIONS request should follow the same CORS rules.
app.options('*', corsHandler);

// TODO: Switch this between dev/prod.
app.use(morgan('dev'));

// Add the routers for each area.
app.use('/users', buildUsersRoute(services));
app.use('/auth', buildAuthRoute(services));
app.use('/players', buildProfilesRoute(services));
app.use('/aliases', buildAliasesRoute(services));
app.use('/courses', buildCoursesRoute(services));
app.use('/seasons', buildSeasonsRoute(services));
app.use('/courseLayouts', buildCourseLayoutsRoute(services));
app.use('/events', buildEventsRoute(services));

app.listen(port, async () => {
  console.log(`DirtLeague API listening at http://localhost:${port}`);
});
