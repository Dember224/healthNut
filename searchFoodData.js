require('dotenv').config();
const request = require('request');
import React, {useState, useEffect} from 'react';

export default function SearchFoodData(props){
  request({
    uri:'https://api.nal.usda.gov/fdc/v1/foods/search',
    qs:{
      api_key:process.env.FOOD_DATA_API_KEY,
      query: props.food
    },
    json:true
  }, function(error, response, body){
    if(error) return error;

    body["foods"].map((yums, index)=>{
      const description = yums['description'];
      const nutrientArray =yums['foodNutrients'];
      const protein = nutrientArray.filter(nutrient=>{return nutrient['nutrientName'] === 'Protein'})[0];
      const fat = nutrientArray.filter(nutrient=>{return nutrient['nutrientName'] === 'Total lipid (fat)'})[0];
      const carbs = nutrientArray.filter(nutrient=>{return nutrient['nutrientName'] === 'Carbohydrate, by difference'})[0];
      const calories = nutrientArray.filter(nutrient=>{return nutrient['nutrientName'] === 'Energy'})[0];
      const convertedKCal = calories['unitName'] === 'KCAL' ? calories['value'] : calories['value'] * 0.239006 ;

      return(
      <div>
        <h1>{description}</h1>
        <h2>{protein['nutrientName']}: {protein['value']} {protein['unitName']} </h2>
        <h2>{fat['nutrientName']}: {fat['value']} {fat['unitName']}</h2>
        <h2>{carbs['nutrientName']}: {carbs['value']} {carbs['unitName']}</h2>
        <h2>{calories['nutrientName']}: {convertedKCal} KCAL</h2>
        <button>Add to plate</button>
      </div>
    )
    })

  })
}
