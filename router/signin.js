const express = require('express');
const app = express();
const sql = require('mssql');
const session = require('express-session');

const signinForm = app.get('/signin', (req, res)=>{
  res.sendFile('C:/Users/Antoine/healthNut/views/home.html')
})

const signin = app.post('/signin', (req, res)=>{

  const email = req.body.email
  const password = req.body.password
  async function userLogin(username, password) {
    try{
      let pool = await sql.connect(config);
      let request = await pool.request()
      request.input('email', sql.VarChar, email)
      const storedPassword = await request.query('SELECT password FROM Athlete WHERE email = @email')
      const match = await bcrypt.compare(password, storedPassword)

      if (match){
        res.sendFile('C:/Users/Antoine/healthNut/views/home.html')
      }

    } catch(err) {
      console.log(`there was a problem and nothing works ${err}`)
    }


  }
})

module.exports = signinForm;
