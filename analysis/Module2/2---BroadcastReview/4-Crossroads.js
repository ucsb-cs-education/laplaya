exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};


    var carMsg = new String();
    // Only one objective for Animal Maze (get all the honey pots)
    
    result['objectives']['on light click']  = false;
    result['objectives']['broadcast light'] = false;
    result['objectives']['snd CarGo'] = false;

    result['objectives']['rcv blue msg']  = false;
    result['objectives']['rcv blueCarGo'] = false;
    result['objectives']['B glide up'] = false;
    result['objectives']['B numSteps'] = false;
    result['objectives']['turn left'] = false;
    result['objectives']['target blue'] = false;

    result['objectives']['rcv yellow msg']  = false;
    result['objectives']['rcv yellowCarGo'] = false;
    result['objectives']['Y glide up'] = false;
    result['objectives']['Y numSteps'] = false;
    result['objectives']['turn right'] = false;
    result['objectives']['target yellow'] = false;

    var leftNumSteps = true;
    var rightNumSteps = true;

    result.html = "";

xmlObj.project.stage[0].sprites[0].sprite.forEach(function(u){
   
        if(u.$.devName == "Stoplight")
        {
             u.scripts[0].script.forEach(function(v){
            if (v.block[0].$.s == "receiveClick")
            {
               result['objectives']['on light click']  = true;
               if (v.block[1]!= null){
               v.block.forEach(function(w){
                if (w.$.s == "doBroadcast")
                {
                  result['objectives']['broadcast light'] = true;
                  carMsg = w.l[0];
                  if (carMsg != "")
                    result['objectives']['snd CarGo'] = true;
                }
              });
               }}
             });
           }
         });
          
