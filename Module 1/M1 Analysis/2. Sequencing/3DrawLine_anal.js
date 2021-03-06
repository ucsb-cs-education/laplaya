//Modified 8/09 by Valerie

exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    var events = {};

    // Two objectives: Get ready script and green flag script!

    events['getready event'] = false; // receiveGo
    events.placeat = false;
    events.placeatdot = false;

    events.Run = false;

    events['greenflag event'] = false;
    events['pen down'] = false;
    events['glide block'] = false;
    events['glide to other dot'] = false;
    events.progress = 0;
    events['progress.txt'] = "";
    events.completed = false;
    events.html = "";


    result.html = "";

    //var error_type = 0;
    var start_dot = 0; // 0 = none, 1 = pink, 2 = blue
    var explain = "";
    var pendown = false;
    var i;
    var arg;

    events.checkError = " ";


    //###########################################################################//
    // Parse XML
    try {
        // see if scripts added match inert script
        xmlObj.project.stage[0].sprites[0].sprite.forEach(function (v) {
            events.html += "A";
            if (v.$.devName == "Alga") {
                events.html += "B";
                if (v.scripts[0]) {
                    events.html += "C";
                    v.scripts[0].script.forEach(function (scr) {
                        events.html += "D";
                        if ((scr.block.length >= 2) && (scr.block[0].$.isInert == "false")) { //not an inert script
                            events.html += "E";
                            // check the get ready script

                            if (scr.block[0].$.s == "receiveGo") {
                                //result.html += "Found the get ready script!";
                                //result.html +=  scr.block.length + "blocks<br>";
                                events['getready event'] = true;
                                // iterate through to be more flexible
                                // they might want to initialize pen color!
                                for (i = 1; i < scr.block.length; i++) {
                                    //result.html += "Block: " + scr.block[i].$.s + "<br>";
                                    // allow both glide to and place at for get ready script
                                    // OR operator does not work!!!
                                    if (scr.block[i].$.s == "doSpeedGlidetoObject") {
                                        explain = "The <b><i>glide to</i></b> block is too slow for the <b><i>Get Ready</i></b> script!  Use <b><i>place at</i></b> instead.";
                                    }
                                    else if (scr.block[i].$.s == "doGotoObject") {
                                        //result.html += "Found glide or place<br>";
                                        if (events.placeat !== true) {
                                            arg = 1;
                                            if (scr.block[i].$.s == "doGotoObject")
                                                arg = 0;
                                            events.placeat = true;
                                            if (scr.block[i].l[arg] == "Blue Dot") {
                                                start_dot = 2;
                                                events.placeatdot = true;
                                            }
                                            else if (scr.block[i].l[arg] == "Pink Dot") {
                                                start_dot = 1;
                                                events.placeatdot = true;
                                            }
                                            else
                                                explain = "Choose and set a starting dot!";
                                        } // if placeat was not true
                                        else // if this is the 2nd place/glide block!
                                        {
                                            events.placeatdot = false;
                                            explain = "Only place or glide once in the get ready script.";
                                        }
                                    } // if doGotoObject
                                    else if (scr.block[i].$.s == "down") {
                                        pendown = true;
                                        events['pen down'] = true;
                                    }
                                    else if (scr.block[i].$.s == "up")
                                        pendown = false;
                                } // end for each block in script
                            } // end of get ready script


                            /* ***** Diana - need to add flexibility for where pen down is */
                            /* Need to test green flag script */

                            // green flag script
                            else if ((scr.block[0].$.s == "getReady") && (explain === "")) {
                                events.html += "F";
                                events['greenflag event'] = true;
                                // iterate through to be more flexible
                                // they might want to put pen down in get ready script!
                                for (i = 1; i < scr.block.length; i++) {
                                    events.html += "G";
                                    //result.html += "Block: " + scr.block[i].$.s + "<br>";
                                    // if pen down, record pen is down
                                    if (scr.block[i].$.s == "down") {
                                        events.html += "H";
                                        events['pen down'] = true;
                                        pendown = true;
                                    }
                                    // if pen is picked up, record
                                    else if (scr.block[i].$.s == "up")
                                        pendown = false;
                                    // if it is cleared after glide, discount glide
                                    else if (scr.block[i].$.s == "clear") {
                                        if (events['glide to other dot'] === true) {
                                            events['glide to other dot'] = false;
                                            explain = "Oh, no!  You erased the line!";
                                        }
                                    }
                                    else if ((scr.block[i].$.s == "doGotoObject") ||
                                        (scr.block[i].$.s == "doSpeedGlidetoObject")) {
                                        events.html += "I";
                                        arg = 1;
                                        if (scr.block[i].$.s == "doGotoObject")
                                            arg = 0;
                                        events['glide block'] = true;
                                        if (pendown === true) {
                                            events.html += "J";
                                            if (scr.block[i].l[arg] == "Blue Dot") {
                                                if (start_dot != 2)
                                                    events['glide to other dot'] = true;
                                                else
                                                    explain = "Choose a different dot than the starting dot!";
                                            } // blue dot glide
                                            else if (scr.block[i].l[arg] == "Pink Dot") {
                                                events.html += "K";
                                                if (start_dot != 1)
                                                    events['glide to other dot'] = true;
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
                            events.html += "L";
                            if (scr.block[0].$.s == "getReady" && scr.block[0].$.isInert == "false") {
                                events.html += "M";
                                events['correct event'] = true;
                                if (scr.block[1].$.s == "down") {
                                    events.html += "N";
                                    events['pen down'] = true;
                                }
                                if (scr.block[2]) {
                                    if (scr.block[2].$.s == "doSpeedGlidetoObject") {
                                        events.html += "O";
                                        events['glide block'] = true;
                                        if (scr.block[2].l[1] == "Blue Dot") {
                                            events['glide to blue dot'] = true;
                                            events.html += "P";
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            }
        });

        // see if project was tested before green check mark was clicked
        xmlObj.project.variables[0].variable.forEach(function (v) {

            // Variable "tested": if 1 -> continue analysis, if 0 -> all false
            if (v.$.name == "tested") {
                if (v.l == "1")
                    events.Run = true;
            }
        });
    }
    catch (err) {
        events.checkError = "ERROR";
    }
    finally {
        //###########################################################################//
        // Determine whether activity in completed

        var completed = true;
        for (var property in events) {
            if (events[property] !== true) {
                completed = false;
            }
        }
        events.completed = completed;

        //###########################################################################//
        // Feedback strings
        //error_type = -1;
        // print out errors for the get ready script
        if (!events['getready event']) {
            events.progress = 0;
            events['progress.txt'] = "no blue square block\n";
        }
        else if (!events.placeat) {
            events.progress = 1;
            events['progress.txt'] += "has blue square\n";
        }
        else if (!events.placeatdot) {
            events.progress = 2;
            events['progress.txt'] += "has place at\n";
        } else {
            events.progress = 3;
            events['progress.txt'] += "correct blue flag script\n";
        }
        // if there were no errors in get ready script, check green flag
        //else
        //{
        // print out errors for the green flag script
        if (!events['greenflag event']) {
            events['progress.txt'] += "no green flag\n";
        }
        else if (!events['pen down']) {
            events.progress += 4;
            events['progress.txt'] += "has green flag but no pen down\n";
        } else if (!events['glide block']) {
            events.progress += 8;
            events['progress.txt'] += "pen down but no glide block \n";
        }
        else if (!events['glide to other dot']) {
            events.progress += 16;
            events['progress.txt'] += "has glide block but doesn't go to a new dot\n";
        } else {
            events.progress += 32;
            events['progress.txt'] = "correct green flag script\n";
        }

        // if (!events.Run){
        //   events.progress =  8;
        //   events['progress.txt'] = "moved Alga twice";
        // }
        // else
        // {
        //   events.progress = 9;
        //   events['progress.txt'] += "tested";
        //   completed = true;
        // }

        if (events.progress == 35) {
            events.completed = true;
            events['progress.txt'] = "done";
        }


        // If all objectives are completed, result.completed = true
        result.results = events;
        return result;
    }
};


