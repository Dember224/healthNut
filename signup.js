const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser')


app.get('/', (req, res)=>{
  res.sendFile('C:/Users/Antoine/healthNut/views/signup.html')
});



app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.post('/', (req, res)=>{
  res.send('C:/Users/Antoine/healthNut/views/home.html')
  const name = req.body.name;
  const age = req.body.age;
  const email = req.body.email;
  console.log(name);
  console.log(email);
  console.log(age)
})

app.listen(port, ()=>{
  console.log(`Connection successful.`)
})
