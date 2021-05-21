import path from 'path';
import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import https from 'https';
import fs from 'fs';
import { renderFile } from 'ejs';
import { getDefaultConfigManager } from './config/manager';
import { applyToken } from './auth/handler';
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
import insecureRedirector from './http/insecure-redirector';

const sanitizeString = (str: string) => {
  return str.replace(/^"(.*)"$/, '$1');
};

const config = getDefaultConfigManager();
const app = express();
const port = config.props.DIRT_API_PORT;

// CORS handling needs to come first.
app.use(corsHandler);

// TODO: Check for prod/if enabled.
app.use(compression());

// Setup our handlers/middlewares.
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(applyToken);
app.use(genericErrorHandler);

// For prod builds, we want to serve the static files of the frontend app.
app.use('/', express.static('../client/build'));
app.set('views', path.join(__dirname, '../../client/build'));
app.engine('html', renderFile);

const rootUrls = [
  '/players',
  '/courses',
  '/events',
  '/seasons',
  '/admin',
  '/unauthorized',
];

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

// TODO: Switch this between dev/prod.
app.use(morgan('dev'));

// Add the routers for each area.
app.use('/api/users', buildUsersRoute());
app.use('/api/auth', buildAuthRoute());
app.use('/api/players', buildProfilesRoute());
app.use('/api/aliases', buildAliasesRoute());
app.use('/api/courses', buildCoursesRoute());
app.use('/api/seasons', buildSeasonsRoute());
app.use('/api/courseLayouts', buildCourseLayoutsRoute());
app.use('/api/events', buildEventsRoute());
app.use('/api/rounds', buildRoundsRoute());

if (config.props.DIRT_API_USE_HTTPS) {
  const key = fs.readFileSync(
    sanitizeString(config.props.DIRT_API_HTTPS_PK),
    'utf8'
  );
  const cert = fs.readFileSync(
    sanitizeString(config.props.DIRT_API_HTTPS_CERT),
    'utf8'
  );
  const ca = fs.readFileSync(
    sanitizeString(config.props.DIRT_API_HTTPS_CA),
    'utf8'
  );

  const credentials = {
    key,
    cert,
    ca,
  };

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(port, () => {
    console.log(`Secure DirtLeague API listening on ${port}!`);
  });

  insecureRedirector.listen(80, () => {
    console.log(`Insecure Redirector listening on 80`);
  });
} else {
  app.listen(port, async () => {
    console.log(`DirtLeague API listening at http://localhost:${port}`);
  });
}
