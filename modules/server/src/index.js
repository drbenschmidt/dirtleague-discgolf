import express from 'express';
import session from 'express-session';
import { getDefaultConfigManager } from './config/manager.js';
import RepositoryServices from './data-access/repositories.js';
import buildUsersRoute from './routes/users.js';
import buildAuthRoute from './routes/auth.js';

const configManager = getDefaultConfigManager();
const app = express();
const port = 8081;

/**
 * TODO: Need to add REST API support for
 * post(auth) - { username, password } // later add nonce
 * post(users) - UserModel
 * get(users) - Array<UserModel>
 * delete(users) - { id }
 * patch(users) - UserModel
 * post(profiles) - ProfileModel
 * get(profiles) - Array<ProfileModel>
 * post(courses) - CourseModel
 * get(courses) - Array<CourseModel>
 * delete(courses) - { id }
 * patch(courses) - CourseModel
 * post(seasons) - SeasonModel
 * post(events) - EventModel
 * get(events) - Array<EventModel>
 * delete(events) - { id }
 * patch(events) - EventModel
 * post(events/import) - { file: UDisc CSV }
 */

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// TODO: Setup the secret in the config provider.
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: configManager.props.sessionSecret
}));

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

const services = new RepositoryServices();

// Add the routers for each area.
app.use('/users', buildUsersRoute(services));
app.use('/auth', buildAuthRoute(services));

app.listen(port, async () => {
  console.log(`DirtLeague API listening at http://localhost:${port}`);  
});
