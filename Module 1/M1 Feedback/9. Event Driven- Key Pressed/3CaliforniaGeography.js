// Author: Iris-Eleni Moridis
// Notes: This could use some cleaning up. Will come back to it if there is time.

exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};
    result['completed'] = false;

    // Only one objective for Animal Maze (get all the honey pots)
    result['objectives']['Run'] = false;
    result['objectives']['Complete'] = false;

    var directions = ["up arrow", "down arrow", "left arrow", "right arrow"];
    var dirs = {};
    dirs["up arrow"] = "up";
    dirs["down arrow"] = "down";
    dirs["left arrow"] = "left";
    dirs["right arrow"] = "right";

    var i;
    for (i = 0; i < directions.length; i++) {
        var direction = directions[i];
        result['objectives'][direction] = {};
        result['objectives'][direction]['event'] = false;
        result['objectives'][direction]['direction'] = false;
        result['objectives'][direction]['motion'] = false;
    }


    result['objectives']['GetReady'] = {};
    result['objectives']['GetReady']['script'] = false;
    result['objectives']['GetReady']['startspot'] = false;
    var error_type = 0;
    result['error_type'];

    result.html = "";

    try {

        //######################################################################//
        // Parse XML

        xmlObj.project.stage[0].sprites[0].sprite.forEach(function (w) {
            if (w.$.devName == "Car") {
                w.scripts[0].script.forEach(function (u) {
                    //result.html += u.block[0].$.s;
                    var length = u.block.length;
                    if (u.block[0].$.s == "receiveKey") {
                        var direction = u.block[0].l[0].option[0];
                        result['objectives'][direction]['event'] = true;
                        //result.html += "Found receive key: ."+direction+".<br>";
                        //result.html += "up arrow event? "+result['objectives'][directions[1]]['event']+"<br>";
                        //result.html += "dir: "+dirs[direction]+"<br>";
                        // if it is point in direction <direction>
                        if (length <= 1) {
                            result.html += "Good start for <b>" + direction + "</b>!  Now make the car move in that direction!<br>";
                        }
                        else if (u.block[1].$.s == "setHeading") {
                            // check direction
                            if (u.block[1].l == dirs[direction])
                                result['objectives'][direction]['direction'] = true;
                            else
                                result.html += "Check your <b>" + direction + "</b> script - it's not going the right way!<br>";
                            // check for motion
                            if (length == 2)
                                result.html += "You also need your <b>" + direction + "</b> script to move!<br>";
                            if ((u.block[2].$.s == "doGlideDirection") &&
                                (u.block[2].l[2] == dirs[direction]) &&
                                ( parseInt(u.block[2].l[1]) > 0))
                                result['objectives'][direction]['motion'] = true;
                            else if ((u.block[2].$.s == "doSpeedGlideSteps") &&
                                (parseInt(u.block[2].l[1]) > 0))
                                result['objectives'][direction]['motion'] = true;
                            else
                                result.html += "You also need your <b>" + direction + "</b> script to move!<br>";

                        } // point in direction
                        // if it is "when key pressed"
                        else if (u.block[1].$.s == "doGlideDirection") {
                            if (u.block[1].l[1] == dirs[direction])
                                result['objectives'][direction]['direction'] = true;
                            else
                                result.html += "Check your <b>" + direction + "</b> script - it's not going the right way!<br>";
                            if (parseInt(u.block[1].l[0]) > 0)
                                result['objectives'][direction]['motion'] = true;
                            else
                                result.html += "You also need your <b>" + direction + "</b> script to move!<br>";
                        } // glide X steps <direction>
                        else if (ublock[1].$.s == "doSpeedGlideSteps")
                            result.html += "In <b>" + direction + "</b>, don't forget to set the direction before moving!<br>";
                        else
                            result.html += "Good start for <b>" + direction + "</b>!  Now make the car move in that direction!<br>";
                    } // if it is "when key pressed"

                }); // for each script

            } // Car sprite
        }); // for each sprite

        // Find the variable named "completed" or "tested"
        xmlObj.project.variables[0].variable.forEach(function (v) {
            // Variable "tested": if 1 -> continue analysis, if 0 -> all false
            if (v.$.name == "tested") {
                if (v.l == "1")
                    result['objectives']['Run'] = true;
                else {
                    result['completed'] = false;
                    result.html += "If you are finished, make sure you test it before clicking the green check button!";
                    error_type = 2;
                }
            }
            // Variable "completed": if 1 -> true, 0 -> false
            else if (v.$.name == "completed") {
                if (v.l == "1") {
                    result['objectives']['Complete'] = true;
                    if (result.html == "")
                        result.html = "Good job! You've completed this task.";
                    error_type = 0;
                }
            }
        });
    }
    catch (err) {

    }
    finally {
        //######################################################################//
        // Feedback

        result['completed'] = true;
        for (i = 0; i < 4; i++) {
            direction = directions[i];
            if (!result['objectives'][direction]['direction'] || !result['objectives'][direction]['motion']) {
                result['completed'] = false;
                if (!result['objectives'][direction]['event'])
                    result.html += "Make a script to make the car go when <b>" + direction + " key is pressed</b><br>";
            }

        }

        if (result['completed']) {
            if (!result['objectives']['Run']) {
                error_type = 2;
                result.html = "Make sure to test your program before clicking the green check mark! This is the last step!";
                result['completed'] = false;
            }
            else if (!result['objectives']['Complete']) {
                error_type = -1;
                result.html = "Make sure you have made the car visit all of the cities before clicking the green check mark! You are getting close";
                result['completed'] = false;
            }
        }
        if (result['completed'])
            error_type = 0;

        result['error_type'] = error_type;
        return result;
    } // finally
};
