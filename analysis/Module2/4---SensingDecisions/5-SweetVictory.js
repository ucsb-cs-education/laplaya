exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    
    result['objectives']['green flag'] = false;
    result['objectives']['forever loop'] = false;
    result['objectives']['if statement'] = false;
    result['objectives']['treasure'] = false;
    
    result['objectives']['if wall'] = false;
    result['objectives']['broadcast'] = false;
    result['objectives']['Hit Wall'] = false;
    result['objectives']['back to start'] = false;
    result['objectives']['say'] = false;

    var numIfs = 0;
    result.html = "";

try{
xmlObj.project.stage[0].sprites[0].sprite.forEach(function(u){
        if(u.$.devName == "Explorer") {
             u.scripts[0].script.forEach(function(v){
            if (v.block[0].$.s == "getReady" && v.block[0].$.isInert == "false"){
               result['objectives']['green flag'] = true;
               if (v.block[1] != null && v.block[1].$.s == "doForever"){
                result['objectives']['forever loop'] = true;
                v.block[1].script[0].block.forEach(function(m){
                  if (m.$.s == "doIf" && m.block[0].$.s == "reportTouchingObject" && m.block[0].l[0] == "walls")
                  {
                    result['objectives']['if wall'] = true;
                    m.script[0].block.forEach(function(w){
                      if (w.$.s == "doBroadcast"){
                        result['objectives']['broadcast'] = true;
                        if (w.l[0] = "Hit Wall")
                          result['objectives']['Hit Wall'] = true;
                      }
                      if (w.$.s == "doGotoObject" && w.l[0] == "Start")
                        result['objectives']['back to start'] = true;
                      if (w.$.s == "doSayFor")
                        result['objectives']['say'] = true;
                    });
                  }
                   if (m.$.s == "doIf" && m.block[0].$.s == "reportTouchingObject" && m.block[0].l[0] == "treasure")
                   result['objectives']['if statement'] = true;
                 m.script[0].block.forEach(function(w){
                   if (w.$.s == "doSayFor")
                        result['objectives']['treasure'] = true;
                 });
                });
}}
              });
             
            } 
           });
}
catch(err){}
        
    // If all objectives are completed, result.completed = true
    var completed = true;
    for (var property in result['objectives']) {
        if (result['objectives'][property] != true) {
            completed = false;
        }
    }
    result['completed'] = completed;



    if (result['objectives']['green flag'] ==false)
      result.html = "Be sure that you use the correct Event type! You want to start checking after the Green Flag is clicked! Keep trying";
    else if (result['objectives']['forever loop'] == false)
      result.html = "You need to use a forever loop to continuously check if the explorer is touching the treasure! Look at the inert script and keep trying!";
    else if (result['objectives']['if statement'] == false)
      result.html = "Inside the forever loop, you need an 'if' statement to be able to have the explorer sense if she is touching the treasure. Keep trying!";
    else if (result['objectives']['treasure'] == false)
      result.html = "Great work so far! Now that you have an if statement to sense when the explorer is touching the treasure, have the explorer say something to show that the user won the game! Keep trying!";
   else if (!result['objectives']['if wall'])
      result.html = "You finished the part with the treasure, great job! Now, use sensing to see if the explorer is hitting the wall, like we did in the last activity. Then broadcast the 'Hit Wall' message, set the explorer back to start and say something. You're so close, keep trying!";
    else if (result['objectives']['broadcast'] == false)
      result.html  = "You need to broadcast the 'Hit Wall' message after you hit the wall in order to change the background! Add that to your script and check again!";
    else if (result['objectives']['Hit Wall'] == false)
      result.html = "You're so close! You just broadcasted the wrong message when the explorer hit the wall. We want to broadcast 'Hit Wall'. Keep trying!";
    else if (!result['objectives']['back to start'])
      result.html = "Be sure to place the explorer back to the start inside the if statement by using the 'Place at' block and finding 'Start' on the dropdown list, like in the last activity. Keep trying!";
    else if (!result['objectives']['say'])
      result.html = "Be sure to make the explorer say something when he hits the wall so that the user knows it happened, like in the last activity! Keep trying!";
    else if (completed == true) result.html = "Congratulations! You have completed this task!";
    return result;

  };

