const request = require('request');
const cheerio = require('cheerio');

//activity values are 1, 1.2, 1.375, 1.465, 1.55, 1.725, 1.9
//goal values are 1~maintain weight, l~mild weightloss(.5lbs/week),l1~weightloss(1lbs/week),
// l2~extreme weightloss, g~mild weightgain, g1~weightgain, g2~extreme weightgain
function getMacros(age, sex, height_feet,height_inches, weight, activity, goal){
  request({
    uri:'https://www.calculator.net/macro-calculator.html',
    qs:{
      ctype:'standard',
      cage:age,
      csex:sex,
      cheightfeet:height_feet,
      cheightinch:height_inches,
      cpound:weight,
      cheightmeter:'180',
      ckg:'65',
      cactivity:activity,
      cgoal:goal,
      cmop:0,
      cformula:'m',
      cfatpct:20,
      printit:0,
      x:66,
      y:30
    }
  }, function(error,response, body){
    if (error) return error;
      const $ = cheerio.load(body);
      const protein = parseFloat($('input[name=proteinrange]').attr('value'));
      const carbs = parseFloat($('input[name=carbsrange]').attr('value'));
      const fat = parseFloat($('input[name=fatrange]').attr('value'));
      return console.log([protein,carbs,fat]);
  })
};

getMacros(30,'m',5,10,190,1.2,'l1');
// cmop=0&cformula=m&cfatpct=20&printit=0&x=66&y=30
