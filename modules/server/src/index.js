const express = require('express');

const app = express();
const port = 8081;

/**
 * TODO: Need to add REST API support for
 * post(auth) - { username, password } // later add nonce
 * post(users) - UserModel
 * get(users) - Array<UserModel>
 * delete(users) - { id }
 * patch(users) - UserModel
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
