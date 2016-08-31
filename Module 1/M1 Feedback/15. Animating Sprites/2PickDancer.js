// Author: ? and Diana Franklin
// Requirements:  Choose a dancer, make a script on sprite click,
// change costume 3 times (with two waits in between)
// Status: Removing old code
//

exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};
    result['objectives']['Run'] = false;
    result['completed'] = false;

    var sprite_names = ["Ballerina", "CoolGirl", "BreakDancer"];
    var sprite_name;

    var i;
    for (i = 0; i < sprite_names.length; i++) {
        sprite_name = sprite_names[i];
        result['objectives'][sprite_name] = {};
        result['objectives'][sprite_name]['clicked'] = false; // "When I am clicked" block
        result['objectives'][sprite_name]['costume3x'] = false; // 3 costume changes
        result['objectives'][sprite_name]['waits'] = false; // 2 waits in proper place
        result['objectives'][sprite_name]['nosetcostume'] = false; // costume not chosen
        result['objectives'][sprite_name]['doublecostume'] = false; // 2 costumes wout wait
        result['objectives'][sprite_name]['samecostume'] = false; // 2 same costumes in row
        result['objectives'][sprite_name]['initialize'] = false; // costume in get ready script
        result['objectives'][sprite_name]['complete'] = false; // completed this sprite
    }

    result.html = "";

    var not_tested = false;
    //var additional_blocks = false;

    i = 0;
    //var time_to_wait = false;
    var no_set_costume = false;

    var error_type = 0;
    result['error_type'] = 0;

    var waits = false;


    //###########################################################################//
    //Parse XML//

    try {
        // for each sprite
        xmlObj.project.stage[0].sprites[0].sprite.forEach(function (sprites) {
            var lastCostume = "";

            var time_to_wait = false; // this toggles - we look for costume, wait, costume, wait
            var index = sprite_names.indexOf(sprites.$.devName);
            // if this is one of the three dancers
            if (index > -1) {
                var num_waits = 0;
                var sprite = sprites.$.devName;
                sprite_name = sprite;
                var num_costumes = 0;
                // Costume changes
                sprites.scripts[0].script.forEach(function (scr) {
                    // need to choose on sprite click event
                    if (scr.block[0].$.s == "receiveClick" && scr.block[0].$.isInert == "false") {
                        // correct action
                        result['objectives'][sprite_name]['clicked'] = true;
                        //result.html += sprite_name + "Event<br>";
                        // for each block in the script
                        scr.block.forEach(function (blocks) {
                            //result.html += sprite_name + ": block "+blocks.$.s+"<br>";
                            if (blocks.$.s == "doSwitchToCostume") {
                                // if we were waiting for a wait, then flag mistake
                                if (time_to_wait) {
                                    //result.html += sprite_name + "double costume<br>";
                                    result['objectives'][sprite_name]['doublecostume'] = true;
                                    waits = false;
                                }

                                if (blocks.l[0]) {
                                    if (lastCostume == blocks.l[0]) {
                                        result['objectives'][sprite_name]['samecostume'] = true;
                                        //result.html += sprite_name + "same costume<br>";
                                    }
                                    num_costumes++;
                                    lastCostume = blocks.l[0];
                                }
                                else {
                                    no_set_costume = true;
                                    result['objectives'][sprite]['nosetcostume'] = true;
                                    //result.html += sprite_name + "no set costume<br>";
                                }

                                // changed costume 3 times
                                if (num_costumes >= 3) {
                                    result['objectives'][sprite_name]['costume3x'] = true;
                                    //result.html += sprite_name + "3x costume<br>";
                                }
                                // the next thing up is a wait
                                time_to_wait = true;
                            }
                            else if (blocks.$.s == "doWearNextCostume") {
                                //result.html += sprite_name + "next costume<br>";
                                if (time_to_wait) {
                                    //result.html += sprite_name + "double costume<br>";
                                    result['objectives'][sprite_name]['doublecostume'] = true;
                                    waits = false;
                                }
                                else {
                                    if (num_costumes >= 3)
                                        result['objectives'][sprite_name]['costume3x'] = true;
                                }
                                // the next thing up is a wait
                                time_to_wait = true;
                            }
                            // Check that there is a wait when you need one
                            else if (blocks.$.s == "doWait") {
                                if (time_to_wait) {
                                    num_waits++;
                                    time_to_wait = false;
                                    //result.html += sprite_name + " " + num_waits + " waits<br>";
                                }
                            }
                            else if (blocks.$.s = "doRepeat") {
                                var reps = parseInt(blocks.l[0]);
                                blocks.script.block.forEach(function (blocks) {
                                    //result.html += sprite_name + ": block "+blocks.$.s+"<br>";
                                    if (blocks.$.s == "doSwitchToCostume") {
                                        // if we were waiting for a wait, then flag mistake
                                        if (time_to_wait) {
                                            //result.html += sprite_name + "double costume<br>";
                                            result['objectives'][sprite_name]['doublecostume'] = true;
                                            waits = false;
                                        }

                                        if (blocks.l[0]) {
                                            if (lastCostume == blocks.l[0]) {
                                                result['objectives'][sprite_name]['samecostume'] = true;
                                                //result.html += sprite_name + "same costume<br>";
                                            }
                                            num_costumes++;
                                            lastCostume = blocks.l[0];
                                        }
                                        else {
                                            no_set_costume = true;
                                            result['objectives'][sprite]['nosetcostume'] = true;
                                            //result.html += sprite_name + "no set costume<br>";
                                        }

                                        // changed costume 3 times
                                        if (num_costumes >= 3) {
                                            result['objectives'][sprite_name]['costume3x'] = true;
                                            //result.html += sprite_name + "3x costume<br>";
                                        }
                                        // the next thing up is a wait
                                        time_to_wait = true;
                                    }
                                    else if (blocks.$.s == "doWearNextCostume") {
                                        //result.html += sprite_name + "next costume<br>";
                                        if (time_to_wait) {
                                            //result.html += sprite_name + "double costume<br>";
                                            result['objectives'][sprite_name]['doublecostume'] = true;
                                            waits = false;
                                        }
                                        else {
                                            num_costumes+= reps;
                                            if (num_costumes >= 3)
                                                result['objectives'][sprite_name]['costume3x'] = true;
                                        }
                                        // the next thing up is a wait
                                        time_to_wait = true;
                                    }
                                    // Check that there is a wait when you need one
                                    else if (blocks.$.s == "doWait") {
                                        if (time_to_wait) {
                                            num_waits+= reps;
                                            time_to_wait = false;
                                            //result.html += sprite_name + " " + num_waits + " waits<br>";
                                        }
                                    }

                                });
                            }
                        });// for each block in the script
                        if (waits && num_waits > 1) {
                            result['objectives'][sprite_name]['waits'] = true;
                        }
                    } // if it's a receive click script
                    // Initialization
                    else if (scr.block[0].$.s == "receiveGo" && scr.block[0].$.isFrozen == "false") {
                        //result.html += sprite_name + ": blue square!<br>";
                        scr.block.forEach(function (blocks) {

                            if (blocks.$.s == "doSwitchToCostume") {
                                //result.html += sprite_name + ": switch costume!<br>";
                                if (blocks.l[0]) {
                                    //result.html += sprite_name + ": costume!<br>";
                                    result['objectives'][sprite_name]['initialize'] = true;
                                }
                            }
                        });
                    }
                });
            }
        });//}
           // catch(err){}

        // Find the variable "tested"
        //try{
        xmlObj.project.variables[0].variable.forEach(function (v) {
            // Variable "tested": if 1 -> continue analysis, if 0 -> all false
            if (v.$.name == "tested") {
                if (v.l == "1")
                    result['objectives']['Run'] = true;
                else not_tested = true;
            }
        });

    }
    catch (err) {
    }
    finally {
        //###########################################################################//
        //Feedback//

        var any_complete = false;
        var progress = 0;
        // first print out errors, check for any completions
        for (i = 0; i < sprite_names.length; i++) {
            sprite_name = sprite_names[i];
            var complete = true;
            if (result['objectives'][sprite_name]['nosetcostume']) // costume not chosen
            {
                complete = false;
                result.html += sprite_name + ": Whoops! You forgot to choose a costume in your <b><i>switch to costume</i></b> block!<br>";
            }

            if (result['objectives'][sprite_name]['doublecostume']) // 2 costumes w/out wait
            {
                complete = false;
                result.html += sprite_name + ": Whoops!  You have two costume changes in a row without a <b><i>wait</i></b> in between!<br>  They are so fast that you won't be able to see the first one!<br>";
            }

            if (result['objectives'][sprite_name]['samecostume']) // 2 same costumes in row
            {
                complete = false;
                result.html += sprite_name + ": Whoops!  You used the same costume twice in a row!<br>";
            }

            // completed this sprite?
            complete = complete && result['objectives'][sprite_name]['costume3x'] &&
                //result['objectives'][sprite_name]['waits'] &&
                result['objectives'][sprite_name]['initialize'];
            if (complete) {
                result['objectives'][sprite_name]['complete'] = true;
                any_complete = true;
                result.html += sprite_name + ": <b>Completed!</b><br>";
            }
            else if (result['objectives'][sprite_name]['clicked']) {
                progress += 1 << i;
            }

        }

        // if there is one complete, then we're done
        if (any_complete) {
            result.html += "At least one is complete!<br>";
            result['completed'] = true;
            result['error_type'] = 0;
            return result;
        }
        // if none complete, report what is incomplete
        else if (progress == 0) {
            result.html += "Pick a dancer to program to dance!  You need 3 costume changes.  Don't forget to initialize!<br>";
        }
        else {
            result.html += "<i>You're not quite done - choose at least one to finish!</i><br>";
            for (i = 0; i < sprite_names.length; i++) {
                sprite_name = sprite_names[i];
                // if it has no script, then ignore
                if (!result['objectives'][sprite_name]['clicked']) {
                    // do nothing
                }
                else if (!result['objectives'][sprite_name]['costume3x']) {
                    result.html += sprite_name + ": Great start!  You need 3 costume change to complete the dance!<br>";
                }
                else if (!result['objectives'][sprite_name]['initialize']) {
                    result.html += sprite_name + ": Don't forget to initialize (blue square / get ready script)!<br>";
                }

            } // for each sprite

        } // at least one has been started

        result['error_type'] = error_type;
        return result;
    }
};

