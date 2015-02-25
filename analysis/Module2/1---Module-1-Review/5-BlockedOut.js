exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    // Only one objective for Animal Maze (get all the honey pots)
    result['objectives']['Run'] = false;
    result['objectives']['Complete'] = false;

    result['objectives']['on door clicked'] = false;
    result['objectives']['correct background change'] = false;

    var otherClick, bgChange = false;


    result.html = "";

    xmlObj.project.stage[0].scripts[0].script.forEach(function(w){
        if (w.block[0].$.s == "otherReceiveClick")
        {
            otherClick = true;
            if (w.block[0].l[0] == "Door")
            {
                result['objectives']['on door clicked'] = true;
                if (w.block[1] != null && w.block[1].$.s == "doSwitchToBackground")
                {
                    bgChange = true;
                    if (w.block[1].l[0] == "maze") result['objectives']['correct background change'] = true;
                }
            }
        }

    });
    // Find the variable named "completed" or "tested"
    xmlObj.project.variables[0].variable.forEach(function(v){
        // Variable "tested": if 1 -> continue analysis, if 0 -> all false
        if(v.$.name == "tested") {
            if(v.l == "1")
                result['objectives']['Run'] = true;
            else {
               // result['completed'] = false;
                result.html ="If you are finished, make sure you test by clicking on the door. Then click the green check button!";
                //return result;
            }
        }
        // Variable "completed": if 1 -> true, 0 -> false
        else if(v.$.name == "completed") {
            if(v.l == "1"){
                result['objectives']['Complete'] = true;
                result.html = "Good job! You've completed this task.";
            }
            else{
                result.html = "You're not quite done yet! Be sure that you changed the background when the door was clicked.";
                //return result;
            }
        }
    });
        
    if (!otherClick)
        result.html = "To start this activity, click on the stage. Here, we must use the event that will allow us to change the background when the door is clicked. Keep trying!";    
    else if (result['objectives']['on door clicked'] == false) 
        result.html = "You're off to a good start! You have the correct event block, but the background should only change after the Door is clicked! Keep trying!";
	else if (!bgChange)
        result.html = "Great start! You have the event, now use the block that will let you switch the background to maze instead of blocked maze when the door is clicked! Keep trying!";
    else if ( result['objectives']['correct background change'] == false )
        result.html = "You're almost done! You have all the right blocks, but be sure you are switching the background to the one named 'maze'...Keep trying!";

    // If all objectives are completed, result.completed = true
    var completed = true;
    for (var property in result['objectives']) {
        if (result['objectives'][property] != true) {
            completed = false;
        }
    }
    result['completed'] = completed;

    return result;

  };

