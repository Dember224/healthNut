require('dotenv').config();
const request = require('request');
const express = require('express');
const router = express.Router();



const enterFood = router.get('/mealPrep', (req,res) =>{
  res.sendFile('C:/Users/Antoine/healthNut/api/views/mealPrep.html')
});

module.exports= {
  router,
  enterFood
}
