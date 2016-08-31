// Authors: many. Logan, Kenyon, then Iris.
// Notes: needs some cleaning up. Will return to this if there is time. Appropriate edits/changes have been made (by Iris) until then.

exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    // Only one objective for Animal Maze (get all the honey pots)
    result['objectives']['Run'] = false;
    result['objectives']['Complete'] = false;
    result['objectives']['left event'] = false;
    result['objectives']['right event'] = false;
    result.html = "";

    // The Key Press event is used
    var left_event = false;
    var right_event = false;

    //The event type matches the direction of movement
    var left_match = false;
    var right_match = false;

    var vertical = false;

    result['error_type'];
    var error_type = 0;

    try {
        xmlObj.project.stage[0].sprites[0].sprite.forEach(function (v) {
            if (v.$.devName == "Basket") {
                v.scripts[0].script.forEach(function (w) {
                    if (w.block[0].$.s == "receiveKey" && w.block[0].l[0].option[0] == "left arrow") {
                        left_event = true;
                        if (w.block[1] && w.block[1].$.s == "doGlideDirection") {
                            if (w.block[1].l[1] == "left") {
                                result['objectives']['left event'] = true;
                                left_match = true;
                            }
                        }
                        else if (w.block[1].$.s == "setHeading") {
                            if (w.block[1].l[0] == "left") {
                                left_match = true;
                                if (w.block[2].$.s == "doSpeedGlideSteps" || (w.block[2].$.s == "doGlideDirection" && w.block[2].l[1] == "left"))
                                    result['objectives']['left event'] = true;
                            }
                        }

                    }
                    if (w.block[0].$.s == "receiveKey" && w.block[0].l[0].option[0] == "right arrow") {
                        right_event = true;
                        if (w.block[1] && w.block[1].$.s == "doGlideDirection") {
                            if (w.block[1].l[1] == "right") {
                                result['objectives']['right event'] = true;
                                right_match = true;
                            }
                        }
                        else if (w.block[1].$.s == "setHeading") {
                            if (w.block[1].l[0] == "right") {
                                right_match = true;
                                if (w.block[2].$.s == "doSpeedGlideSteps" || (w.block[2].$.s == "doGlideDirection" && w.block[2].l[1] == "right"))
                                    result['objectives']['right event'] = true;
                            }
                        }

                    }
                    else if (w.block[0].$.s == "receiveKey" && ( w.block[0].l[0].option[0] == "down arrow" || w.block[0].l[0].option[0] == "up arrow")) {
                        vertical = true;
                    }


                });

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


        if (!left_event) {
            error_type = 1;
            if (!right_event) result.html = "Be sure to add scripts before checking your work! You want to make the basket move to the right when the right arrow key is pressed and to the left when the left arrow key is pressed. That way, you can make the basket glide to the left and right to catch the falling apples. Keep trying!";
            else result.html = "Great start, you added to correct event to make the basket move to the right. Now add one that will move the basket to the left when the left arrow key is pressed. Keep trying!";
        }
        else if (!right_event) {
            error_type = 1;
            result.html = "Great start, you added to correct event to make the basket move to the left. Now add one that will move the basket to the right when the right arrow key is pressed. Keep trying!";
        }
        else if (!left_match) {
            error_type = 16;
            if (!right_match) result.html = "You have the right events for both the right arrow key and the left arrow key! Now it looks like you are not making the basket glide to the right when the right arrow key is clicked, and to the left when the left arrow key is clicked. Program the basket to move with the arrow keys and check your work again. Keep trying, you're off to a great start!";
            else result.html = "You got the basket to move to the right with the right arrow key, now you must do the same to the left! Make the basket move to the left when the left arrow key is pressed. Keep trying, you're almost done!";
        }
        else if (!right_match) {
            error_type = 16;
            result.html = "You got the basket to move to the left with the left arrow key, now you must do the same to the right! Make the basket move to the right when the right arrow key is pressed. Keep trying, you're almost done!";
        }
        else if (!result['objectives']['Run']) {
            error_type = 2;
            result.html = "Remember to test your scripts before checking your work! This is the last step, great work so far!";
        } else {
            error_type = 0;
            result.html = "completed";
        }

        result['error_type'] = error_type;
        return result;
    }
};

