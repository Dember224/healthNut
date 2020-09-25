const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser')
const sql = require('mssql')


app.get('/', (req, res)=>{
  res.sendFile('C:/Users/Antoine/healthNut/views/signup.html')
});



app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

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
      await sql.connect(config);
      const result = await sql.query(`INSERT INTO Athlete ( Name, Age, Email ) VALUES( ${name}, ${email}, ${age} )`);//I'm aware of the bad practice here. Vulnerability to injection attach. This is designed for a local server and db not exposed to the public for injection attack.Practicing JS w/ sql
      console.log(result)
    } catch(err) {
      console.log(`there was a problem and nothing works ${err}`)
    }
  }
  addUser();

  res.sendFile('C:/Users/Antoine/healthNut/views/home.html')

  console.log(name);
  console.log(email);
  console.log(age)
})

app.listen(port, ()=>{
  console.log(`Connection successful.`)
})
