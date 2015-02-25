exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    // Only one objective for Animal Maze (get all the honey pots)
    //result['objectives']['Run'] = false;
    //result['objectives']['Complete'] = false;
    result['objectives']['green flag'] = false;
    result['objectives']['forever loop'] = false;
    result['objectives']['if statement'] = false;
    result['objectives']['touching'] = false;
    result['objectives']['walls'] = false;
    result['objectives']['say'] = false;
    result.html = "";
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
                    if (v.block[1].script[0].block[0].script[0].block[0].$.s == "doSayFor")
                      result['objectives']['say'] = true;
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
    else if (result['objectives']['say'] == false)
      result.html = "Be sure to make the explorer say something when he hits the wall so that the user knows it happened! You're almost done!";
    else if (completed == true) result.html = "Congratulations! You have completed this task!";
    return result;

  };

