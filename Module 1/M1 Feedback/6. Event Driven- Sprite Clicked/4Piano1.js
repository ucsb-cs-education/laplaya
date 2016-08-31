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
    //var sprite_names = ["Key 1 (C)","Key 2 (Db)","Key 3 (D)","Key 4 (Eb)","Key 5 (E)","Key 6 (F)",
    //"Key 7 (Gb)","Key 8 (G)","Key 9 (Ab)","Key 10 (A)","Key 11 (Bb)","Key 12 (B)"];
    //var note_names = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
    var sprite_names = ["Key 1 (C)", "Key 3 (D)", "Key 5 (E)", "Key 6 (F)",
        "Key 8 (G)", "Key 10 (A)", "Key 12 (B)"];
    var note_names = ["C", "D", "E", "F", "G", "A", "B"];
    //var note_nums = [60,62,64,65,67,69,71];

    for (var i = 0; i < note_names.length; i++) {
        var sprite_name = sprite_names[i];
        result['objectives'][sprite_name] = {};
        result['objectives'][sprite_name]['event'] = false; // "When I am clicked" block
        result['objectives'][sprite_name]['play'] = false; // "Say X for Y seconds" block
        result['objectives'][sprite_name]['note'] = false; // correct spelling of sprite
    }


    //####################################################################//
    // Parse XML file
    try {
        function checkKey(spriteName, script) {
            var index = sprite_names.indexOf(spriteName);
            for (var i = 1; i < script.length; i++) {
                var block = script[i];
                var name = block.$.s;
                if (name == "doPlayNote") {
                    result['objectives'][spriteName]['play'] = true;
                    //result.html += "compare "+block.l[0]+" vs "+note_names[index]+"<br>";
                    if (block.l[0] == note_names[index])
                        result['objectives'][spriteName]['note'] = true;
                    //result.html += spriteName+" plays note "+block.l[0]+"<br>";
                }
            }
        } // end function


        xmlObj.project.stage[0].sprites[0].sprite.forEach(function (v) {
            var sprite_name = v.$.name;
            var index = sprite_names.indexOf(sprite_name);
            //result.html += sprite_name + ": ";
            if (index > -1) {
                //result.html += "index: "+index+"<br>";
                v.scripts[0].script.forEach(function (w) {
                    if (w.$.visibleScript == "true") {
                        if (w.block[0].$.s == "receiveClick" && w.block[0].$.isInert == "false") {
                            result['objectives'][sprite_name]['event'] = true;
                            checkKey(sprite_name, w.block);
                        }
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
            }
        });
    }
    catch (err) {
    }
    finally {
        result['completed'] = true;
        var num_complete = 0;
        var num_sprites = sprite_names.length;
        for (var i = 0; i < num_sprites; i++) {
            var sprite_name;
            sprite_name = sprite_names[i];
            if (!result['objectives'][sprite_name]['note']) {
                result['completed'] = false;
                result.html += "***<b>" + sprite_name + "</b>: ";
                if (!result['objectives'][sprite_name]['event'])
                    result.html += "Create a script that happens <b>when the sprite is clicked</b><br>";
                else if (!result['objectives'][sprite_name]['play'])
                    result.html += "Great!  Now add a block that will make the sprite play a note!<br>";
                else //if (!result['objectives'][sprite_name]['note'])
                    result.html += "Check the note you chose to play!";
            }
            else
                num_complete = num_complete + 1;
        }

        if (num_complete < num_sprites)
            result.html += "<br>***Hint: You can copy a script from one sprite to another by dragging the script from one sprite into the picture of another sprite in the sprite list (lower right-hand corner).";


        result['error_type'] = 5;
        return result;
    }
};
