import React, {useState, useEffect} from 'react';
import SearchFoodData from './searchFoodData.js';
import axios from 'axios';


const request = require('request');
require('dotenv').config();


function AutoFoodLookup() {

  const callAPI = ()=>{
      const thisIsBS = axios.get('http://localhost:9000/mealPrep')
      console.log(thisIsBS);
      return thisIsBS
    }

  useEffect(()=>{
    callAPI();
  });

  const [food, setFood] = useState('corn');


  const handleChange = (e) =>{
    const newFood = e.target.value;
    setFood(newFood);
    if(description.length > 1) {
      setDescription([]);
      setProtein([]);
      setProteinUnit([]);
      setFat([]);
      setFatUnit([]);
      setCarbs([]);
      setCarbUnit([]);
      setCalories([]);
    }
  };

  const [description, setDescription] = useState(['Corny goodness']);
  const [protein, setProtein] = useState(['2']);
  const [proteinUnit, setProteinUnit] = useState(['G']);
  const [fat, setFat] = useState(['4']);
  const [fatUnit, setFatUnit] = useState(['G']);
  const [carbs, setCarbs] = useState(['3']);
  const [carbUnit, setCarbUnit] = useState(['G']);
  const [calories, setCalories] = useState(['1']);

 function getFood(e){
   request({
     uri:'https://api.nal.usda.gov/fdc/v1/foods/search',
     qs:{
       api_key:process.env.REACT_APP_FOOD_DATA_API_KEY,
       query: e.target.value
     },
     json:true
   }, function(error, response, body){
     if(error) return error;

     if(body["foods"] !== undefined){
       body["foods"].map((yums, index)=>{
         if(typeof yums['description'] !== 'undefined' && typeof yums['foodNutrients'] !== 'undefined' && typeof yums['foodNutrients'].filter(nutrient=>{return nutrient['nutrientName'] === 'Energy'})[0] !== 'undefined' ){
           const foodDescription = yums['description'];
           const nutrientArray =yums['foodNutrients'];
           const foodProtein = nutrientArray.filter(nutrient=>{return nutrient['nutrientName'] === 'Protein'})[0];
           const foodFat = nutrientArray.filter(nutrient=>{return nutrient['nutrientName'] === 'Total lipid (fat)'})[0];
           const foodCarbs = nutrientArray.filter(nutrient=>{return nutrient['nutrientName'] === 'Carbohydrate, by difference'})[0];
           console.log(`the food calories type is: ${typeof nutrientArray.filter(nutrient=>{return nutrient['nutrientName'] === 'Energy'})[0]}`)
           const foodCalories = nutrientArray.filter(nutrient=>{return nutrient['nutrientName'] === 'Energy'})[0];
           const convertedKCal = foodCalories['unitName'] === 'kcal' ? foodCalories['value'] : foodCalories['value'] * 0.239006 ;


           if(description !== undefined) {
             setDescription(description => [...description, foodDescription]); //dont use push. it returns length of new array rather than array
           }
           if(foodProtein !== undefined){
             setProtein(protein => [...protein, foodProtein['value']]);
           }
           if(foodProtein !== undefined){
             setProteinUnit(proteinUnit => [...proteinUnit,foodProtein['unitName']]);
           }
           if(foodFat !== undefined){
             setFat(fat => [...fat, foodFat['value']]);
           }
           if(foodFat !== undefined ){
             setFatUnit(fatUnit => [...fatUnit, foodFat['unitName']]);
           }
           if(foodCarbs !== undefined ){
             setCarbs( carbs => [...carbs, foodCarbs['value']]);
           }
           if(foodCarbs !== undefined){
             setCarbUnit(carbUnit => [...carbUnit, foodCarbs['unitName']]);
           }
           if(convertedKCal !== undefined){
             setCalories(calories => [...calories, convertedKCal]);
           }
             return {foodDescription,nutrientArray,foodProtein,foodFat,foodCarbs,foodCalories, convertedKCal};
          }
     })
 };

   });
};

function allTheThings(e){
  handleChange(e);
  getFood(e);
}

  return(
    <div>
      <input className="searchText" value={food} type='text' onChange={handleChange}  />
      <input className="submitButton" type='submit' value={food}  onClick={allTheThings}/>
      <SearchFoodData food={food} description={description} protein={protein} proteinUnit={proteinUnit} fat={fat} fatUnit={fatUnit} carbs={carbs} carbUnit={carbUnit} calories={calories}/>
    </div>
  )
}

export default AutoFoodLookup;
