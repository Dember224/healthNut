const express = require('express');
const app = express();
const port = 3001;
const session = require('express-session');
const signup = require('C:/Users/Antoine/healthNut/router/signup.js');
const signin = require('C:/Users/Antoine/healthNut/router/signin.js');

let sesh;

app.use(session({secret: 'doodle monkey'}));

app.use('/signup', signup.signupForm);

app.use('/', signup.postSignup);

app.get('/signin', signin.signinForm);

app.post('/signin', signin.signin);

app.use('/home', signin.home);

app.listen(port, ()=>{
  console.log(`Connection successful.`)
});