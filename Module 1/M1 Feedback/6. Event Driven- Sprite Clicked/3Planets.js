//-------------------------------------------------------------------
// This software is intended to test the correctness of LaPlaya  
// selfSprite_03_student completed by students of KELP CS. 
//
// processor_planets.js
//
// Created by Logan Ortega and Jenny So [6 August 2014]
//Edited by Iris-Eleni Moridis
//-------------------------------------------------------------------

// EDITS BY Iris-Eleni Moridis
// Notes: Left all objectives and feedback
// changed analysis to be shorter and less repetitive.
// Fixed issues with feedback and incorrect analysis.
// Rewrote feedback section to be cleaner.


exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    result['objectives']['Run'] = false;
    result['completed'] = false;
    result['error_type'] = 5;
    result.html = "";

    // All planets have say block after being clicked and with correct spelling
    // can we do a for loop?
    var planet_names = Array("Sun", "Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune");
    for (var i = 0; i < planet_names.length; i++) {
        planet_name = planet_names[i];
        result['objectives'][planet_name] = {};
        result['objectives'][planet_name]['clicked'] = false; // "When I am clicked" block
        result['objectives'][planet_name]['say'] = false; // "Say X for Y seconds" block
        result['objectives'][planet_name]['spell'] = false; // correct spelling of planet
    }

    try {

        function checkPlanet(spriteName, script) {
            result['objectives'][spriteName]['clicked'] = true;
            for (var i = 1; i < script.length; i++) {
                var block = script[i];
                var name = block.$.s;
                if (name == "doSayFor") {
                    result['objectives'][spriteName]['say'] = true;
                    if (block.l[0].toLowerCase() == spriteName.toLowerCase())
                        result['objectives'][spriteName]['spell'] = true;
                }
            }
        } // end function


        // Check all planets
        xmlObj.project.stage[0].sprites[0].sprite.forEach(function (v) {
            sprite_name = v.$.devName;
            var index = planet_names.indexOf(sprite_name);
            // if it is a planet
            if (index > -1) {
                v.scripts[0].script.forEach(function (w) {
                    if (w.$.visibleScript == "true" && w.block[0].$.s == "receiveClick") {
                        checkPlanet(sprite_name, w.block);
                    } // if it is the receiveClick script
                }); // for each script in planet
            } // if it is a planet
        }); // for each sprite


    } // end try
    catch (err) {
    }
    finally {

        //result['completed'] = false;
        result['completed'] = true;
        var num_complete = 0;
        var num_planets = planet_names.length;
        for (var i = 0; i < num_planets; i++) {
            var planet_name;
            planet_name = planet_names[i];
            if (!result['objectives'][planet_name]['spell']) {
                result['completed'] = false;
                if (!result['objectives'][planet_name]['clicked'])
                    result.html += "***Create a script that happens <b>when " + planet_name + " is clicked</b><br>";
                else if (!result['objectives'][planet_name]['say'])
                    result.html += "***Great!  Now add a block that will make " + planet_name + " say its name!<br>";
                else //if (!result['objectives'][planet_name]['spell'])
                    result.html += "***Check the spelling of planet " + planet_name + "!<br>";
            }
            else
                num_complete = num_complete + 1;
        }

        if (num_complete < 4)
            result.html += "<br>***Hint: You can copy a script from one sprite to another by dragging the script from one sprite into the picture of another sprite in the sprite list (lower right-hand corner).";
        else {
            result.html += "Good job!";
            result['completed'] = true;
        }

        result['error_type'] = 5;
        return result;
    }
};
