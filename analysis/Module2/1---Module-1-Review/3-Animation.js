exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    // Only one objective for Animal Maze (get all the honey pots)
    //result['objectives']['Run'] = false;
    //result['objectives']['Complete'] = false;
    result['objectives']['right anim'] = false;
    result['objectives']['left anim'] = false;
    result['objectives']['up anim'] = false;
    result['objectives']['down anim'] = false;
    
    result.html = "";
  var right = 0;
  var left = 0;
  var up = 0;
  var down = 0;

  var glideRight, glideLeft, glideUp,glideDown = false;

xmlObj.project.stage[0].sprites[0].sprite.forEach(function(u){
   
        if(u.$.devName == "Explorer") {
          u.scripts[0].script.forEach(function(v){
            if (v.block[0].$.s == "receiveKey" && v.block[0].l[0].option[0] == "right arrow")
            {
              v.block.forEach(function(w){
                if (w.$.s == "doWearNextCostume")
                    right +=1;
                if (w.$.s == "doGlideDirection")
                { 
                  if (w.l[1] == "right")
                    glideRight = true;
                }
                else if (w.$.s == "setHeading" && w.l[0] == "right"){
                  w.block.forEach(function(m){
                    if (m.$.s == "doSpeedGlideSteps")
                      glideRight = true;
                  });
                }
              });
             }
            if (v.block[0].$.s == "receiveKey" && v.block[0].l[0].option[0] == "left arrow"){
               
               v.block.forEach(function(w){
                 if (w.$.s == "doWearNextCostume")
                    left +=1;
                 if (w.$.s == "doGlideDirection")
                { 
                  if (w.l[1] == "left")
                    glideLeft = true;
                }
                else if (w.$.s == "setHeading" && w.l[0] == "left"){
                  w.block.forEach(function(m){
                    if (m.$.s == "doSpeedGlideSteps")
                      glideLeft = true;
                  });
                }                 
               });
            }
            if (v.block[0].$.s == "receiveKey" && v.block[0].l[0].option[0] == "up arrow"){
                
                  v.block.forEach(function(w){
                 if (w.$.s == "doWearNextCostume")
                    up +=1;
                if (w.$.s == "doGlideDirection")
                { 
                  if (w.l[1] == "up")
                    glideUp = true;
                }
                else if (w.$.s == "setHeading" && w.l[0] == "up"){
                  w.block.forEach(function(m){
                    if (m.$.s == "doSpeedGlideSteps")
                      glideUp = true;
                  });
                }
               });
            }
            if (v.block[0].$.s == "receiveKey" && v.block[0].l[0].option[0] == "down arrow"){
              v.block.forEach(function(w){
                if (w.$.s == "doWearNextCostume")
                  down +=1;
                if (w.$.s == "doGlideDirection")
                { 
                  if (w.l[1] == "down")
                    glideDown = true;
                }
                else if (w.$.s == "setHeading" && w.l[0] == "down"){
                  w.block.forEach(function(m){
                    if (m.$.s == "doSpeedGlideSteps")
                      glideDown = true;
                  });
                }
               });
            }
        });}});

    if (right%2 == 1) result['objectives']['right anim'] = true;
    if (left%2 == 1) result['objectives']['left anim'] = true;
    if (up%2 == 1) result['objectives']['up anim'] = true;  	
    if (down%2 == 1) result['objectives']['down anim'] = true;

    // If all objectives are completed, result.completed = true
    var completed = true;
    for (var property in result['objectives']) {
        if (result['objectives'][property] != true) {
            completed = false;
        }
    }
    result['completed'] = completed;

    if (right%2 == 0) result.html = "Check that you change the costume using the 'next costume' block once when the right key is pressed! ";
    else if (left%2 == 0)  result.html = "Check that you change the costume using the 'next costume' block once when the left key is pressed! ";
    else if (up%2 == 0)  result.html = "Check that you change the costume using the 'next costume' block once when the up key is pressed! "; 
    else if (down%2 == 0)  result.html = "Check that you change the costume using the 'next costume' block once when the down key is pressed! ";
    else if (!glideRight){
      result['completed'] = false;
      result.html = "You completed the costume change correctly by adding the 'next costume' block! The block that makes the explorer move to the right is now missing though. Make sure the explorer is still gliding to the right when the right key is pressed! Keep trying! ";
    }
    else if (!glideLeft){
      result['completed'] = false;
      result.html = "You completed the costume change correctly by adding the 'next costume' block! The block that makes the explorer move to the left is now missing though. Make sure the explorer is still gliding to the left when the left key is pressed! Keep trying! ";
    }
    else if (!glideUp){
      result['completed'] = false;
      result.html = "You completed the costume change correctly by adding the 'next costume' block! The block that makes the explorer move up is now missing though. Make sure the explorer is still gliding up when the up key is pressed! Keep trying! ";
    }
    else if (!glideDown){
      result['completed'] = false;
      result.html = "You completed the costume change correctly by adding the 'next costume' block! The block that makes the explorer move down is now missing though. Make sure the explorer is still gliding down when the down key is pressed! Keep trying! ";
    }
    else if (completed == true) result.html = "Congratulations! You have completed this task!";
    return result;

  };

