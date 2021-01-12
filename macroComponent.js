import React, {useState} from 'react';
import { DaButton } from './daButton.js'

export function macroForm () {

  const [foodName, setFoodName] = useState([]);
  const [protein, setProtein] = useState([]);
  const [fat, setFat] = useState([]);
  const [carbs, setCarbs] = useState([]);
  const [calories, setCalories] = useState([]);

  const handleFoodNameClick ({target}) {
    setFoodName((prevFood) => prevFood.push(target.proteinValue))
  }

  const handleProteinClick ({target}) {
    setProtein((prevProtein) => prevProtein.push(target.proteinValue))//push the stuff into the previous list of protein values
  };

  const handleFatClick({target}) {
    setFat((prevFat) => prevFat.push(target.prevFat))
  };

  const handleCarbsClick({target}) {
    setCarbs((prevCarbs) => prevCarbs.push(target.prevCarbs))
  };

  const handleCaloriesClick({target}) {
    setCalories((prevCalories) => prevCalories.push(target.prevCalories))
  };

  <DaButton clickFunctions={handleProteinClick};{handleFatClick};{handleCarbsClick};{handleCaloriesClick};{handleFoodNameClick} />


  return (

  )

};