xmlObj.project.stage[0].sprites[0].sprite.forEach(function(u){
        if (u.$.devName == "Car Blue")
        {
          u.scripts[0].script.forEach(function(v){
            if (v.block[0].$.s == "receiveMessage"){
               result['objectives']['rcv blue msg']  = true;
                if (v.block[0].l[0] == carMsg)
                  result['objectives']['rcv blueCarGo'] = true;
                 if (v.block[1] != null && (v.block[1].$.s == "doGlideSteps" || (v.block[1].$.s == "doGlideDirection" && v.block[1].l[1] == "up"))){ 
                  result['objectives']['B glide up'] = true;
                  var numSteps = parseInt(v.block[1].l[0]);
                  if (numSteps >= 60 && numSteps <= 125)
                     result['objectives']['B numSteps'] = true;
                  if (v.block[2]!= null && (v.block[2].$.s == "doGlideDirection" && v.block[2].l[1] == "left")) 
                    {
                      result['objectives']['turn left'] = true;
                      var stepsLeft = parseInt(v.block[2].l[0]);
                      if (stepsLeft >= 150 && stepsLeft <= 200)
                        result['objectives']['target blue'] = true;
                      else leftNumSteps = false;
                    }
                  else{
                    if (v.block[2]!= null && ((v.block[2].$.s == "doFaceTowards" && v.block[2].l[0] == "Target Blue") || (v.block[2].$.s == "setHeading" && v.block[2].l[0] == "left"))){
                      result['objectives']['turn left'] = true;
                    if (v.block[3]!= null && (v.block[3].$.s == "doSpeedGlidetoObject" && v.block[3].l[1] == "Target Blue") || (v.block[3].$.s == "doGlidetoObject" && v.block[3].l[0] == "Target Blue"))
                      result['objectives']['target blue'] = true;}}}

        }
      });
        }
        if (u.$.devName == "Car Yellow")
        {
          u.scripts[0].script.forEach(function(v){
            if (v.block[0].$.s == "receiveMessage"){
               result['objectives']['rcv yellow msg']  = true;
                if (v.block[0].l[0] == carMsg)
                  result['objectives']['rcv yellowCarGo'] = true;
                if (v.block[1] != null && (v.block[1].$.s == "doGlideSteps" || (v.block[1].$.s == "doGlideDirection" && v.block[1].l[1] == "up"))){ 
                  result['objectives']['Y glide up'] = true;
                  var numSteps = parseInt(v.block[1].l[0]);
                  if (numSteps >= 60 && numSteps <= 125)
                     result['objectives']['Y numSteps'] = true;
                  if (v.block[2]!= null && (v.block[2].$.s == "doGlideDirection" && v.block[2].l[1] == "right")) 
                    {
                      result['objectives']['turn right'] = true;
                      var stepsRight = parseInt(v.block[2].l[0]);
                      if (stepsRight >= 150 && stepsRight <= 200)
                        result['objectives']['target yellow'] = true;
                      else rightNumSteps = false;
                    }
                  else{
                    if (v.block[2]!= null && ((v.block[2].$.s == "doFaceTowards" && v.block[2].l[0] == "Target Yellow") || (v.block[2].$.s == "setHeading" && v.block[2].l[0] == "right"))){
                      result['objectives']['turn right'] = true;
                    if (v.block[3]!= null && (v.block[3].$.s == "doSpeedGlidetoObject" && v.block[3].l[1] == "Target Yellow") || (v.block[3].$.s == "doGlidetoObject" && v.block[3].l[0] == "Target Yellow"))
                      result['objectives']['target yellow'] = true;}}}

        }
      });
        }
         });



   
    var completed = true;
    for (var property in result['objectives']) {
        if (result['objectives'][property] != true) {
            completed = false;
        }
    }
    result['completed'] = completed;


    if (!result['objectives']['on light click'])
      result.html = "For this activity, we want the stoplight to broadcast a message only when it is clicked! Check that you are using the correct event block for the stoplight and keep trying!";
   else if (! result['objectives']['broadcast light'])
      result.html = "When it is clicked, the stoplight should broadcast a message! Make sure to use the 'broadcast' block after the event block to let the cars know that there is a green light! You're off to a good start, keep trying!";
    else if (!result['objectives']['snd CarGo'])
      result.html = "You're almost done with the stoplight sprite! Make sure the light sends a message and you'll be done with this part. Keep trying, you're so close!";
    else if (!result['objectives']['rcv blue msg'] || !result['objectives']['rcv yellow msg'])
        result.html = "Uh oh, it looks like the wrong event is being used for either the blue or the yellow car! Check that you move both cars only when a message is received!";
    else if (!result['objectives']['rcv blueCarGo'] || !result['objectives']['rcv yellowCarGo']) 
        result.html = "Great start on the cars! You have the right event block for both, but you want the cars to glide to their target only after they receive the green light message sent by the stop light. Both are waiting on the same message! Keep trying, you're getting close!";
     else if (!result['objectives']['Y glide up'] || !result['objectives']['B glide up'])
        result.html = "Make sure the yellow and blue cars glide up (or forward) before gliding to the target! Keep trying!";
    else if (result['objectives']['Y numSteps'] == false || result['objectives']['B numSteps'] == false)
        result.html = " You're so close! When the blue and yellow cars glide up, it looks like they're not both taking the right number of steps! Try gliding to the center of the intersection and then turning!";
    else if ( result['objectives']['turn right'] == false ||  result['objectives']['turn left'] == false)
        result.html = "After you reach the center of the intersection, you want to turn the car to point it to the target! Use the 'point in direction' block or the 'point towards' block. Keep trying!";
    else if (!leftNumSteps)
        result.html = "You are so close! It looks like the blue car is not moving enough steps to reach the blue target. Make sure it is taking between 150 and 200 steps to the left! Keep trying!";
   else if (!rightNumSteps)
        result.html = "You are so close! It looks like the yellow car is not moving enough steps to reach the yellow target. Make sure it is taking between 150 and 200 steps to the right! Keep trying!";
    else if (result['objectives']['target blue'] == false || result['objectives']['target yellow'] == false)
        result.html = "Make sure both cars are gliding to their respective targets! You're so close, keep trying!";
    else if (completed == true) result.html = "Congratulations! You have completed this task!";
    return result;

  };

