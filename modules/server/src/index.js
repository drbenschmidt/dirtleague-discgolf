import express from 'express';
import { applyToken } from './auth/handler.js';
import RepositoryServices from './data-access/repositories.js';
import buildUsersRoute from './routes/users.js';
import buildAuthRoute from './routes/auth.js';
import genericErrorHandler from './http/generic-error-handler.js';
import corsHandler from './http/cors-handler.js';

const app = express();
const port = 8081; // TODO: Make configurable.
const services = new RepositoryServices();

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

// Setup our handlers/middlewares.
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(applyToken);
app.use(genericErrorHandler);

// For now, just tell express that any OPTIONS request should follow the same CORS rules.
app.options('*', corsHandler);

// Add the routers for each area.
app.use('/users', buildUsersRoute(services));
app.use('/auth', buildAuthRoute(services));

app.listen(port, async () => {
  console.log(`DirtLeague API listening at http://localhost:${port}`);  
});
