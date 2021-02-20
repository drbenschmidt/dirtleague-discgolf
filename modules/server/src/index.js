import express from 'express';
import repositories, { createUsersTable } from './data-access/repositories.js';

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

app.get('/users', async (req, res) => {
  const users = await repositories.users.getAll();

  res.json(users);
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await repositories.users.get(id);

  res.json(user);
});

app.listen(port, async () => {
  console.log(`DirtLeague API listening at http://localhost:${port}`);
  console.log('Setting up database...');
  
  await createUsersTable();

  // NOTE: this will error on re-runs.
  await repositories.users.insert('ben@dirtleague.org', 'blue');
});
