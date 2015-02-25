exports.process = function (xmlObj) {
  var result = {};
   result['objectives'] = {};

   // Objective: 
result['objectives']['tested'] = false;
// initialize
   result['objectives']['set on blue square'] = false;
   result['objectives']['set block'] = false;
   result['objectives']['reset score'] = false;
   result['objectives']['reset to 0'] = false;

//  candy
  result['objectives']['on candy clicked'] = false;
  result['objectives']['right block candy'] = false;
  result['objectives']['decrease candy'] = false;
  result['objectives']['candy_score'] = false;
  result['objectives']['candy_1'] = false;

  //pizza
 result['objectives']['on pizza clicked'] = false;
  result['objectives']['right block pizza'] = false;
  result['objectives']['decrease pizza'] = false;
  result['objectives']['pizza_score'] = false;
  result['objectives']['pizza_1'] = false;


  //Burger
 result['objectives']['on Burger clicked'] = false;
  result['objectives']['right block Burger'] = false;
  result['objectives']['decrease Burger'] = false;
  result['objectives']['Burger_score'] = false;
  result['objectives']['Burger_1'] = false;

//soda
  result['objectives']['on soda clicked'] = false;
  result['objectives']['right block soda'] = false;
  result['objectives']['decrease soda'] = false;
  result['objectives']['soda_score'] = false;
  result['objectives']['soda_1'] = false;

//Milkshake
result['objectives']['on Milkshake clicked'] = false;
  result['objectives']['right block Milkshake'] = false;
  result['objectives']['decrease Milkshake'] = false;
  result['objectives']['Milkshake_score'] = false;
  result['objectives']['Milkshake_1'] = false;

//CupCake
  result['objectives']['on CupCake clicked'] = false;
  result['objectives']['right block CupCake'] = false;
  result['objectives']['decrease CupCake'] = false;
  result['objectives']['CupCake_score'] = false;
  result['objectives']['CupCake_1'] = false;

//TV
  result['objectives']['on TV clicked'] = false;
  result['objectives']['right block TV'] = false;
  result['objectives']['decrease TV'] = false;
  result['objectives']['TV_score'] = false;
  result['objectives']['TV_2'] = false;

//videogames
  result['objectives']['on videogames clicked'] = false;
  result['objectives']['right block videogames'] = false;
  result['objectives']['decrease videogames'] = false;
  result['objectives']['videogames_score'] = false;
  result['objectives']['videogames_2'] = false;
  
xmlObj.project.stage[0].sprites[0].sprite.forEach(function(u){
   try{
        if(u.$.devName == "play") {
          u.scripts[0].script.forEach(function(v){
            if (v.block[0].$.s == "receiveGo" && v.block[0].$.isInert == "false"){
              result['objectives']['set on blue square'] = true;
              if (v.block[1].$.s == "doSetVar"){
                result['objectives']['set block'] = true;
                if (v.block[1].l[0] == "score") {
                  result['objectives']['reset score'] = true;
                  if (v.block[1].l[1] == "0")
                    result['objectives']['reset to 0'] = true;
                }
              }
            }
           // if (v.block[0].$.s == "otherReceiveClick" && v.block[0].isInert == "false"){
              if (v.block[0].$.s == "otherReceiveClick" && v.block[0].$.isInert == "false" && v.block[0].l[0] == "Candy"){
                result['objectives']['on candy clicked'] = true;
                if (v.block[1].$.s == "incDecVar"){
                  result['objectives']['right block candy'] = true;
                  if (v.block[1].l[0].option[0] == "decrease") result['objectives']['decrease candy'] = true;
                  if (v.block[1].l[1] == "score") result['objectives']['candy_score'] = true;
                  if (v.block[1].l[2] == "1") result['objectives']['candy_1'] = true;
                }
              }
              if (v.block[0].$.s == "otherReceiveClick" && v.block[0].$.isInert == "false" && v.block[0].l[0] == "Pizza"){
                result['objectives']['on pizza clicked'] = true;
                if (v.block[1].$.s == "incDecVar"){
                  result['objectives']['right block pizza'] = true;
                  if (v.block[1].l[0].option[0] == "decrease") result['objectives']['decrease pizza'] = true;
                  if (v.block[1].l[1] == "score") result['objectives']['pizza_score'] = true;
                  if (v.block[1].l[2] == "1") result['objectives']['pizza_1'] = true;
                }
              }
               if (v.block[0].$.s == "otherReceiveClick" && v.block[0].$.isInert == "false" && v.block[0].l[0] == "Burger"){
                result['objectives']['on Burger clicked'] = true;
                if (v.block[1].$.s == "incDecVar"){
                  result['objectives']['right block Burger'] = true;
                  if (v.block[1].l[0].option[0] == "decrease") result['objectives']['decrease Burger'] = true;
                  if (v.block[1].l[1] == "score") result['objectives']['Burger_score'] = true;
                  if (v.block[1].l[2] == "1") result['objectives']['Burger_1'] = true;
                }
              }
              if (v.block[0].$.s == "otherReceiveClick" && v.block[0].l[0] == "Soda"){
                 result['objectives']['on soda clicked'] = true;
                if (v.block[1].$.s == "incDecVar"){
                  result['objectives']['right block soda'] = true;
                  if (v.block[1].l[0].option[0] == "decrease") result['objectives']['decrease soda'] = true;
                  if (v.block[1].l[1] == "score") result['objectives']['soda_score'] = true;
                  if (v.block[1].l[2] == "1") result['objectives']['soda_1'] = true;
                }
              }
                 if (v.block[0].$.s == "otherReceiveClick" && v.block[0].l[0] == "Milkshake"){
                 result['objectives']['on Milkshake clicked'] = true;
                if (v.block[1].$.s == "incDecVar"){
                  result['objectives']['right block Milkshake'] = true;
                  if (v.block[1].l[0].option[0] == "decrease") result['objectives']['decrease Milkshake'] = true;
                  if (v.block[1].l[1] == "score") result['objectives']['Milkshake_score'] = true;
                  if (v.block[1].l[2] == "1") result['objectives']['Milkshake_1'] = true;
                }
              }
              if (v.block[0].$.s == "otherReceiveClick" && v.block[0].l[0] == "CupCake"){
                  result['objectives']['on CupCake clicked'] = true;
                if (v.block[1].$.s == "incDecVar"){
                  result['objectives']['right block CupCake'] = true;
                  if (v.block[1].l[0].option[0] == "decrease") result['objectives']['decrease CupCake'] = true;
                  if (v.block[1].l[1] == "score") result['objectives']['CupCake_score'] = true;
                  if (v.block[1].l[2] == "1") result['objectives']['CupCake_1'] = true;
                }
              }
                
              if (v.block[0].$.s == "otherReceiveClick" &&  v.block[0].l[0] == "TV") {
               result['objectives']['on TV clicked'] = true;
               
                if (v.block[1].$.s == "incDecVar"){
                  result['objectives']['right block TV'] = true;
                  if (v.block[1].l[0].option[0] == "decrease") result['objectives']['decrease TV'] = true;
                  if (v.block[1].l[1] == "score") result['objectives']['TV_score'] = true;
                  if (v.block[1].l[2] == "2") result['objectives']['TV_2'] = true;
                }

              }
            if (v.block[0].$.s == "otherReceiveClick" &&  v.block[0].l[0] == "videogames") {
               result['objectives']['on videogames clicked'] = true;
               
                if (v.block[1].$.s == "incDecVar"){
                  result['objectives']['right block videogames'] = true;
                  if (v.block[1].l[0].option[0] == "decrease") result['objectives']['decrease videogames'] = true;
                  if (v.block[1].l[1] == "score") result['objectives']['videogames_score'] = true;
                  if (v.block[1].l[2] == "2") result['objectives']['videogames_2'] = true;
                }

              }
          });
        }}
    catch(err){}
});

 xmlObj.project.variables[0].variable.forEach(function(v){
  if(v.$.name == "completed") {
            if(v.l == "1"){
              result['objectives']['tested']= true;
            }}
 });

   // If all objectives are completed, result.completed = true
   var completed = true;
   for (var property in result['objectives']) {
       if (result['objectives'][property] != true) {
           completed = false;
       }
   }

   result['completed'] = completed;

  // initialize variable score
   if (result['objectives']['set on blue square'] == false)
    result.html = "It looks like you didn't use the correct event to initialize the score! You want score to set to 0 when the blue square is clicked...Keep trying!";
  else if (result['objectives']['set block'] == false)
    result.html = "To initialize the score, you must use a different block from the variables category. Check the inert script to see which block to use and then copy it! Keep trying!";
  else if (result['objectives']['reset score'] == false)
    result.html = " Be sure to initialize the variable named 'score'. You're using the right block, just the wrong variable! Check the inert script and keep trying! ";
  else if (result['objectives']['reset to 0'] == false)
    result.html = "You're almost done initializing the variable! Be sure to set the variable score to 0 when the blue square is clicked, just like in the inert script! Keep trying!";
  else if (result['objectives']['on pizza clicked'] == false ||result['objectives']['on Burger clicked'] == false || result['objectives']['on candy clicked'] == false || result['objectives']['on soda clicked'] == false ||result['objectives']['on Milkshake clicked'] == false || result['objectives']['on CupCake clicked'] == false|| result['objectives']['on TV clicked'] == false || result['objectives']['on TV clicked'] == false)
    result.html = "Be sure that you are changing the score for the eight unhealthy options when they are clicked. Either the correct event is not being used or you did not pick the healthiest option! Keep trying!";
  else if (result['objectives']['right block pizza'] == false || result['objectives']['right block Burger'] == false ||result['objectives']['right block candy'] == false || result['objectives']['right block soda'] == false ||result['objectives']['right block Milkshake'] == false || result['objectives']['right block CupCake'] == false || result['objectives']['right block TV'] == false)
    result.html = "Uh oh! It looks like you are not using the right block to change the score! Check the inert script to see which block we are expecting, then check that it work! Keep trying!";
  else if (result['objectives']['decrease candy'] == false ||result['objectives']['decrease pizza'] == false || result['objectives']['decrease Burger'] == false || result['objectives']['decrease Milkshake'] == false || result['objectives']['decrease soda'] == false ||  result['objectives']['decrease CupCake'] == false ||   result['objectives']['decrease videogames'] == false|| result['objectives']['decrease TV'] == false)
    result.html = "For all the healthiest options, be sure you are increasing the value of the variable 'score' and not decreasing it! Keep trying, you're so close!";
  else if (result['objectives']['candy_score'] == false ||result['objectives']['Burger_score'] == false || result['objectives']['pizza_score'] == false ||result['objectives']['soda_score'] == false ||result['objectives']['Milkshake_score'] == false || result['objectives']['CupCake_score'] == false || result['objectives']['videogames_score'] == false || result['objectives']['TV_score'] == false)
    result.html = "Be sure that you are changing the variable 'score' every time you click on the healthiest option! You're so close, keep trying!";
  else if (result['objectives']['candy_1'] == false ||result['objectives']['Burger_1'] == false ||result['objectives']['pizza_1'] == false || result['objectives']['soda_1'] == false ||result['objectives']['Milkshake_1'] == false || result['objectives']['CupCake_1'] == false || result['objectives']['videogames_2'] == false || result['objectives']['TV_2'] == false)
    result.html = "All of the healthiest foods should only decrease the score by 1, and the physical activity should decrease the score by 2! You're so close, keep trying!"
  else if (result['objectives']['tested'] == false)
    result.html = "It looks like you haven't actually played and won the game yet! Test your game first and then click on the green check mark!";
  else if (completed == true) result.html = "Congratulations! You have completed this task!";
   return result;
};
