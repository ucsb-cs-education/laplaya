exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    result['objectives']['a1_onspriteclick'] = false;
    result['objectives']['a2_onspriteclick'] = false;
    result['objectives']['a1_directionblock'] = false;
    result['objectives']['a2_directionblock'] = false;
    result['objectives']['a1_direction'] = false;
    result['objectives']['a2_direction'] = false;
    result['objectives']['a1_motionblock'] = false;
    result['objectives']['a2_motionblock'] = false;
    result['objectives']['a1_distance'] = false;
    result['objectives']['a2_distance'] = false;


    result['objectives']['Run'] = false;
    result['objectives']['Complete'] = false;

    result['error_type'];
    var error_type = 0;
    var not_tested = false;
    var not_completed = false;
    var direction = "up";
    var steps1 = 0;
    var steps2 = 0;

    result.html = "";

    try {
        //######################################################################################//
        // Helper functions

        // making apple face down
        function isFacingDown(block) {
            if (block.$.s == "doGlideDirection") {
                direction = block.l[1];
                if (direction == "down")
                    return true;
                else {
                    result.html += "Hmmm.  Why did you glide the apple to the " + direction + "?<br>";
                    return false;
                }
            }
            else if (block.$.s == "setHeading") {
                direction = block.l[0];
                if (direction == "down")
                    return true;
                else {
                    result.html += "Hmmm.  Why did you point the apple to the " + direction + "?<br>";
                    return false;
                }
            }
            else
                return false;
        }


        // feedback
        function feedback_loop(sprite, objective, direction, motionblock) {
            if (!objective) {
                result.html += "Check that you are using the correct event block for " + sprite + "! You want the apple to fall when you click it!";
                error_type = 1;
                return false;

            }
            else if (!direction) {
                result.html += "Great start! You are using the correct event block for " + sprite + ", but now you want it to glide to the ground. Look at your motion blocks. Which one lets the apple change direction so it can glide down?";
                error_type = 8;
                return false;
            }
            else if (!motionblock) {
                error_type = 7;
                result.html += "You are doing great!" + sprite + " is pointing in the correct direction, but you also want it to reach the ground. Make sure both rotten apples are gliding all the way to the grass, then check your work again!";
                return false;
            }
            return true;
        }


        //######################################################################################//
        //Parse XML


        xmlObj.project.stage[0].sprites[0].sprite.forEach(function (v) {
            var sprite_name = v.$.devName;
            var i = 0;
            if (sprite_name == "1RottenApple") {
                result.html += "<b>1RottenApple:<br></b>";
                v.scripts[0].script.forEach(function (w) {
                    if (w.block[0].$.s == "receiveClick") {
                        result['objectives']['a1_onspriteclick'] = true;
                        for (var i = 1; i < w.block.length; i++) {
                            var block = w.block[i];
                            var name = block.$.s;
                            if ((name == "setHeading") || (name == "doGlideDirection")) {
                                result['objectives']['a1_directionblock'] = true;
                                if (isFacingDown(block))
                                    result['objectives']['a1_direction'] = true;
                            }
                            if ((name == "doGlideDirection" || name == "doSpeedGlideSteps")) {
                                result['objectives']['a1_motionblock'] = true;
                                if (direction != "down") {
                                    result['objectives']['a1_direction'] = false;
                                    result.html += "Uh, oh! It is moving the wrong way in block " + i + "!<br>";
                                }
                                else {
                                    steps1 += parseInt(block.l[0]);
                                    result.objectives.a1_distance = (steps1 >= 175);
                                    //result.html += "Very close! The apple didn't <i>quite</i> make it down to the ground.<br>";
                                }
                            } // if motion block
                            else if (name == "doSpeedGlidetoObject") {
                                result.html += "Make the apple fall to the ground, not towards another sprite.<br>";
                                return result;
                            }
                        } // for each block in the script
                    } // if receiveClick event
                    // if a green flag event
                    else if (w.block[0].$.s == "getReady") {
                        result.html += "This project does not do anything on the <b>green flag</b> event.";
                        result.html += " Check the brown block that starts your script!<br>";
                    }
                }); // for each script
                if (!result['objectives']['a1_onspriteclick'])
                    result.html += "Create a script that starts <b>when the apple is clicked</b><br>";
                // if they have a script but no direction block
                else if (!result['objectives']['a1_directionblock'])
                    result.html += "Don't forget to turn the apple before it falls!";
                // if they have a turn but no motion block
                else if (result['objectives']['a1_direction']
                    && !result['objectives']['a1_motionblock'])
                    result.html += "Great, now move the apple to make it fall!";
                // if they got it to fall on the ground
                else if (result['objectives']['a1_distance'])
                    result.html += "Good job!";
            } // 1RottenApple
            // the SAME code, but for 2RottenApple!
            else if (sprite_name == "2RottenApple") {
                result.html += "<br><b>2RottenApple:<br></b>";
                v.scripts[0].script.forEach(function (w) {
                    if (w.block[0].$.s == "receiveClick") {
                        result['objectives']['a2_onspriteclick'] = true;
                        for (var i = 1; i < w.block.length; i++) {
                            var block = w.block[i];
                            var name = block.$.s;
                            if ((name == "setHeading") || (name == "doGlideDirection")) {
                                result['objectives']['a2_directionblock'] = true;
                                if (isFacingDown(block))
                                    result['objectives']['a2_direction'] = true;
                            }
                            if ((name == "doGlideDirection" || name == "doSpeedGlideSteps")) {
                                result['objectives']['a2_motionblock'] = true;
                                if (direction != "down") {
                                    result['objectives']['a2_direction'] = false;
                                    result.html += "Uh, oh! It is moving the wrong way in block " + i + "!<br>";
                                }
                                else {
                                    steps2 += parseInt(block.l[0]);
                                    result.objectives.a1_distance = (steps2 >= 175);
                                    //result.html += "Very close! The apple didn't <i>quite</i> make it down to the ground.<br>";
                                }
                            } // if motion block
                            else if (name == "doSpeedGlidetoObject") {
                                result.html += "Make the apple fall to the ground, not towards another sprite.<br>";
                                return result;
                            }
                        } // for each block in the script
                    } // if receiveClick event
                    // if a green flag event
                    else if (w.block[0].$.s == "getReady") {
                        result.html += "This project does not do anything on the <b>green flag</b> event.";
                        result.html += " Check the brown block that starts your script!<br>";
                    }
                }); // for each script
                if (!result['objectives']['a2_onspriteclick'])
                    result.html += "Create a script that starts <b>when the apple is clicked</b><br>";
                // if they have a script but no direction block
                else if (!result['objectives']['a2_directionblock'])
                    result.html += "Don't forget to turn the apple before it falls!";
                // if they have a turn but no motion block
                else if (result['objectives']['a2_direction']
                    && !result['objectives']['a2_motionblock'])
                    result.html += "Great, now move the apple to make it fall!";
                // if they got it to fall on the ground
                else if (result['objectives']['a2_distance'])
                    result.html += "Good job!";
            } // 2RottenApple
        });    // for each sprite


        // Find the variable named "completed" or "tested"
        xmlObj.project.variables[0].variable.forEach(function (v) {
            if (result['objectives']['a2_onspriteclick'] == true && result['objectives']['a1_onspriteclick'] == true) {
                if (v.$.name == "tested") {
                    if (v.l == "1")
                        result['objectives']['Run'] = true;
                    else {
                        not_tested = true;
                        result['completed'] = false;

                    }
                }
                // Variable "completed": if 1 -> true, 0 -> false
                else if (v.$.name == "completed") {
                    if (v.l == "1") {
                        result['objectives']['Complete'] = true;
                        result.html = "Good job! You've completed this task.";
                    }
                    else {
                        not_completed = true;
                    }
                }
            }
        });
    }
    catch (err) {

    }


        //######################################################################################//
        // Feedback
    finally {
        // If all objectives are completed, result.completed = true
        var completed = true;
        if (result['objectives']['a1_distance'] && result['objectives']['a2_distance']) {

            if (!result['objectives']['Run']) {
                result['completed'] = false;
                result.html += "Remember to test your scripts before checking your work!";
                error_type = 2;
                result['completed'] = false;
                return result;
            }
            else {
                result['completed'] = true;
                result['error_type'] = 0;
                return result;
            }
        }
        else {
            result.html += "Not quite done yet!";
            result['completed'] = false;
            result['error_type'] = 3;
            return result;
        } else {
            result.html += "Very close! The apple didn't <i>quite</i> make it down to the ground.<br>";
        }
        /*
         */
        result['completed'] = true;
        return result;

    } // finally

};
