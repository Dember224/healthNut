const express = require('express');
const router = express.Router();
const app = express()
const sql = require('mssql');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const bodyParser = require('body-parser');
const dbConfig = require('C:/Users/Antoine/healthNut/DBConfig.js');

const signinForm = router.get('/signin', (req, res)=>{
  res.sendFile('C:/Users/Antoine/healthNut/api/views/signin.html');
})

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.use(session({secret:'doodle monkey'}));

const signin = router.post('/signin', (req, res)=>{
  const config = dbConfig.config;

  const email = req.body.email;
  const password = req.body.password;
  req.session.email = email;
  async function userLogin() {
    try{
      let pool = await sql.connect(config);
      let request = await pool.request();
      request.input('email', sql.VarChar, email);
      const storedPassword = await request.query('SELECT password FROM Athlete WHERE CONVERT(VARCHAR, email) = CONVERT(VARCHAR, @email)');
      const passwordString = storedPassword.recordset[0].password.toString();

        await bcrypt.compare(password, passwordString, function(e,r){
          if(e) return e;
          if (r){
            res.sendFile('C:/Users/Antoine/healthNut/api/views/home.html');
          } else {
            console.log('This is some bullshit. Use the right password.');
            res.SendFile('C:/Users/Antoine/healthNut/api/views/signin.html');
          }
      })

    } catch(err) {
      console.log(`there was a problem and nothing works ${err}`);
    }


  }
  userLogin();
  res.end()
})

const home = router.get('/home', (req, res)=>{
  res.sendFile('C:/Users/Antoine/healthNut/api/views/home.html');
})

module.exports = {
  router,
  signinForm,
  signin,
  home
}
