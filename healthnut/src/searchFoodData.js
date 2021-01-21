import React from 'react';



 function SearchFoodData(props){

  const result = props.description.map((x, index) =>
  <div className="description" key={index}>
    <h1 >{x}</h1>
    <h2 >protein: {props.protein[index]} {props.proteinUnit[index]}</h2>
    <h2 >fat: {props.fat[index]} {props.fatUnit[index]}</h2>
    <h2 >carbs: {props.carbs[index]} {props.carbUnit[index]}</h2>
    <h2 >calories: {props.calories[index]} KCal</h2>
  </div>
)

return <div>{result}</div>

};

export default SearchFoodData;
