import path from 'path';
import express, { json } from 'express';
import morgan from 'morgan';
import { renderFile } from 'ejs';
import { getDefaultConfigManager } from './config/manager';
import { applyToken } from './auth/handler';
import RepositoryServices from './data-access/repository-services';
import buildUsersRoute from './routes/users';
import buildAuthRoute from './routes/auth';
import buildProfilesRoute from './routes/players';
import buildAliasesRoute from './routes/aliases';
import buildCoursesRoute from './routes/courses';
import buildSeasonsRoute from './routes/seasons';
import buildEventsRoute from './routes/events';
import buildRoundsRoute from './routes/rounds';
import buildCourseLayoutsRoute from './routes/course-layouts';
import genericErrorHandler from './http/generic-error-handler';
import corsHandler from './http/cors-handler';

const config = getDefaultConfigManager();
const app = express();
const port = config.props.DIRT_API_PORT;
const services = new RepositoryServices();

// Setup our handlers/middlewares.
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(applyToken);
app.use(genericErrorHandler);

// For prod builds, we want to serve the static files of the frontend app.
app.use('/static', express.static('../client/build/static'));
app.set('views', path.join(__dirname, '../../client/build'));
app.engine('html', renderFile);

const rootUrls = ['/players', '/courses', '/events', '/seasons'];

const allUrls = rootUrls.reduce((acc, cur) => {
  acc.push(cur);
  acc.push(`${cur}/*`);
  return acc;
}, []);

app.get(['/', ...allUrls], (req, res) => {
  const configRaw = JSON.stringify(config.client);
  const configEncoded = encodeURIComponent(configRaw);

  res.render('index.html', { CONFIG_STRING: configEncoded });
});

// For now, just tell express that any OPTIONS request should follow the same CORS rules.
app.options('*', corsHandler);

// TODO: Switch this between dev/prod.
app.use(morgan('dev'));

// Add the routers for each area.
app.use('/api/users', buildUsersRoute(services));
app.use('/api/auth', buildAuthRoute(services));
app.use('/api/players', buildProfilesRoute(services));
app.use('/api/aliases', buildAliasesRoute(services));
app.use('/api/courses', buildCoursesRoute(services));
app.use('/api/seasons', buildSeasonsRoute(services));
app.use('/api/courseLayouts', buildCourseLayoutsRoute(services));
app.use('/api/events', buildEventsRoute(services));
app.use('/api/rounds', buildRoundsRoute(services));

app.listen(port, async () => {
  console.log(`DirtLeague API listening at http://localhost:${port}`);
});
