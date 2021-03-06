const express = require('express');
const router = express.Router();
const app = express()
const bodyParser = require('body-parser')
const sql = require('mssql')
const session = require('express-session')
const bcrypt = require('bcrypt')
const saltRounds = 10
const dbConfig = require('C:/Users/Antoine/healthNut/DBConfig.js');


const signupForm = router.get('/', (req, res)=>{
  res.sendFile('C:/Users/Antoine/healthNut/api/views/signup.html')
});



app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.use(session({secret:'doodle monkey'}));

const postSignup = router.post('/', (req, res)=>{

  const name = req.body.name;
  const dob = req.body.dob;
  const email = req.body.email;
  const password = req.body.password;
  req.session.email = email;

  const config = dbConfig.config

  async function addUser(){
    try {
      let pool = await sql.connect(config);
      let request = await pool.request()
      request.input('name', sql.VarChar, name)
      request.input('email', sql.VarChar, email)
      request.input('dob', sql.DateTime, dob)

      await bcrypt.hash(password, saltRounds, function(error, hash){
        request.input('password', sql.VarChar, hash)
        request.query(`INSERT INTO Athlete (Name, Dob, Email, Password) VALUES (@name, @dob, @email, @password)`);
      });


    } catch(err) {
      console.log(`there was a problem and nothing works ${err}`)
    }
  }
  addUser();


  console.log(name);
  console.log(email);
  console.log(dob);



  res.write(`<h1>Way to go taking that fitness initiative ${name}! </h1>`)
  res.end()
})

router.get('/home', (req, res) =>{
  res.sendFile('C:/Users/Antoine/healthNut/api/views/home.html')
})



module.exports = {
  router,
  signupForm,
  postSignup
};
