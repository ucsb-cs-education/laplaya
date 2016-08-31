// Author: Logan? 
// notes: this works. few changes made
// Reiny: improved error checking

exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    // Drawing a triangle -> three lines
    result['objectives']['pen down'] = false;
    result['objectives']['go'] = false;
    result['objectives']['numlines'] = 0;
    result['error_type'] = 1;
    result['completed'] = false;
    var error_type;

    // we initialize to the blue dot, so it has been visited
    // blue = 0, orange = 1, pink = 2
    var dots = {};
    // has this been visited before?
    dots[0] = true;
    dots[1] = false;
    dots[2] = false;
    var num_visited = 1;
    var num_blocks = 0;

    result.html = "";
    notes = {};
    var pendown = false;

    try {

        xmlObj.project.stage[0].sprites[0].sprite.forEach(function (v) {
            if (v.$.devName == "Alga") {
                // for each script in Alga
                v.scripts[0].script.forEach(function (c) {
                    // if it is a green flag script
                    if (c.block[0].$.s == "getReady") {
                        result['objectives']['go'] = true;
                        num_blocks = c.block.length;
                        for (var i = 1; i < c.block.length; i++) {
                            var block = c.block[i];
                            var name = c.block[i].$.s;
//result.html += "Block: "+name+"<br>";
                            if (name == "down") {
                                pendown = true;
                                result['objectives']['pen down'] = true;
                            }
                            else if (name == "up")
                                pendown = false;
                            else if (name == "clear") {
                                if (num_visited > 1) {
                                    result.html = "Uh, oh!  You erased some of your drawing!<br>";
                                    result['error_type'] = 4;
                                    return result;
                                }
                            }
                            // If is a glide, update where we are.
                            else if ((name == "doGotoObject") ||
                                (name == "doSpeedGlidetoObject")) {

                                if (!pendown) {
                                    result.html = "Make sure the pen is down when you are moving to draw a line!<br>";
                                    result['error_type'] = 2;
                                    result['completed'] = false;
                                    return result;
                                }

                                var arg = 1;
                                if (name == "doGotoObject")
                                    arg = 0;

                                var dotname = c.block[i].l[arg];
                                var dotnum = -1;
                                if (dotname == "Blue Dot")
                                    dotnum = 0;
                                else if (dotname == "Orange Dot")
                                    dotnum = 1;
                                else if (dotname == "Pink Dot")
                                    dotnum = 2;

                                // check to make sure that we haven't been there before
                                // (unless it's the last move)
                                if (num_visited < 3) {
                                    if (dots[dotnum] != true) {
                                        dots[dotnum] = true;
                                        result['objectives']['numlines'] = num_visited;
                                        num_visited ++;
                                    }
                                    // we haven't visited it before
                                }
                                else {
                                    result['objectives']['numlines'] = num_visited;
                                    num_visited ++;
                                }
                            } // end of goto / place at
                        } // for each block
                    } // green flag script
                }); // for each of alga's scripts
            } // for Alga
        }); // for each sprite


        // Find the variable named "completed" or "tested"
        xmlObj.project.variables[0].variable.forEach(function (v) {
            // Variable "tested": if 1 -> continue analysis, if 0 -> all false
            if (v.$.name == "tested") {
                if (v.l == "1")
                    result['objectives']['Run'] = true;
            }

        });

    } // end of try
    catch (err) {
    }
    finally {

        result['completed'] = false;
        if (!result['objectives']['go']) {
            result.html += "You need a script to run when green flag clicked!";
            error_type = 1;
        }
        else if (num_blocks < 2) {
            result.html += "Add some blocks to the green flag script!";
            error_type = 1;
        }
        else if (!result['objectives']['pen down']) {
            result.html += "Make sure you put the pen down when drawing!<br>";
            error_type = 3;
        }
        else if (num_visited == 1) {
            result.html += "Now draw some lines!";
            error_type = 5;
        }
        else if (num_visited != 4) {
            result.html += "Almost there!  Draw all three lines!";
            error_type = 6;
        }
        else if (!result['objectives']['Run']) {
            result.html += "Make sure you test your program before clicking the green check.<br>";
            result.html += "Click the blue square then green flag to test your program!";
            error_type = 2;
        }
        else {
            result.html += "Good job! You've completed this task.";
            error_type = 0;
            result['completed'] = true;
        }
        result['error_type'] = error_type;
        return result;
    }
};
