const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sql = require('mssql');
const dbConfig = require('C:/Users/Antoine/healthNut/DBConfig.js');
const session = require('express-session');
const request = require('request');
const cheerio = require('cheerio');

const MacroObject={
  protein:{},
  carbs:{},
  fat:{},
  age:{},
  sex:{},
  height_feet:{},
  height_inches:{},
  weight:{},
  activity:{},
  goal:{},
  id:{},

//activity values are 1, 1.2, 1.375, 1.465, 1.55, 1.725, 1.9
//goal values are 1~maintain weight, l~mild weightloss(.5lbs/week),l1~weightloss(1lbs/week),
// l2~extreme weightloss, g~mild weightgain, g1~weightgain, g2~extreme weightgain

};


app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.use(session({secret:'doodle monkey'}));

const setGoalsForm = app.get('/setGoals', (req, res)=>{
  res.sendFile('C:/Users/Antoine/healthNut/views/setGoals.html');
});

const setGoals = app.post('/setGoals', (req, res)=>{
  const config = dbConfig.config;

  const bodyData ={
    sex: req.body.sex,
    height_feet: req.body.height_feet,
    height_inches: req.body.height_inches,
    weight: req.body.weight,
    activity: req.body.activity,
    goal: req.body.goal,
    age:{},
    id:{}
  }; //Object is redundant. I had MacroObject in another module earlier. Now I don't feel like refactoring. I'll get rid of one of these objects later.


  async function getAge(){
    try{
      let pool = await sql.connect(config);
      let request = await pool.request();
      const email = await req.session.email;
      request.input('email', sql.VarChar, email);

      const birthdayCall = await request.query('SELECT Dob, ID from Athlete where convert(VARCHAR,email) = CONVERT(VARCHAR,@email)')
      const birthday = birthdayCall.recordset[0]['Dob'];
      const id = birthdayCall.recordset[0]['ID'];
      const today = await Date.now();
      const ageMili = today - birthday;
      const age = Math.floor(ageMili/31536000000);
      const infoObject = await {age,id};
      console.log(infoObject);
      MacroObject.sex = bodyData.sex;
      MacroObject.height_feet = bodyData.height_feet;
      MacroObject.height_inches = bodyData.height_inches;
      MacroObject.weight = bodyData.weight;
      MacroObject.activity = bodyData.activity;
      MacroObject.goal =  bodyData.goal;

      bodyData.age = infoObject.age;
      bodyData.id = infoObject.id

    } catch(err) {
      console.log(`You evil evil idiot. You've broken the program ${err}`);
    }
  }


  async function postMacros() {
      try{
        await getAge();

      function getMacros (){ //need to edit this to insert correct params
          request({
            uri:'https://www.calculator.net/macro-calculator.html',
            qs:{
              ctype:'standard',
              cage:bodyData.age,
              csex:MacroObject.sex,
              cheightfeet:MacroObject.height_feet,
              cheightinch:MacroObject.height_inches,
              cpound:MacroObject.weight,
              cheightmeter:'180',
              ckg:'65',
              cactivity:MacroObject.activity,
              cgoal:MacroObject.goal,
              cmop:0,
              cformula:'m',
              cfatpct:20,
              printit:0,
              x:66,
              y:30
            }
          }, async function(error,response, body){
            if (error) return error;
              const $ = cheerio.load(body);
              const protein = parseFloat($('input[name=proteinrange]').attr('value'));
              const carbs = parseFloat($('input[name=carbsrange]').attr('value'));
              const fat = parseFloat($('input[name=fatrange]').attr('value'));

              let pool = await sql.connect(config);
              let request =  await pool.request();
              request.input('protein', sql.Decimal, protein);
              request.input('carbs', sql.Decimal, carbs);
              request.input('fat', sql.Decimal, fat);
              const calories = (4*protein)+(4*carbs)+(9*fat);
              request.input('calories', sql.Decimal, calories);
              const email = req.session.email;
              request.input('email', sql.VarChar, email);
              const athleteId = bodyData.id
              request.input('Athlete_ID', sql.Int,athleteId);
              await request.query('INSERT INTO MacroGoals (protein, carbs, fat, calories, DayOfGoal,Athlete_ID) VALUES (@protein, @carbs, @fat, @calories,GETDATE(), @Athlete_ID)');
              const macros =  {protein,carbs,fat, athleteId, age: MacroObject.age};
              await res.write(`
                <h1>Based on your current data and goals we recommend the following Macronutrient targets:</h1>
                <h2>Carbohydrates: ${carbs} grams</h2>
                <h2>Protein: ${protein} grams</h2>
                <h2>Fat: ${fat} grams</h2>
                <h2>This should be approximately ${calories} calories.</h2>`)
          })
        };

        await getMacros()

      } catch(err){
        console.log(`I sense a disturbance in the force ${err}`)
      }
  }

  async function postStats(macros) {
    try{
      await postMacros()
      console.log(macros)
      let pool = await sql.connect(config);
      let request = await pool.request();
      request.input('Athlete_ID', sql.Int, bodyData.id);
      request.input('Age', sql.Int, bodyData.age);
      request.input('heightfeet', sql.Int, bodyData.height_feet);
      request.input('heightinches', sql.Int, bodyData.height_inches);
      request.input('pounds', sql.Int, bodyData.weight);
      request.input('sex', sql.VarChar,bodyData.sex);
      request.input('activity', sql.VarChar, bodyData.activity);
      request.input('goal', sql.VarChar, bodyData.goal);
      await request.query('INSERT INTO BodyStats (Athlete_ID, Age, heightfeet, heightinches, pounds, sex,dayOfStats, activity, goal) VALUES(@Athlete_ID, @age, @heightfeet, @heightinches, @pounds, @sex,GETDATE(), @activity, @goal)')
    } catch(err){
      console.log(`It's a trap! ${err}`)
    }
  };

  function failure(sadness){
    console.log('You have brought shame on your family. Dishonor! Dishoner to you all!')
  }

  postStats();

  
})


module.exports = {
  setGoals,
  setGoalsForm
}
