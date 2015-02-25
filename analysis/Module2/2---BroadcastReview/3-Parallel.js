exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    var blueMsg = new String();
    var blueRec = new String();
    var yellowMsg = new String();
    var yellowRec = new String();

    // Only one objective for Animal Maze (get all the honey pots)
    result['objectives']['Run'] = false;
    //result['objectives']['Complete'] = false;
    result['objectives']['on left click']  = false;
    result['objectives']['broadcast left light'] = false;
    result['objectives']['snd blueCarGo'] = false;

    result['objectives']['on right click']  = false;
    result['objectives']['broadcast right light'] = false;
    result['objectives']['snd yellowCarGo'] = false;

    result['objectives']['rcv blue msg']  = false;
    result['objectives']['rcv blueCarGo'] = false;
    result['objectives']['glide to blue'] = false;
    result['objectives']['target blue'] = false;

result['objectives']['rcv yellow msg']  = false;
    result['objectives']['rcv yellowCarGo'] = false;
    result['objectives']['glide to yellow'] = false;
    result['objectives']['target yellow'] = false;

    
    result.html = "";
try{
xmlObj.project.stage[0].sprites[0].sprite.forEach(function(u){
   
        if(u.$.devName == "Stoplight Left")
        {
             u.scripts[0].script.forEach(function(v){
            if (v.block[0].$.s == "receiveClick")
            {
               result['objectives']['on left click']  = true;
                if (v.block[1] != null && v.block[1].$.s == "doBroadcast")
                {
                  result['objectives']['broadcast left light'] = true;
                  blueMsg = v.block[1].l[0];
                  if (v.block[1].l[0] != "")
                    result['objectives']['snd blueCarGo'] = true;
                }
               }
             });
           }
        if(u.$.devName == "Stoplight Right")
        {
             u.scripts[0].script.forEach(function(v){
            if (v.block[0].$.s == "receiveClick")
            {
               result['objectives']['on right click']  = true;
                if (v.block[1] != null && v.block[1].$.s == "doBroadcast")
                {
                  result['objectives']['broadcast right light'] = true;
                  //if (v.block[1].l[0] == "yellowCarGo")
                  yellowMsg = v.block[1].l[0];
                  if (yellowMsg != "")
                    result['objectives']['snd yellowCarGo'] = true;
                }
               }
             });
           }
        if (u.$.devName == "Car Blue")
        {
          u.scripts[0].script.forEach(function(v){
            if (v.block[0].$.s == "receiveMessage"){
               result['objectives']['rcv blue msg']  = true;
               blueRec = v.block[0].l[0];
               // if (v.block[0].l[0] == "blueCarGo")
                //  result['objectives']['rcv blueCarGo'] = true;
                if (v.block[1] != null && (v.block[1].$.s == "doSpeedGlidetoObject" || v.block[1].$.s == "doGlidetoObject")){
                  result['objectives']['glide to blue'] = true;
                  if ((v.block[1].$.s == "doSpeedGlidetoObject"  && v.block[1].l[1] == "Target Blue")|| v.block[1].$.s == "doGlidetoObject"  && v.block[1].l[0] == "Target Blue")
                  result['objectives']['target blue'] = true;}

        }
      });
        }
        if (u.$.devName == "Car Yellow")
        {
          u.scripts[0].script.forEach(function(v){
            if (v.block[0].$.s == "receiveMessage"){
               result['objectives']['rcv yellow msg']  = true;
               yellowRec = v.block[0].l[0];
                //if (v.block[0].l[0] == "yellowCarGo")
                  //result['objectives']['rcv yellowCarGo'] = true;
                if (v.block[1] != null && (v.block[1].$.s == "doSpeedGlidetoObject" || v.block[1].$.s == "doGlidetoObject")){
                  result['objectives']['glide to yellow'] = true;
                  if ((v.block[1].$.s == "doSpeedGlidetoObject"  && v.block[1].l[1] == "Target Yellow")|| (v.block[1].$.s == "doGlidetoObject"  && v.block[1].l[0] == "Target Yellow"))
                  result['objectives']['target yellow'] = true;}

        }
      });
        }
         });
}
catch(err){}

if (yellowMsg != blueMsg){
  if (yellowMsg == yellowRec)
    result['objectives']['rcv yellowCarGo'] = true;
  if (blueMsg == blueRec)
    result['objectives']['rcv blueCarGo'] = true;
}

xmlObj.project.variables[0].variable.forEach(function(v){
        // Variable "tested": if 1 -> continue analysis, if 0 -> all false
        if(v.$.name == "completed") {
            if(v.l == "1")
                result['objectives']['Run'] = true;
            }
        });
    // If all objectives are completed, result.completed = true
    var completed = true;
    for (var property in result['objectives']) {
        if (result['objectives'][property] != true) {
            completed = false;
        }
    }
    result['completed'] = completed;

    if (result['objectives']['on left click']  == false || result['objectives']['on right click']  == false)
      result.html = "The stoplights should each broadcast a message when they are clicked! Check that you are using the correct evevnt block for the stoplights and keep trying!";
   else if (result['objectives']['broadcast left light'] == false || result['objectives']['broadcast right light'] == false)
      result.html = "When they are clicked, each of the two stoplights should broadcast a message! Make sure to use the 'broadcast' block!";
    else if (result['objectives']['snd blueCarGo'] == false || result['objectives']['snd yellowCarGo'] == false)
      result.html = "You're almost done with the stoplights! Make sure the left light sends the message for the blue car to go and the right sends the message for the right car to go! Keep trying, you just need to create the two messages!";
    else if (result['objectives']['rcv blue msg']  == false || result['objectives']['rcv yellow msg'] == false)
        result.html = "Uh oh! It looks like the wrong event is being used! Check that you move the cars only when a message is received!";
    else if (result['objectives']['rcv blueCarGo'] == false || result['objectives']['rcv yellowCarGo'] == false) 
        result.html = "You have the right event block, but check that each of the cars are waiting to receive the correct message! You want the blue car to move when it receives the message from the left stoplight and the yellow to move when it receives the message from the blue stoplight.";
    else if (result['objectives']['glide to blue']==false || result['objectives']['glide to yellow']==false)
        result.html = "We were hoping you would use the 'glide to' or 'glide normally to' motion block! Check the scripts in each of the cars and try again!";
    else if (result['objectives']['target blue'] == false || result['objectives']['target yellow'] == false)
        result.html = "Make sure to glide to the target that is the same color as the car! You're so close, keep trying!";
    else if (result['objectives']['Run'] == false)
        result.html = "Be sure that your cars move to their corresponding targets before clicking the green check mark!";
    else if (completed == true) result.html = "Congratulations! You have completed this task!";
    return result;

  };

