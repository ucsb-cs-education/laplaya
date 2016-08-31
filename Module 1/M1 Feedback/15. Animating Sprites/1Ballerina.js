exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    // Only one objective for Animal Maze (get all the honey pots)
    result['objectives']['Run'] = false;
    result['objectives']['Initialize on Receive Go'] = false;
    result['objectives']['initialize correct costume'] = false;

    result['objectives']['Action on receive Click'] = false;
    result['objectives']['Switch costume at least 3 times'] = false;
    result['objectives']['waits completed'] = true;

    result.html = "";

    var not_tested = false;
    var not_completed = false;
    var additional_blocks = false;

    var i = 0;
    var costumes = new Array();
    var time_to_wait = false;
    var no_set_costume = false;

    var error_type;
    result['error_type'];

    //###########################################################################//
    //Parse XML//

    try {
        xmlObj.project.stage[0].sprites[0].sprite.forEach(function (sprites) {
            if (sprites.$.devName == "Ballerina") {
                // Costume changes
                sprites.scripts[0].script.forEach(function (scr) {
                    if (scr.block[0].$.s == "receiveClick" && scr.block[0].$.isInert == "false") {
                        result['objectives']['Action on receive Click'] = true;
                        scr.block.forEach(function (blocks) {
                            if (blocks.$.s == "doSwitchToCostume") {
                                if (i < 2) time_to_wait = true;
                                if (blocks.l[0]) costumes[i] = blocks.l[0];
                                else no_set_costume = true;
                                console.log(costumes[i]);
                                i++;
                            }
                            if (time_to_wait) { // Check that there is a wait when you need one
                                if (blocks.$.s == "doWait") {
                                    result['objectives']['waits completed'] = true;
                                    time_to_wait = false;
                                }
                                else result['objectives']['waits completed'] = false;
                            }
                        });
                    }
                    // Ballerina Initialization
                    if (scr.block[0].$.s == "receiveGo" && scr.block[0].$.isInert == "false") {
                        result['objectives']['Initialize on Receive Go'] = true;

                        if (scr.block[1].$.s == "doSwitchToCostume") {
                            if (scr.block[1].l[0] == "stand")
                                result['objectives']['initialize correct costume'] = true;
                        }
                        // No additional blocks in initialization section
                        if (scr.block[2]) additional_blocks = true;//console.log("You added too much!");
                    }

                });
            }
        });
    }
    catch (err) {
    }

    // Find the variable named "completed" or "tested"
    try {
        xmlObj.project.variables[0].variable.forEach(function (v) {
            // Variable "tested": if 1 -> continue analysis, if 0 -> all false
            if (v.$.name == "tested") {
                if (v.l == "1")
                    result['objectives']['Run'] = true;
                else {

                    not_tested = true;

                }
            }
            // Variable "completed": if 1 -> true, 0 -> false
            else if (v.$.name == "completed") {
                if (v.l == "1") {
                    result['objectives']['Complete'] = true;
                    //result.html = "Good job! You've completed this task.";
                }
                else {

                    not_completed = true;

                }
            }
        });

    }
    catch (err) {
    }
    finally {
        if (costumes.length >= 3)
            result['objectives']['Switch costume at least 3 times'] = true;

        //###########################################################################//
        // Feedback
        if (!result['objectives']['Initialize on Receive Go']) {
            error_type = 1;
            result.html = "To get started, you must use the button with the blue square to initialize the ballerina. If you need help, check the white script that starts with 'When Blue Square Clicked'. To initialize the ballerina, you need to copy it. Keep going!";
        }
        else if (!result['objectives']['initialize correct costume']) {
            error_type = 20;
            result.html = "When you initialize the ballerina, be sure to put her in the standing position! Use the 'switch to costume ' block and select stand. Use the white script as an example! Keep trying!";
        }
        else if (additional_blocks) {
            error_type = 6;
            result.html = "Great work so far! You only need the 'switch to costume' block in the initialization, so remove any additional blocks and then make your ballerina dance!";
        }
        else if (!result['objectives']['Action on receive Click']) {
            error_type = 1;
            result.html = " Great work so far! Now, it's time to make the ballerina dance! Use the 'When Ballerina Clicked' event and then change her costume! We only want her to dance after she is clicked. Look at the white script that starts with 'When Ballerina Clicked' as an example.";
        }
        else if (no_set_costume) {
            error_type = 21;
            result.html = "Don't forget to pick a costume to make the ballerina switch to! ";
        }
        else if (costumes.length < 3) {
            error_type = 24;
            result.html = "Great start, you are initializing the ballerina correctly and using the right event. Now, to complete this task, you have to change the ballerina's costume at least 3 times. Check the white script as an example, and keep going! You're almost done!";
        }
        else if (!result['objectives']['waits completed']) {
            error_type = 25;
            result.html = " After every costume change, make sure there is a 'wait' block so that the sprite has time to show you the changed costume. Keep going! You're so close!";
        }
        else if (not_tested) {
            error_type = 2;
            result.html = "If you are finished, make sure you test it before clicking the green check button!";

        }
        // If all objectives are completed, result.completed = true
        var completed = true;
        for (var property in result['objectives']) {
            if (result['objectives'][property] != true) {
                completed = false;
            }
        }
        if (no_set_costume) completed = false;
        else if (completed) error_type = 0;

        result['completed'] = completed;

        result['error_type'] = error_type;
        return result;
    }
};
