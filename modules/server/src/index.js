import express from 'express';
import RepositoryServices from './data-access/repositories.js';
import applyUsersRoute from './routes/users.js';
import hashBuilder from 'pbkdf2-password';
import session from 'express-session';

const hash = hashBuilder();
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

app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
}));

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.use(function(req, res, next){
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

const users = {
  ben: { name: 'ben' }
};

hash({ password: 'foobar' }, function (err, pass, salt, hash) {
  if (err) throw err;
  
  // store the salt & hash in the "db"
  users.ben.salt = salt;
  users.ben.hash = hash;
});

function authenticate(name, pass, fn) {
  console.log('authenticating %s:%s', name, pass);

  var user = users[name];
  // query the db for the given username
  if (!user) return fn(new Error('cannot find user'));
  // apply the same algorithm to the POSTed password, applying
  // the hash against the pass / salt, if there is a match we
  // found the user
  hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
    if (err) return fn(err);
    if (hash === user.hash) return fn(null, user)
    fn(new Error('invalid password'));
  });
}

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401);
    res.json({ error: 'Unauthorized' });
  }
}

app.post('/login', (req, res) => {
  const { username, password, redirect = '/' } = req.body;

  authenticate(username, password, (err, user) => {
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function(){
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        res.redirect(redirect);
      });
    } else {
      // TODO: Add a random timeout to prevent brute force attacks.
      res.status(401);
      res.json({ error: 'Username or password invalid' });
    }
  });
});

const services = new RepositoryServices();

applyUsersRoute(app, services);

app.get('/test', restrict, (req, res) => {
  res.json({ success: true });
});

app.listen(port, async () => {
  console.log(`DirtLeague API listening at http://localhost:${port}`);  
});
