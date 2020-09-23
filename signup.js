const express = require('express');
const app = express()
const port = 3000
const mysql = require('mysql')

app.get('/', (req, res)=>{
  res.sendFile('C:/Users/Antoine/healthNut/views/signup.html')
})

app.listen(port, ()=>{
  console.log(`Connection successful.`)
})
