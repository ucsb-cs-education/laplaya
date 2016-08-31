exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    // Two objectives: Get ready script and green flag script!

    result['objectives']['getready event'] = false; // receiveGo
    result['objectives']['placeat'] = false;
    result['objectives']['placeatdot'] = false;

    result['objectives']['Run'] = false;

    result['objectives']['greenflag event'] = false;
    result['objectives']['pen down'] = false;
    result['objectives']['glide block'] = false;
    result['objectives']['glide to other dot'] = false;

    result['completed'] = false;
    result['error_type'];
    result.html = "";

    var error_type = 0;
    var start_dot = 0; // 0 = none, 1 = pink, 2 = blue
    var explain = "";
    var pendown = false;


    //###########################################################################//
    // Parse XML
    try {
        // see if scripts added match inert script
        xmlObj.project.stage[0].sprites[0].sprite.forEach(function (v) {
            if (v.$.devName == "Alga") {
                v.scripts[0].script.forEach(function (scr) {
                    // check the get ready script
                    if (scr.block[0].$.s == "receiveGo") {
//result.html += "Found the get ready script!";
//result.html +=  scr.block.length + "blocks<br>";
                        result['objectives']['getready event'] = true;
                        // iterate through to be more flexible
                        // they might want to initialize pen color!
                        for (var i = 1; i < scr.block.length; i++) {
                            //result.html += "Block: " + scr.block[i].$.s + "<br>";
                            // allow both glide to and place at for get ready script
                            // OR operator does not work!!!
                            if (scr.block[i].$.s == "doSpeedGlidetoObject") {
                                explain = "The <b><i>glide to</i></b> block is too slow for the <b><i>Get Ready</i></b> script!  Use <b><i>place at</i></b> instead.";
                            }
                            else if (scr.block[i].$.s == "doGotoObject") {
//result.html += "Found glide or place<br>";
                                if (result['objectives']['placeat'] != true) {
                                    var arg = 1;
                                    if (scr.block[i].$.s == "doGotoObject")
                                        arg = 0;
                                    result['objectives']['placeat'] = true;
                                    if (scr.block[i].l[arg] == "Blue Dot") {
                                        start_dot = 2;
                                        result['objectives']['placeatdot'] = true;
                                    }
                                    else if (scr.block[i].l[arg] == "Pink Dot") {
                                        start_dot = 1;
                                        result['objectives']['placeatdot'] = true;
                                    }
                                    else
                                        explain = "Choose and set a starting dot!";
                                } // if placeat was not true
                                else // if this is the 2nd place/glide block!
                                {
                                    result['objectives']['placeatdot'] = false;
                                    explain = "Only place or glide once in the get ready script.";
                                }
                            } // if doGotoObject
                            else if (scr.block[i].$.s == "down") {
                                pendown = true;
                                result['objectives']['pen down'] = true;
                            }
                            else if (scr.block[i].$.s == "up")
                                pendown = false;
                        } // end for each block in script
                    } // end of get ready script

                    /* ***** Diana - need to add flexibility for where pen down is */
                    /* Need to test green flag script */

                    // green flag script
                    else if ((scr.block[0].$.s == "getReady") && (explain == "")) {
                        result['objectives']['greenflag event'] = true;
                        // iterate through to be more flexible
                        // they might want to put pen down in get ready script!
                        for (var i = 1; i < scr.block.length; i++) {
                            //result.html += "Block: " + scr.block[i].$.s + "<br>";
                            // if pen down, record pen is down
                            if (scr.block[i].$.s == "down") {
                                result['objectives']['pen down'] = true;
                                pendown = true;
                            }
                            // if pen is picked up, record
                            else if (scr.block[i].$.s == "up")
                                pendown = false;
                            // if it is cleared after glide, discount glide
                            else if (scr.block[i].$.s == "clear") {
                                if (result['objectives']['glide to other dot'] == true) {
                                    result['objectives']['glide to other dot'] = false;
                                    explain = "Oh, no!  You erased the line!";
                                }
                            }
                            else if ((scr.block[i].$.s == "doGotoObject") ||
                                (scr.block[i].$.s == "doSpeedGlidetoObject")) {
                                var arg = 1;
                                if (scr.block[i].$.s == "doGotoObject")
                                    arg = 0;
                                result['objectives']['glide block'] = true;
                                if (pendown == true) {
                                    if (scr.block[i].l[arg] == "Blue Dot") {
                                        if (start_dot != 2)
                                            result['objectives']['glide to other dot'] = true;
                                        else
                                            explain = "Choose a different dot than the starting dot!";
                                    } // blue dot glide
                                    else if (scr.block[i].l[arg] == "Pink Dot") {
                                        if (start_dot != 1)
                                            result['objectives']['glide to other dot'] = true;
                                        else
                                            explain = "Choose a different dot than the starting dot!";
                                    } // pink dot glide
                                    else
                                        explain = "Make sure you choose where to glide to!";
                                } // end of if pen is down
                                else // if pen is not down yet, ...
                                {
                                    explain = "Make sure the pen is down <i><b>before</b></i> moving Alga!";
                                }
                            } // glide to
                        } // for each block
                    } // green flag script


                    if (scr.block[0].$.s == "getReady" && scr.block[0].$.isInert == "false") {
                        result['objectives']['correct event'] = true;
                        if (scr.block[1].$.s == "down")  result['objectives']['pen down'] = true;
                        if (scr.block[2].$.s == "doSpeedGlidetoObject") {
                            result['objectives']['glide block'] = true;
                            if (scr.block[2].l[1] == "Blue Dot")
                                result['objectives']['glide to blue dot'] = true;
                        }

                    }
                });

            }
        });

        // see if project was tested before green check mark was clicked
        xmlObj.project.variables[0].variable.forEach(function (v) {

            // Variable "tested": if 1 -> continue analysis, if 0 -> all false
            if (v.$.name == "tested") {
                if (v.l == "1")
                    result['objectives']['Run'] = true;
            }

        });
    }
    catch (err) {
    }
    finally {
        //###########################################################################//
        // Determine whether activity in completed

        var completed = true;
        for (var property in result['objectives']) {
            if (result['objectives'][property] != true) {
                completed = false;
            }
        }

        //###########################################################################//
        // Feedback strings
        error_type = -1;
        // print out errors for the get ready script
        if (!result['objectives']['getready event']) {
            result.html += "Make a getReady script to start Alga on a dot!<br>";
            error_type = 1;
        }
        else if (!result['objectives']['placeat']) {
            result.html += "Great start!  Place Alga on a dot!";
            result.html += explain;
            error_type = 2;
        }
        else if (!result['objectives']['placeatdot']) {
            result.html += explain;
            error_type = 3;
        }
        // if there were no errors in get ready script, check green flag
        else {
            result.html += "Great GetReady script!<br>";
            // print out errors for the green flag script
            if (!result['objectives']['greenflag event']) {
                result.html += "Now make a script that will draw a line when green flag pressed!";
                error_type = 4;
            }
            else if (!result['objectives']['pen down']) {
                result.html += "Good start on the green flag script.  To draw, you need to put the pen down!";
                error_type = 5;
            }
            else if (!result['objectives']['glide block']) {
                result.html += "Great! To draw the line, move Alga to the other dot!";
                error_type = 6;
            }
            else if (!result['objectives']['glide to other dot']) {
                result.html += "Almost done!";
                // this was more complex, so explanation is tailored
                result.html += explain;
                error_type = 7;
            }
        } // if there were no errors in get ready script, check green flag
        if (error_type == -1) {
            if (!result['objectives']['Run']) {
                result.html = "If you are finished, make sure you test it before clicking the green check button!";
                error_type = 8;
            }
            else {
                result.html = "Good job! You have completed this task";
                error_type = 0;
                completed = true;
            }
        }
        // If all objectives are completed, result.completed = true
        result['error_type'] = error_type;
        result['completed'] = completed;

        return result;
    }
};


