// Author: Logan?
// Notes: seems to work well. changed some feedback and try/catch/finally, as well as small changes to analysis.

exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    // Only one objective for Animal Maze (get all the honey pots)
    //result['objectives']['down'] = false;
    result['objectives']['down'] = false;
    result['objectives']['go']
    result['objectives']['line2'] = false; //1-2 (second line clockwise)
    result['objectives']['line3'] = false; //2-3 (third line going clockwise)
    result['objectives']['line4'] = false; //3-0 (fourth line clockwise)
    result['objectives']['nowronglines'] = true; // prevent wrong lines.
    result['error_type'];
    var error_type = 1;

    result.html = "";
    notes = {};
    notes.line2up = false;
    notes.line3up = false;
    notes.line4up = false;
    notes.wrongline = false;

    try {
        xmlObj.project.stage[0].sprites[0].sprite.forEach(function (v) {
            if (v.$.devName == "Alga") {
                console.log("found Alga");
                v.scripts[0].script.forEach(function (c) {
                    console.log(c.block[0].$.s);
                    if (c.block[0].$.s == "getReady") {
                        result['objectives']['go'] = true;
                        var lastLoc = 0;
                        var down = false;
                        for (var i = 1; i < c.block.length; i++) {
                            var block = c.block[i];
                            var name = c.block[i].$.s;
                            if (name == "down") {
                                down = true;
                                result.objectives.down = true;
                            }
                            if (name == "up") {
                                down = false;
                            }
                            if (name == "doSpeedGlidetoObject" || name == "doGlidetoObject") // If is a glide, update where we are.
                            {
                                var dot;
                                (name == "doSpeedGlidetoObject") ? dot = block.l[1] : dot = block.l[0];
                                var dotnum = -1;
                                if (dot == "Orange Dot") {
                                    dotnum = 0;
                                }
                                if (dot == "Blue Dot") {
                                    dotnum = 1;
                                }
                                if (dot == "Red Dot") {
                                    dotnum = 2;
                                }
                                if (dot == "Green Dot") {
                                    dotnum = 3;
                                }
                                console.log("" + dotnum + lastLoc);

                                if (lastLoc == 1 && dotnum == 2 || lastLoc == 2 && dotnum == 1) {
                                    notes.line2up = true;
                                    if (down) {
                                        result.objectives.line2 = true;
                                    }
                                }
                                else if (lastLoc == 2 && dotnum == 3 || lastLoc == 3 && dotnum == 2) {
                                    notes.line3up = true;
                                    if (down) {
                                        result.objectives.line3 = true;
                                    }
                                }
                                else if (lastLoc == 3 && dotnum == 0 || lastLoc == 0 && dotnum == 3) {
                                    notes.line4up = true;
                                    if (down) {
                                        result.objectives.line4 = true;
                                    }
                                } else if (lastLoc == 1 && dotnum == 0 || lastLoc == 0 && dotnum == 1) {
                                } // Not needed, but it isn't wrong either.
                                else if (down && lastLoc != dotnum) {
                                    result['objectives']['nowronglines'] = false; // added wrong lines.
                                }
                                lastLoc = dotnum;
                            }
                        }
                    }
                });
            }
        });
        // Find the variable named "completed" or "tested"
        xmlObj.project.variables[0].variable.forEach(function (v) {
            // Variable "tested": if 1 -> continue analysis, if 0 -> all false
            if (v.$.name == "tested") {
                if (v.l == "1") {
                    result['objectives']['Run'] = true;

                }
                else {
                    error_type = 4;
                    result['completed'] = false;
                    result.html = "If you are finished, make sure you test it before clicking the green check button!";
                    error_type = 2;
                    result['error_type'] = error_type;
                    return result;
                }
            }

        });

    }
    catch (err) {
    }
    finally {
        // If all objectives are completed, result.completed = true
        var completed = true;
        for (var property in result['objectives']) {
            if (result['objectives'][property] != true) {
                completed = false;
            }
        }
        result['completed'] = completed;

        if (completed == true) {
            result.html += "Good job! You've completed this task.";
            error_type = 0;
        }
        else {
            if (!result['objectives']['go']) {
                result.html += "It doesn't look like your code will run when the go button is pressed. Make sure that you programmed Alga to build the house only after the Green flag is clicked!<br>";
                error_type = 1;
            } else if (!result['objectives']['down']) // pen down
            {
                result.html += "Make sure you put the pen down when drawing!<br>";
                error_type = 3;
            } else {
                error_type = 4;
                if (!notes['line2up']) {
                    result.html += "Are you drawing a line between the blue and red dots?<br>";
                } else if (!result['objectives']['line2']) {
                    result.html += "Make sure the pen is down when drawing a line between the blue and red dots.<br>";
                }
                if (!notes['line3up']) {
                    result.html += "Are you drawing a line between the red and green dots?<br>";
                } else if (!result['objectives']['line3']) {
                    result.html += "Make sure the pen is down when drawing a line between the red and green dots?<br>";
                }
                if (!notes['line4up']) {
                    result.html += "Are you drawing a line between the green and orange dots?<br>";
                } else if (!result['objectives']['line4']) {
                    result.html += "Make sure the pen is down when drawing a line between the green and orange dots.<br>";
                }
                if (!result['objectives']['nowronglines']) {
                    result.html += "It looks like you have some lines that shouldn't be there. Make sure you only have the right lines!<br>";
                }
            }
        }
        result['error_type'] = error_type;
        return result;
    }
};