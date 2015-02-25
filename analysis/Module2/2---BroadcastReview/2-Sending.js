exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    // Only one objective for Animal Maze (get all the honey pots)
    result['objectives']['Run'] = false;

    result['objectives']['on stoplight click'] = false;
    result['objectives']['send message'] = false;
    var msg = "";
    var toTarget = true;
    //new String();//= "";

    //result['objectives']['msg'] = false;
    //result['objectives']['Complete'] = false;
    result['objectives']['receive msg']  = false;
    result['objectives']['correct msg'] = false;
    result['objectives']['glide up'] = false;
    result['objectives']['numSteps'] = false;
    result['objectives']['turn right'] = false;
    result['objectives']['target'] = false;
    result.html = "";
try{
xmlObj.project.stage[0].sprites[0].sprite.forEach(function(u){
        if (u.$.devName == "Stoplight"){
            u.scripts[0].script.forEach(function(v){
                if (v.block[0].$.s == "receiveClick" && v.block[0].$.isInert == "false"){
                    result['objectives']['on stoplight click'] = true;
                    if (v.block[1] != null && v.block[1].$.s == "doBroadcast"){
                        result['objectives']['send message'] = true;
                        msg = v.block[1].l[0];

                    }
                }
            });
        }
});
xmlObj.project.stage[0].sprites[0].sprite.forEach(function(u){
        if(u.$.devName == "Car") {
             u.scripts[0].script.forEach(function(v){
            if (v.block[0].$.s == "receiveMessage" && v.block[0].$.isInert == "false"){
               result['objectives']['receive msg']  = true;
                // if (msg.localeCompare(v.block[0].l[0].toString()))// == v.block[0].l[0])
                if (msg == v.block[0].l[0])
                  result['objectives']['correct msg'] =  true;//v.block[0].l[0];//true;
                if (v.block[1] != null && (v.block[1].$.s == "doGlideSteps" || (v.block[1].$.s == "doGlideDirection" && v.block[1].l[1] == "up"))){ 
                  result['objectives']['glide up'] = true;
                  var numSteps = parseInt(v.block[1].l[0]);
                  if (numSteps >= 60 && numSteps <= 90)
                     result['objectives']['numSteps'] = true;
                 if (v.block[2] != null && (v.block[2].$.s == "doGlideDirection" && v.block[2].l[1] == "right"))
                 {
                    result['objectives']['turn right'] = true;
                    var numToTarget = parseInt(v.block[2].l[0]);
                    if (numToTarget >= 250 && numToTarget <=310)
                        result['objectives']['target'] = true;
                    else
                        toTarget = false;
                 }
                else {
                  if (v.block[2]!= null && ((v.block[2].$.s == "doFaceTowards" && v.block[2].l[0] == "Target") || (v.block[2].$.s == "setHeading" && v.block[2].l[0] == "right"))){ 
                    result['objectives']['turn right'] = true;
                  if (v.block[3]!= null && (v.block[3].$.s == "doSpeedGlidetoObject" && v.block[3].l[1] == "Target") || (v.block[3].$.s == "doGlidetoObject" && v.block[3].l[0] == "Target"))
                  result['objectives']['target'] = true;}}
          }
      }});}});
}
catch(err){}
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

    
    if (result['objectives']['on stoplight click'] == false)
        result.html = "You haven't done anything yet! Add the event block in the stoplight sprite that says 'When Stoplight clicked' and then broadcast a message that says there is a green light! ";
    else if (result['objectives']['send message'] == false)
        result.html = "After the stoplight is clicked, you should send a message! Create a new message that says there's a green light and broadcast it!";
    else if (result['objectives']['receive msg']  == false)
        result.html = "Uh oh! It looks like the wrong event is being used! Check that you move the car only when a message is received!";
    else if (result['objectives']['correct msg'] == false) 
        result.html = "Check the Event block in the car sprite to make sure you are waiting to receive the correct message! The message you are sending from the stoplight does not match the one you are waiting to receive. Change that and keep trying!";
    else if (result['objectives']['glide up']==false)
        result.html = "Make sure you glide up (or forward) before gliding to the target! Keep trying!";
    else if (result['objectives']['numSteps'] == false)
        result.html = " You're so close! When you glide up, it looks like you're not taking the right number of steps! Try gliding to the center of the intersection and then turning!";
    else if ( result['objectives']['turn right'] == false)
        result.html = "After you reach the center of the intersection, you want to turn the car to point it to the target! Use the 'point in direction' block or the 'point towards' block. Keep trying!";
    else if (!toTarget)
        result.html = "To make it to the target from the intersection, the car needs to glide between 250 and 310 steps! Correct the number of steps and click the green check mark again. You're almost done, keep trying!";
    else if (result['objectives']['target'] == false)
        result.html = "Make sure to use a motion block that allows you to glide directly to the target without calculating steps! Keep trying you're so close!";
    else if (result['objectives']['Run'] == false)
        result.html = "Be sure to test that your car moves to the target before clicking the green check mark!";
    else if (completed == true) result.html = "Congratulations! You have completed this task!";
    return result;

  };

