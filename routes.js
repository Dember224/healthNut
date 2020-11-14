const express = require('express');
const app = express();
const port = 3001;
const session = require('express-session');
const signup = require('C:/Users/Antoine/healthNut/router/signup.js')

app.use('/signup', signup.signupForm);

app.use('/', signup.postSignup);

app.listen(port, ()=>{
  console.log(`Connection successful.`)
});
