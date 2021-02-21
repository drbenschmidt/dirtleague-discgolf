import express from 'express';
import RepositoryServices from './data-access/repositories.js';
import applyUsersRoute from './routes/users.js';

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

const services = new RepositoryServices();

applyUsersRoute(app, services);

app.listen(port, async () => {
  console.log(`DirtLeague API listening at http://localhost:${port}`);  
});
