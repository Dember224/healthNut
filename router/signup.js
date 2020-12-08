const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser')
const sql = require('mssql')
const session = require('express-session')
const bcrypt = require('bcrypt')
const saltRounds = 10


const signupForm = app.get('/', (req, res)=>{
  res.sendFile('C:/Users/Antoine/healthNut/views/signup.html')
});



app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.use(session({secret:'doodle monkey'}));

const postSignup = app.post('/', (req, res)=>{

  const name = req.body.name;
  const dob = req.body.dob;
  const email = req.body.email;
  const password = req.body.password;

  const config = {
    user:'DESKTOP-8ED8NL1/Antoine',
    server:'DESKTOP-8ED8NL1',
    database: 'master',
    password:'u$agold800',
    options:{enableArithAbort: true}

  }
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

app.get('/home', (req, res) =>{
  res.sendFile('C:/Users/Antoine/healthNut/views/home.html')
})


app.listen(port, ()=>{
  console.log(`Connection successful.`)
})

module.exports = {
  signupForm,
  postSignup
}
