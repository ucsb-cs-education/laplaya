// Author: Diana
// Notes: Need to add in the "Run" check.

exports.process = function (xmlObj) {
    var result = {};
    result["completed"] = false;
    result["penDown"] = false;
    result["order"] = false;

    result['objectives'] = {};
    result['objectives']['getready event'] = false; // receiveGo
    result['objectives']['placeat'] = false;
    result['objectives']['placeatdot'] = false;

    result['objectives']['Run'] = false;

    result['objectives']['greenflag event'] = false;
    result['objectives']['pen down'] = false;
    result['objectives']['glide block'] = false;
    result['objectives']['glide to other dot'] = false;

    result.html = "";

    var correct_event = false;
    result['error_type'];
    var error_type;
    var pendown = false;

    var order = Array("Dark Green", "Dark Blue", "Purple", "Yellow", "Light Blue", "Red", "Light Green", "Brown");

    var num_dots = order.length;
    var num_visited = 0;
    var direction = 0;
    var start_dot = -1;

    try {
        // go through the first time and look for the starting point
        xmlObj.project.stage[0].sprites[0].sprite.forEach(function (v) {
            if (v.$.devName == "Pen") {
                if (v.scripts) {
                    v.scripts[0].script.forEach(function (c) {
                        if (c.block[0].$.s == "receiveGo") {
                            //result.html = "getready...<br>";
                            result['objectives']['getready event'] = true;
                            for (var i = 1; i < c.block.length; i++) {
                            //result.html += "block "+i+"<br>";
                                var block = c.block[i];
                                var name = c.block[i].$.s;
                                //result.html += block + name + "<br>";
                                if (name == "down") {
                                    result['objectives']['pen down'] = true;
                                    pendown = true;
                                }
                                else if (name == "up") {
                                    pendown = false;
                                }
                                else if (name == "doSpeedGlidetoObject") {
                                    result.html = "<b><i>Glide</i></b> is too slow for the get ready script<br>";
                                    return result;
                                }
                                else if (name == "doGotoObject") {
                                    if (result['objectives']['placeat'] == true) {
                                        result.html = "Use only one <b><i>place at</i></b> block in the get ready script.<br>";
                                        return result;
                                    }
                                    result['objectives']['placeat'] = true;
                                    var dotname = c.block[i].l[0];
                                    // set the position of the starting point for drawing the cat
                                    for (var j = 0; j < order.length; j++) {
                                        //result.html += "Compare "+order[j]+" and "+dotname+"<br>";
                                        if (order[j] == dotname) {
                                            start_dot = j + order.length;
                                            result['objectives']['placeatdot'] = true;
                                            //result.html += "Start dot: "+j+"<br>";
                                        }
                                    } // for each dot name in order
                                } // for the place at block
                            } // for each block
                        } // the get ready script
                        result.html += "Great <b><i>Get Ready</i></b> script!<br>";
                        if (c.block[0].$.s == "getReady") {
                            result['objectives']['greenflag event'] = true;
                            var pos = 0;
                            var backPos = 0;
                            for (var i = 1; i < c.block.length; i++) {
                                var block = c.block[i];
                                var name = c.block[i].$.s;
                                if (name == "down") {
                                    result['objectives']['pen down'] = true;
                                    pendown = true;
                                }
                                else if (name == "up")
                                    pendown = false;
                                else if (name == "doSpeedGlidetoObject") {
                                    if (!pendown) {
                                        result.html += "Make sure you have the pen down when you move!<br>";
                                        return result;
                                    }
                                    var dotname = block.l[1];
                                    // if this is our first, determine the direction
                                    if (num_visited == 0) {
                                        var next = (start_dot + 1) % (num_dots);
                                        var prev = (start_dot - 1) % (num_dots);
                                        //result.html += "Compare "+order[next]+" and "+dotname+" and "+order[prev]+"<br>";
                                        if (order[next] == dotname) {
                                            direction = 1;
                                            num_visited = 1;
                                            //result.html += "next!";
                                        }
                                        else if (order[prev] == dotname) {
                                            direction = -1;
                                            num_visited = 1;
                                            //result.html += "prev!";
                                        }
                                        else {
                                            result.html += "Check where the first <b><i>glide</i></b> block in your green flag script is going.<br>"
                                            return result;
                                        }
                                    }
                                    else if (num_visited < num_dots)// if num_visited > 1
                                    {
                                        var visited = num_visited + 1;
                                        var dot_pos = (start_dot + visited * direction) % num_dots;
                                        //result.html += "Compare "+order[dot_pos]+" and "+dotname+"<br>";
                                        if (order[dot_pos] != dotname) {
                                            result.html += "Great start!  Check where your glide blocks are going!<br>"; // ("+num_visited+","+dot_pos+")<br>";
                                            return result;
                                        }
                                        num_visited = visited;
                                    }
                                } // if glide block
                            } // for each block in the script
                        } // the green flag script
                    }); // for each script
                } // if it has scripts
            } // pen sprite
        }); // for each sprite

        // see if project was tested before green check mark was clicked
        xmlObj.project.variables[0].variable.forEach(function (v) {

            // Variable "tested": if 1 -> continue analysis, if 0 -> all false
            if (v.$.name == "tested") {
                if (v.l == "1")
                    result['objectives']['Run'] = true;
            }
        }); // for each variable (check for tested)

    }
    catch (err) {
    }
    finally {

        if (!result['objectives']['getready event']) {
            result.html += "Make a <b><i>Get Ready</i></b> script to start Alga on a dot!<br>";
            error_type = 1;
        }
        else if (!result['objectives']['placeat']) {
            result.html += "Great start!  Place Alga on a dot!";
            error_type = 2;
        }
        else if (!result['objectives']['placeatdot']) {
            result.html += "Good!  Now fill in where you want Alga to be placed!";
            error_type = 3;
        }
        // if there were no errors in get ready script, check green flag
        else {
            // print out errors for the green flag script
            if (!result['objectives']['greenflag event']) {
                result.html += "Now make a green flag script!";
                error_type = 1;
            }

            else if (!result['objectives']['pen down']) {
                result.html += "How do you make it draw?";
                error_type = 3;
            }
            else if (num_visited < num_dots) {
                result.html += "<b><i>Green flag</i></b> script works so far!  Keep going!";
                error_type = 4;
            }
            else if (!result['objectives']['Run']) {
                result.html += "Test your program before clicking the green check mark!<br>Click <b>blue square</b> then <b>green flag</b>!";
                error_type = 7;
            }
            else if (num_visited >= num_dots) {
                result["completed"] = true;
                error_type = 0;
            }
        } // end of else look at the green flag script
        result['error_type'] = error_type;
        return result;
    }
};
