exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    // Only one objective for Animal Maze (get all the honey pots)
    result['objectives']['Run'] = false;
    result['objectives']['Complete'] = false;
    result['objectives']['correct event'] = false;
    result['objectives']['correct key'] = false;
    result['objectives']['gliding'] = false;

    var error_type = 0;
    result['error_type'];

    result.html = "";
    try {
        //##################################################################//
        //Helper
        function isGlidingUp(block) {
            var i = 1;
            if (block[1].$.s == "setHeading" && block[1].l[0] == "up")
                i++;
            if (block[i].$.s == "doGlideDirection" && block[i].l[1] == "up")
                return true;
            return block[i].$.s == "doSpeedGlideSteps";
        }

        //##################################################################//
        // Parse XML
        xmlObj.project.stage[0].sprites[0].sprite.forEach(function (w) {
            if (w.$.devName == "Rocket" && w.scripts[0].script[1].block[0].$.isInert == "false") {
                if (w.scripts[0].script[1].block[0].$.s == "receiveKey") {
                    result['objectives']['correct event'] = true;
                    if (w.scripts[0].script[1].block[0].l[0].option[0] == "up arrow") {
                        result['objectives']['correct key'] = true;
                        if (w.scripts[0].script[1].block[1] && isGlidingUp(w.scripts[0].script[1].block))
                            result['objectives']['gliding'] = true;

                    }

                }
            }

        });

        // Find the variable named "completed" or "tested"
        xmlObj.project.variables[0].variable.forEach(function (v) {

            // Variable "tested": if 1 -> continue analysis, if 0 -> all false
            if (v.$.name == "tested") {
                if (v.l == "1")
                    result['objectives']['Run'] = true;
                else {
                    result['completed'] = false;

                }
            }
            // Variable "completed": if 1 -> true, 0 -> false
            else if (v.$.name == "completed") {
                if (v.l == "1") {
                    result['objectives']['Complete'] = true;
                    if (result['objectives']['correct key'] == true) {
                        result.html = "Good job! You've completed this task.";
                    }
                }
                else {
                    result['objectives']['Complete'] = false;
                    result.html = "You are not done yet, keep working on it!";

                }
            }
        });
    }
    catch (err) {
    }
    finally {
        if (!result['objectives']['correct event']) {
            result.html = "Take a look at your event block and keep trying! You want the rocket to move when the 'up' key is clicked. Which event would you use for this?";
            error_type = 1;
        }
        else if (!result['objectives']['correct key']) {
            result.html = "Great start! You're using the right event block, now make sure the rocket will only go up if you click the UP arrow. Use the scroll-down menu and select the key you would like the sprite to react to!";
            error_type = 15;
        }
        else if (!result['objectives']['gliding']) {
            result.html = "You're off to a great start! You have the right event, but now you need a glide block to make the rocket glide upwards, off the screen. When you test, move the rocket all the way off the screen! ";
            error_type = 4;
        }
        else if (!result['objectives']['Run']) {
            result.html = "If you are finished, make sure you test it before clicking the green check button!";
            error_type = 2;
        }
        else if (!result['objectives']['Complete']) {
            result.html = "You are not done yet, keep working on it! Make sure the rocket moves all the way off of the screen";
            error_type = -1;
        }

        else error_type = -1;

        // If all objectives are completed, result.completed = true
        var completed = true;
        for (var property in result['objectives']) {
            if (result['objectives'][property] != true) {
                completed = false;
            }
        }
        result['completed'] = completed;
        if (completed) error_type = 0;

        result['error_type'] = error_type;
        return result;
    }

};

