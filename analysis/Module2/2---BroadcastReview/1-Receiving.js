exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    // Only one objective for Animal Maze (get all the honey pots)
    result['objectives']['Run'] = false;
    //result['objectives']['Complete'] = false;
    result['objectives']['receive msg']  = false;
    result['objectives']['correct msg'] = false;
    result['objectives']['glide to'] = false;
    result['objectives']['target'] = false;
    result.html = "";

xmlObj.project.stage[0].sprites[0].sprite.forEach(function(u){
   
        if(u.$.devName == "Car") {
             u.scripts[0].script.forEach(function(v){
            if (v.block[0].$.s == "receiveMessage" && v.block[0].$.isInert == "false"){
               result['objectives']['receive msg']  = true;
                if (v.block[0].l[0] == "LightGreen")
                  result['objectives']['correct msg'] = true;
                if (v.block[1] != null && v.block[1].$.s == "doSpeedGlidetoObject"){
                  result['objectives']['glide to'] = true;
                  if (v.block[1].l[1] == "Target")
                  result['objectives']['target'] = true;}
      }});}});
xmlObj.project.variables[0].variable.forEach(function(v){
        // Variable "tested": if 1 -> continue analysis, if 0 -> all false
        if(v.$.name == "tested") {
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
    if (result['objectives']['receive msg']  == false)
        result.html = "Uh oh! It looks like the wrong event is being used! Check that you move the car only when a message is received!";
    else if (result['objectives']['correct msg'] == false) 
        result.html = "Check the Event block to make sure you are waiting to receive the correct message! You want the car to move on Green Light.";
    else if (result['objectives']['glide to']==false)
        result.html = "It looks like the motion block doesn't match the one in the inert script! Check the script and try again!";
    else if (result['objectives']['target'] == false)
        result.html = "Make sure to glide to the target using the block in the inert script! ";
    else if (result['objectives']['Run'] == false)
        result.html = "Be sure to test that your car moves to the target before clicking the green check mark!";
    else if (completed == true) result.html = "Congratulations! You have completed this task!";
    return result;

  };

