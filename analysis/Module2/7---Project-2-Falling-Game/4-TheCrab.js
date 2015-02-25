exports.process = function (xmlObj) {
    var result = {};
    result.html = "";
    result['objectives'] = {};
    result['objectives']['crab'] = false;

  var right_here = false;
  var left_here = false;
  var right_direction = false;
  var right_move = false;
  var left_direction = false;
  var left_move = false;

  var right_order = true;
  var left_order = true;
  
  var obs1_costumechange = false;
  var obs1_wait = false;

try{//}
    xmlObj.project.stage[0].sprites[0].sprite.forEach(function(s){

        // Check the Crab sprite initialization
        if(s.$.name == "Crab"){
          
            s.scripts[0].script.forEach(function(i){
                if (i.block[0].$.s == "getReady"){
                    if (i.block[1].$.s == "doForever")
                    {
                        i.block[1].script[0].block.forEach(function(block){
                            if (block.$.s == "doIf" && block.block[0].$.s == "reportTouchingObject" && block.block[0].l[0] == "Obstacle1")
                            {
                                // costume 2, wait, costume 1 --> check that two diff costumes are used with a wait in between 
                                if (block.script[0].block[0].$.s == "doSwitchToCostume" && block.script[0].block[2].$.s == "doSwitchToCostume"){
                                    if (block.script[0].block[0].l[0] != block.script[0].block[2].l[0]){
                                        obs1_costumechange = true;
                                    }
                                }
                                else if (block.script[0].block[1].$.s == "doSwitchToCostume"){
                                      obs1_costumechange = true;
                                }
                                   
                                if (block.script[0].block[1].$.s == "doWait")
                                  obs1_wait = true;
                            }
                        });
                    }
                }
                if(i.block[0].$.s == "receiveKey"){
                    if(i.block[0].l[0].option[0] == "right arrow"){
                        right_here = true;
                        i.block.forEach(function(j){
                            // If they are using point in dirction block
                            if(j.$.s == "setHeading"){
                                if(j.l[0] == "right"){
                                    right_direction = true;
                                }
                                else{
                                    right_direction = false;
                                }
                            }
                            // If they are using blocks that both move and point in direction
                            if(j.$.s == "placeDirection" || j.$.s == "doGlideDirection"){
                                if(parseInt(j.l[0]) > 0){
                                    right_move = true;
                                }
                                else{
                                    right_move = false;
                                }
                                if(j.l[1] == "right"){
                                    right_direction = true;
                                }
                                else{
                                    right_direction = false;
                                }
                            }
                            // If they are using just steps blocks
                            if(j.$.s == "doSpeedGlideSteps" || j.$.s == "forward"){
                                if(parseInt(j.l[0]) > 0){
                                    right_move = true;
                                    if(right_direction != true){
                                        right_order = false;
                                    }
                                }
                                else{
                                    right_move = false;
                                }
                            }
                        });
                    }
                    if(i.block[0].l[0].option[0] == "left arrow"){
                        left_here = true;
                        i.block.forEach(function(j){
                            // If they are using point in dirction block
                            if(j.$.s == "setHeading"){
                                if(j.l[0] == "left"){
                                    left_direction = true;
                                }
                                else{
                                    left_direction = false;
                                }
                            }
                            // If they are using blocks that both move and point in direction
                            if(j.$.s == "placeDirection" || j.$.s == "doGlideDirection"){
                                if(parseInt(j.l[0]) > 0){
                                    left_move = true;
                                }
                                else{
                                    left_move = false;
                                }
                                if(j.l[1] == "left"){
                                    left_direction = true;
                                }
                                else{
                                    left_direction = false;
                                }
                            }
                            // If they are using just steps blocks
                            if(j.$.s == "doSpeedGlideSteps" || j.$.s == "forward"){
                                if(parseInt(j.l[0]) > 0){
                                    left_move = true;
                                    if(left_direction != true){
                                        left_order = false;
                                    }
                                }
                                else{
                                    left_move = false;
                                }
                            }
                        });
                    }
                    
                    
                }

            });

                } 
        
    });
}
catch(err){}

    
    

    if (obs1_costumechange == false)
                result.html = "Uh oh! It looks like you didn't change the crab's costume twice when Obstacle 1 is touching the crab! Keep trying!";
    else if (obs1_wait == false)
                result.html = "You are so close! When the crab touches obstacle 1, you made it change costume but you forgot the 'Wait' statement. Keep trying!";
    else if(right_order == true && left_order == true && right_here == true && left_here == true && right_move == true && right_direction == true && left_move == true && left_direction == true){
                result['objectives']['crab'] = true;
            }
    else if(right_here == false){
                result.html = "It looks like you might not have written a script for when the right arrow key is pressed. Use the brown Event block to begin writing the script.";
            }
    else if(right_move == false){
                result.html = "Your Crab might be moving incorrectly. It needs to move a couple steps when the right arrow key is pressed.";
            }
    else if(right_direction == false){
                result.html = "Your Crab needs to be facing the 'right' direction before it moves. Look at the script for when the right arrow key is pressed and make sure the Crab is pointing in the 'right' direction.";
            }
    else if(right_order == false){
                result.html = "Good job so far! It looks like you have selected the correct blocks for 'when right arrow key is pressed', but you might not have put them in the right order. The Crab needs to point in the 'right' direction BEFORE moving!"
            }
    else if(left_here == false){
                result.html = "It looks like you might not have written a script for when the left arrow key is pressed. Use the brown Event block to begin writing the script.";
            }
    else if(left_move == false){
                result.html = "Your Crab might be moving incorrectly. It needs to move a couple steps when the left arrow key is pressed.";
            }
    else if(left_direction == false){
                result.html = "Your Crab needs to be facing the 'left' direction before it moves. Look at the script for when the right arrow key is pressed and make sure the Crab is pointing in the 'left' direction.";
            }
    else if(left_order == false){
                result.html = "Good job so far! It looks like you have selected the correct blocks for 'when left arrow key is pressed', but you might not have put them in the right order. The Crab needs to point in the 'left' direction BEFORE moving!"
            }
    //        else 
     var completed = true;
    for (var property in result['objectives']) {
        if (result['objectives'][property] != true) {
            completed = false;
        }
    }
    result['completed'] = completed;
    return result;
}

