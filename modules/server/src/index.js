import express from 'express';
import session from 'express-session';
import { getDefaultConfigManager } from './config/manager.js';
import RepositoryServices from './data-access/repositories.js';
import buildUsersRoute from './routes/users.js';
import buildAuthRoute from './routes/auth.js';

const configManager = getDefaultConfigManager();
const app = express();
const port = 8081; // TODO: Make configurable.

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

// app.options('*', cors());

// NOTE: For now, just allow any other domain to access the API.
// We're not really the most secure thing in the world, but whatever. v2 I guess.
/*app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
}));*/

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// TODO: Use https://npmjs.com/package/express-mysql-session for prod.
// The default in-memory session store apparently will leak memory.
app.use(session({
  name: 'DIRTY_COOKIE', // TODO: Make configurable.
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: configManager.props.sessionSecret,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // one day
    //sameSite: 'none',
  },
}));

// TODO: Move into it's own middleware file.
app.use((err, req, res, next) => {
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
