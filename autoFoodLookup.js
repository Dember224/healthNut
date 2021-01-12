import React, {useState, useEffect} from 'react';
import ReactDOM from "react-dom";
import defaultExport './searchFoodData.js';
const express = require('express');
const app = express();
const port = 3002;

function AutoFoodLookup() {
  const [food, setFood] = useState('corn');

  const handleChange = (event) =>{
    const newFood = event.target.value;
    setFood(newFood);
  };

  return(
    <div>
      <input value={food} type='text' onChange={handleChange}/>
      <SearchFoodData food={food}/>
    </div>
  )
}



app.get('/home', (req,res) =>{
  res.sendFile('C:/Users/Antoine/healthNut/views/home.html')
  ReactDOM.render(<AutoFoodLookup />, document.getElementById('App'));
}
)
