exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    // Only one objective for Animal Maze (get all the honey pots)
    result['objectives']['Run'] = false;
    result['objectives']['Complete'] = false;
    result.html = "";

    var error_type = 0;
    result['error_type'] = 0;

    var not_completed = false;
    var not_tested = false;

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
                    result.html += "Good job! You've completed this task.";
                }
                else {
                    not_completed = true;
                }
            }
        });
    }
    catch (err) {
    }

    if (not_completed) {
        error_type = 1;
        result.html += "Double check your work and make sure everything is looking good! You have to draw multiple costumes and change the sprite's costume, keep trying!";

    }
    else if (not_tested) {
        error_type = 2;
        result.html += "Remember to test your scripts before checking your work!";

    }

    // If all objectives are completed, result.completed = true
    var completed = true;
    for (var property in result['objectives']) {
        if (result['objectives'][property] != true) {
            completed = false;
        }
    }
    result['completed'] = completed;

    result['error_type'] = error_type;
    return result;

};

