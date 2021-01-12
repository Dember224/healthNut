require('dotenv').config();
const request = require('request');
const express = require('express');
const router = express.Router();


const searchFood = router.post('/mealPrep', (req,res)=>{
  const foodItem = req.body.food ;

  function searchFoodData(){
    request({
      uri:'https://api.nal.usda.gov/fdc/v1/foods/search',
      qs:{
        api_key:process.env.FOOD_DATA_API_KEY,
        query:foodItem
      },
      json: true
    }, function(error, response, body){
      if(error) return error;
      res.write(`<p>*The values displayed below are for a 100g portion size.*</p>
        <p> You will have an opportunity to chose your portion sizes before submitting meal prep.</p>`)
        body["foods"].map((yums)=>{
          const description = yums['description'];
          const nutrientArray =yums['foodNutrients'];
          const protein = nutrientArray.filter(nutrient=>{return nutrient['nutrientName'] === 'Protein'})[0];
          const fat = nutrientArray.filter(nutrient=>{return nutrient['nutrientName'] === 'Total lipid (fat)'})[0];
          const carbs = nutrientArray.filter(nutrient=>{return nutrient['nutrientName'] === 'Carbohydrate, by difference'})[0];
          const calories = nutrientArray.filter(nutrient=>{return nutrient['nutrientName'] === 'Energy'})[0];
          const convertedKCal = calories['unitName'] === 'KCAL' ? calories['value'] : calories['value'] * 0.239006 ;


          res.write(`<h1>${description}</h1>
            <h2>${protein['nutrientName']}: ${protein['value']} ${protein['unitName']}</h2>
            <h2>${fat['nutrientName']}: ${fat['value']} ${fat['unitName']}</h2>
            <h2>${carbs['nutrientName']}: ${carbs['value']} ${carbs['unitName']}</h2>
            <h2>${calories['nutrientName']}: ${convertedKCal} KCAL</h2>
            <button>Add to plate</button>
            `);
            console.log(nutrientArray);
        })

    });
  };
searchFoodData();
});

const enterFood = router.get('/mealPrep', (req,res) =>{
  res.sendFile('C:/Users/Antoine/healthNut/api/views/mealPrep.html')
});

module.exports= {
  router,
  searchFood,
  enterFood
}
