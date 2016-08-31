// Author Iris-Eleni Moridis
// Original is at the bottom.

exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};
    result['error_type'];
    // tested
    result['objectives']['Run'] = false;


    // Variables

    result.html = "";

    var error_type;
    //####################################################################//
    //Initialize arrays
    //"Key 7 (Gb)","Key 8 (G)","Key 9 (Ab)","Key 10 (A)","Key 11 (Bb)","Key 12 (B)"];
    //var note_names = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
    var note_names = ["C", "D", "E", "F", "G", "A", "B"];
    //var note_nums = [60,62,64,65,67,69,71];
    var key_names = ["a", "w", "s", "e", "d", "h", "u", "j", "i", "k", "o", "l"];
    var keys_to_notes = {};
    keys_to_notes["a"] = "C";
    keys_to_notes["w"] = "Db";
    keys_to_notes["s"] = "D";
    keys_to_notes["e"] = "Eb";
    keys_to_notes["d"] = "E";
    keys_to_notes["h"] = "F";
    keys_to_notes["u"] = "Gb";
    keys_to_notes["j"] = "G";
    keys_to_notes["i"] = "Ab";
    keys_to_notes["k"] = "A";
    keys_to_notes["o"] = "Bb";
    keys_to_notes["l"] = "B";


    for (var i = 0; i < key_names.length; i++) {
        var key_name = key_names[i];
        result['objectives'][key_name] = {};
        result['objectives'][key_name]['double'] = false; // "When I am clicked" block
        result['objectives'][key_name]['event'] = false; // "When I am clicked" block
        result['objectives'][key_name]['play'] = false; // "Say X for Y seconds" block
        result['objectives'][key_name]['note'] = false; // correct spelling of key
    }


    //####################################################################//
    // Parse XML file
    try {
        // try looking at the scripts of the stage!
        xmlObj.project.stage[0].scripts[0].script.forEach(function (scr) {
            eventname = scr.block[0].$.s;
            if (eventname == "receiveKey") {
                // read what key
                var key = scr.block[0].l[0].option[0];
                var index = key_names.indexOf(key);
                //result.html += "Key: "+key+", index: "+index;
                if (index >= 0) {
                    var note = keys_to_notes[key];

                    //result.html += "Note: "+note;
                    if (result['objectives'][key]['event']) {
                        result['objectives'][key]['double'] = true;
                        //result.html += "double";
                    }
                    else {
                        result['objectives'][key]['event'] = true;
                        // now check for play note
                        if (scr.block[1].$.s == "doPlayNote") {
                            //result.html += ", doPlayNote";
                            result['objectives'][key]['play'] = true;
                            if (scr.block[1].l[0] == note) {
                                //result.html += ", correct note";
                                result['objectives'][key]['note'] = true;
                            }
                        }
                    }
                    //result.html += "<br>";
                }
            }

        }); // for each script in the stage


        // Find the variable named "completed" or "tested"
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
        /*
         */
        var num_complete = 0;
        for (var i = 0; i < key_names.length; i++) {
            var key_name = key_names[i];

            if (result['objectives'][key_name]['double'])
                result.html += "Whoops!  You have two scripts for letter " + key_name + "!<br>";
            // "When key is clicked"
            else if (!result['objectives'][key_name]['event'])
                result.html += "Make a script for key: " + key_name + ".<br>";
            // "Play note X for Y beats"
            else if (!result['objectives'][key_name]['play'])
                result.html += "Now add a block to play the note when " + key_name + " is pressed.<br>";
            // correct note
            else if (!result['objectives'][key_name]['note'])
                result.html += "Look at the yellow box to see what note to choose for key " + key_name + ".<br>";
            else
                num_complete = num_complete + 1;
        }
        /*
         */
        if (num_complete == key_names.length)
            result['completed'] = true;
        else
            result.html += "<b>Hint: You can copy scripts by right-clicking on the script and choosing duplicate.<br></b>";

        result['completed'] = false;
        result['error_type'] = 5;
        return result;
    }
};
