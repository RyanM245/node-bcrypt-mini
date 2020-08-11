require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const massive = require('massive');
const ctrl = require('./ctrl');
const app = express();

app.use(express.json());

let { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24}
  })
);

massive(CONNECTION_STRING).then(db => {
  app.set('db', db);
});

app.post('/auth/signup', ctrl.signup);
app.post('/auth/login', ctrl.login);
app.get('/auth/logout', ctrl.logout);

app.listen(SERVER_PORT, () => {
  console.log(`Listening on port: ${SERVER_PORT}`);
});
