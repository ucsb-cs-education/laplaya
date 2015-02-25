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

// water
  result['objectives']['on water clicked'] = false;
  result['objectives']['right block water'] = false;
  result['objectives']['increase water'] = false;
  result['objectives']['water_score'] = false;
  result['objectives']['water_1'] = false;

//bananas
  result['objectives']['on bananas clicked'] = false;
  result['objectives']['right block bananas'] = false;
  result['objectives']['increase bananas'] = false;
  result['objectives']['bananas_score'] = false;
  result['objectives']['bananas_1'] = false;

//carrots
  result['objectives']['on carrots clicked'] = false;
  result['objectives']['right block carrots'] = false;
  result['objectives']['increase carrots'] = false;
  result['objectives']['carrots_score'] = false;
  result['objectives']['carrots_1'] = false;

//soccer
  result['objectives']['on soccer clicked'] = false;
  result['objectives']['right block soccer'] = false;
  result['objectives']['increase soccer'] = false;
  result['objectives']['soccer_score'] = false;
  result['objectives']['soccer_2'] = false;
  
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
              if (v.block[0].$.s == "otherReceiveClick" && v.block[0].$.isInert == "false" && v.block[0].l[0] == "Water"){
                result['objectives']['on water clicked'] = true;
                if (v.block[1].$.s == "incDecVar"){
                  result['objectives']['right block water'] = true;
                  if (v.block[1].l[0].option[0] == "increase") result['objectives']['increase water'] = true;
                  if (v.block[1].l[1] == "score") result['objectives']['water_score'] = true;
                  if (v.block[1].l[2] == "1") result['objectives']['water_1'] = true;
                }
              }
              if (v.block[0].$.s == "otherReceiveClick" && v.block[0].l[0] == "Bananas"){
                 result['objectives']['on bananas clicked'] = true;
                if (v.block[1].$.s == "incDecVar"){
                  result['objectives']['right block bananas'] = true;
                  if (v.block[1].l[0].option[0] == "increase") result['objectives']['increase bananas'] = true;
                  if (v.block[1].l[1] == "score") result['objectives']['bananas_score'] = true;
                  if (v.block[1].l[2] == "1") result['objectives']['bananas_1'] = true;
                }
              }
                
              if (v.block[0].$.s == "otherReceiveClick" && v.block[0].l[0] == "Carrots"){
                  result['objectives']['on carrots clicked'] = true;
                if (v.block[1].$.s == "incDecVar"){
                  result['objectives']['right block carrots'] = true;
                  if (v.block[1].l[0].option[0] == "increase") result['objectives']['increase carrots'] = true;
                  if (v.block[1].l[1] == "score") result['objectives']['carrots_score'] = true;
                  if (v.block[1].l[2] == "1") result['objectives']['carrots_1'] = true;
                }
              }
                
              if (v.block[0].$.s == "otherReceiveClick" &&  v.block[0].l[0] == "Soccer") {
               result['objectives']['on soccer clicked'] = true;
               
                if (v.block[1].$.s == "incDecVar"){
                  result['objectives']['right block soccer'] = true;
                  if (v.block[1].l[0].option[0] == "increase") result['objectives']['increase soccer'] = true;
                  if (v.block[1].l[1] == "score") result['objectives']['soccer_score'] = true;
                  if (v.block[1].l[2] == "2") result['objectives']['soccer_2'] = true;
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
  else if (result['objectives']['on water clicked'] == false || result['objectives']['on bananas clicked'] == false || result['objectives']['on carrots clicked'] == false|| result['objectives']['on soccer clicked'] == false)
    result.html = "Be sure that you are changing the score for the four healthiest options when they are clicked. Either the correct event is not being used or you did not pick the healthiest option! Keep trying!";
  else if ( result['objectives']['right block water'] == false || result['objectives']['right block bananas'] == false || result['objectives']['right block carrots'] == false || result['objectives']['right block soccer'] == false)
    result.html = "Uh oh! It looks like you are not using the right block to change th score! Check the inert script to see which block we are expecting, then check that it work! Keep trying!";
  else if (result['objectives']['increase water'] == false || result['objectives']['increase bananas'] == false ||   result['objectives']['increase carrots'] == false ||   result['objectives']['increase soccer'] == false)
    result.html = "For all the healthiest options, be sure you are increasing the value of the variable 'score' and not decreasing it! Keep trying, you're so close!";
  else if (result['objectives']['water_score'] == false || result['objectives']['bananas_score'] == false || result['objectives']['carrots_score'] == false || result['objectives']['soccer_score'] == false)
    result.html = "Be sure that you are changing the variable 'score' every time you click on the healthiest option! You're so close, keep trying!";
  else if (result['objectives']['water_1'] == false || result['objectives']['bananas_1'] == false || result['objectives']['carrots_1'] == false || result['objectives']['soccer_2'] == false)
    result.html = "All of the healthiest foods should only increase the score by 1, and the physical activity should increase the score by 2! You're so close, keep trying!"
  else if (result['objectives']['tested'] == false)
    result.html = "It looks like you haven't actually played and won the game yet! Test your game first and then click on the green check mark!";
  else if (completed == true) result.html = "Congratulations! You have completed this task!";
   return result;
};
