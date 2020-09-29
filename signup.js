const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser')
const sql = require('mssql')
const session = require('express-session')


app.get('/', (req, res)=>{
  res.sendFile('C:/Users/Antoine/healthNut/views/signup.html')
});



app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.use(session({secret:'doodle monkey'}));

app.post('/', (req, res)=>{

  const name = req.body.name;
  const age = req.body.age;
  const email = req.body.email;

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
      request.input('age', sql.Int, age)
      const result = await request.query(`INSERT INTO Athlete (Name, Age, Email) VALUES (@name, @age, @email)`);
      return result
    } catch(err) {
      console.log(`there was a problem and nothing works ${err}`)
    }
  }
  addUser();

  res.sendFile('C:/Users/Antoine/healthNut/views/home.html')

  console.log(name);
  console.log(email);
  console.log(age)

  
  res.write(`<h1>Way to go taking the fitness initiative ${name}! </h1>`)
  res.end()
})

app.listen(port, ()=>{
  console.log(`Connection successful.`)
})
