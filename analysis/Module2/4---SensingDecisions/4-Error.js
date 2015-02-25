exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    
    result['objectives']['green flag'] = false;
    result['objectives']['forever loop'] = false;
    result['objectives']['if statement'] = false;
    result['objectives']['touching'] = false;
    result['objectives']['walls'] = false;
    //broadcast message from explorer
    result['objectives']['broadcast'] = false;
    result['objectives']['Hit Wall'] = false;

    result['objectives']['back to start'] =false;
     result['objectives']['say'] = false;

  //toggle background when wall is hit
     result['objectives']['receiveMessage'] = false;
     result['objectives']['rcv Hit Wall'] = false;
     result['objectives']['repeat']= false;
     result['objectives']['numRepeat'] = false;

     var numWaits = 0;
     var costumeChanges = 0;
     var firstCostumeRed = false;

     result['objectives']['wait'] = false;
     result['objectives']['numCostumes'] = false;
     result['objectives']['costume order'] = false;

    result.html = "";

try{
xmlObj.project.stage[0].scripts[0].script.forEach(function(y){
  if (y.block[0].$.s == "receiveMessage" && y.block[0].$.isInert == "false"){
    result['objectives']['receiveMessage'] = true;
    if (y.block[0].l[0] == "Hit Wall"){
      result['objectives']['rcv Hit Wall'] = true;
      if (y.block[1] != null && y.block[1].$.s == "doRepeat"){
        result['objectives']['repeat'] = true;
        var numRepeat = parseInt(y.block[1].l[0]);
        if (numRepeat > 1) result['objectives']['numRepeat'] = true;
        y.block[1].script[0].block.forEach(function(w){
          if (w.$.s == "doWait"){
            numWaits+=1;
          }
          if (w.$.s == "doSwitchToBackground"){
            costumeChanges +=1;
            if (costumeChanges == 1 && w.l[0] == "red maze") firstCostumeRed = true;
            if (costumeChanges == 2 && w.l[0] == "maze" && firstCostumeRed == true) result['objectives']['costume order'] = true;
          }
        });
      }
    }
}
});
}
  catch(err){} 
if (numWaits == 2) result['objectives']['wait'] = true;
if (costumeChanges == 2) result['objectives']['numCostumes'] = true;

try{
xmlObj.project.stage[0].sprites[0].sprite.forEach(function(u){
   
        if(u.$.devName == "Explorer") {
             u.scripts[0].script.forEach(function(v){
            if (v.block[0].$.s == "getReady" && v.block[0].$.isInert == "false"){
               result['objectives']['green flag'] = true;
               if (v.block[1] != null && v.block[1].$.s == "doForever"){
                result['objectives']['forever loop'] = true;
                if (v.block[1].script[0] != null && v.block[1].script[0].block[0].$.s == "doIf"){
                  result['objectives']['if statement'] = true;
                  if (v.block[1].script[0].block[0].block[0].$.s == "reportTouchingObject"){
                    result['objectives']['touching'] = true;
                    if (v.block[1].script[0].block[0].block[0].l[0] == "walls")
                      result['objectives']['walls']= true;
                    v.block[1].script[0].block[0].script[0].block.forEach(function(w){
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
               }
              } 
             
            }});}});
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
      result.html = "You need to use a forever loop to continuously check if the explorer is hitting the wall! Look at the inert script and keep trying!";
    else if (result['objectives']['if statement'] == false)
      result.html = "After the forever loop, you need an 'if' statement to be able to have the explorer sense if she is touching the wall. Keep trying!";
    else if (result['objectives']['touching'] == false)
      result.html = "You need to check for sensing in the if statement. Check if the explorer is touching the walls inside the forever loop. Use the inert script as an example!";
    else if (result['objectives']['walls'] == false)
      result.html = "You are so close! Make sure that the if statement is checking if the explorer is touching the wall and not another object! Keep trying!";
    else if (result['objectives']['broadcast'] == false)
      result.html  = "You need to broadcast the 'Hit Wall' message after you hit the wall in order to change the background! Add that to your script and check again!";
    else if (result['objectives']['Hit Wall'] == false)
      result.html = "You're so close! You just broadcasted the wrong message when the explorer hit the wall. We want to broadcast 'Hit Wall'. Keep trying!";
    else if (!result['objectives']['back to start'])
      result.html = "Be sure to place the explorer back to the start inside the if statement by using the 'Place at' block and finding 'Start' on the dropdown list, like in the last activity. Keep trying!";
    else if (!result['objectives']['say'])
      result.html = "Be sure to make the explorer say something when he hits the wall so that the user knows it happened, like in the last activity! Keep trying!";
    // background change!
    else if (result['objectives']['receiveMessage'] == false)
      result.html = "You broadcasted the message in the explorer! Good work, now make sure you only change the background after you receive that message! You have to click on the Stage and use the event block that allows you to wait for a message. Keep trying!";
    else if (result['objectives']['rcv Hit Wall'] == false)
      result.html = "The event you use in the stage is correct, but the message you are waiting to receive to change the background is wrong! Make sure you're waiting to receive 'Hit Wall' in order to change the background! Keep trying!";
    else if (result['objectives']['repeat']== false)
      result.html = "You need to use the 'repeat' loop like it does in the inert script in the stage! Be sure to repeat at least 2 times!";
    else if (result['objectives']['numRepeat'] == false)
      result.html = "You're so close! You're using the correct repeat loop, but we want you to repeat it more times! Change the number and check your work again!";
    else if (result['objectives']['numCostumes'] == false)
      result.html = "You're so close! Be sure to switch the background TWO times, first to the red maze then the normal maze. Keep trying!";
    else if (result['objectives']['wait'] == false)
      result.html = "Remember that if you don't use 'wait' statements, you won't be able to see the background change! Check those and try again!";
    else if (result['objectives']['costume order'] == false )
      result.html = "Almost done! One last thing: the second costume needs to be the maze because we don't want to have a red background for the whole game! Be sure the first costume is red and the second is normal and check your work again!";
    else if (completed == true) result.html = "Congratulations! You have completed this task!";
    return result;

  };

