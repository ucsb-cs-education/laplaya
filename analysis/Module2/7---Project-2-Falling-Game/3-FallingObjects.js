exports.process = function (xmlObj) {
    var result = {};
    result.html = "";
    result['objectives'] = {};
    //result['objectives']['initialize_crab'] = false;
    result['objectives']['initialize_u1'] = false;
    result['objectives']['initialize_u2'] = false;
    result['objectives']['initialize_u3'] = false;
    result['objectives']['initialize_o1'] = false;
    result['objectives']['initialize_o2'] = false;
    result['objectives']['initialize_o3'] = false;

    /* Possible Problems:
        1. Green flag is missing
        2. Missing forever loop
        3. Not showing
        4. Not falling correctly (needs to fall downwards 360 steps)
        6. Not respawning */

    var showProblem = [];
    var moveProblem = [];
    var foreverProblem = [];
    var emptyProblem = [];
    var placeProblem = [];

    // Check the Sprites initialization


    var u1Show = false;
    var u2Show = false;
    var u3Show = false;

    var o1Show = false;
    var o2Show = false;
    var o3Show = false;

try{
    xmlObj.project.stage[0].sprites[0].sprite.forEach(function(s){

        if(s.$.name == "Urchin1"){
            var u1_here = false;
            var u1Place = false;
            var u1Distance = false;
            var u1Direction = false;
            var u1Forever = false;
            var u1ShowOrder = true;
            var u1PointOrder = true;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "getReady"){
                        u1_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "doForever"){
                                u1Forever = true;
                                j.script[0].block.forEach(function(k){
                                    // Set as showing when it finds a show block
                                    if(k.$.s == "show"){
                                        u1Show = true;
                                    }
                                    // If they use glide direction block
                                    if(k.$.s == "doGlideDirection"){
                                        if(parseInt(k.l[0])>=360){
                                            u1Distance = true;
                                        }
                                        else{
                                            u1Distance = false;
                                        }
                                        if(k.l[1] == "down"){
                                            u1Direction = true;
                                        }
                                        else{
                                            u1Direction = false;
                                        }

                                        // If not already showing, then wrong order.
                                        if(u1Show != true){
                                            u1ShowOrder = false;
                                        }
                                    }
                                    // If they use point direction + move
                                    if(k.$.s == "setHeading"){
                                        if(k.l[0] == "down"){
                                            u1Direction = true;
                                        }
                                        else{
                                            u1Direction = false;
                                        }
                                    }
                                    if(k.$.s == "doSpeedGlideSteps"){
                                        if(parseInt(k.l[0]) >= 360){
                                            u1Distance = true;
                                        }
                                        else{
                                            u1Distance = false;
                                        }

                                        // If not already showing, then wrong order
                                        if(u1Show != true){
                                            u1ShowOrder = false;
                                        }
                                        // If not pointing downwards, then wrong order
                                        if(u1Direction != true){
                                            u1PointOrder = false;
                                        }
                                    }
                                });
                                // Check if the last block is the place at block
                                if(j.script[0].block[(j.script[0].block.length)-1].$.s == "gotoXYNegative"){
                                    if(j.script[0].block[(j.script[0].block.length)-1].l[0] == "82" && j.script[0].block[(j.script[0].block.length)-1].l[1] == "327"){
                                        u1Place = true;
                                    }
                                }
                            }
                        });

                    }
                });
            } catch(err){
                emptyProblem.push("Urchin 1");
            }

            if(u1_here && u1Place && u1Show && u1Direction && u1Distance && u1Forever && u1ShowOrder && u1PointOrder){
                result['objectives']['initialize_u1'] = true;
            }
            else if(!u1_here){
                emptyProblem.push("Urchin 1");
            }
            else if(!u1Forever){
                foreverProblem.push("Urchin 1");
            }
            else if(!u1Show || !u1ShowOrder){
                showProblem.push("Urchin 1");
            }
            else if(!u1Distance || !u1PointOrder || !u1Direction){
                moveProblem.push("Urchin 1");
            }
            else if(!u1Place){
                placeProblem.push("Urchin 1");
            }
        }
        // Check the Urchin2 sprite initialization
        if(s.$.name == "Urchin2"){
            var u2_here = false;
            var u2Place = false;
            var u2Distance = false;
            var u2Direction = false;
            var u2Forever = false;
            var u2ShowOrder = true;
            var u2PointOrder = true;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "getReady"){
                        u2_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "doForever"){
                                u2Forever = true;
                                j.script[0].block.forEach(function(k){
                                    // Set as showing when it finds a show block
                                    if(k.$.s == "show"){
                                        u2Show = true;
                                    }
                                    // If they use glide direction block
                                    if(k.$.s == "doGlideDirection"){
                                        if(parseInt(k.l[0])>=360){
                                            u2Distance = true;
                                        }
                                        else{
                                            u2Distance = false;
                                        }
                                        if(k.l[1] == "down"){
                                            u2Direction = true;
                                        }
                                        else{
                                            u2Direction = false;
                                        }

                                        // If not already showing, then wrong order.
                                        if(u2Show != true){
                                            u2ShowOrder = false;
                                        }
                                    }
                                    // If they use point direction + move
                                    if(k.$.s == "setHeading"){
                                        if(k.l[0] == "down"){
                                            u2Direction = true;
                                        }
                                        else{
                                            u2Direction = false;
                                        }
                                    }
                                    if(k.$.s == "doSpeedGlideSteps"){
                                        if(parseInt(k.l[0]) >= 360){
                                            u2Distance = true;
                                        }
                                        else{
                                            u2Distance = false;
                                        }

                                        // If not already showing, then wrong order
                                        if(u2Show != true){
                                            u2ShowOrder = false;
                                        }
                                        // If not pointing downwards, then wrong order
                                        if(u2Direction != true){
                                            u2PointOrder = false;
                                        }
                                    }
                                });
                                // Check if the last block is the place at block
                                if(j.script[0].block[(j.script[0].block.length)-1].$.s == "gotoXYNegative"){
                                    if(j.script[0].block[(j.script[0].block.length)-1].l[0] == "354" && j.script[0].block[(j.script[0].block.length)-1].l[1] == "327"){
                                        u2Place = true;
                                    }
                                }
                            }
                        });

                    }
                });
            } catch(err){
                emptyProblem.push("Urchin 2");
            }

            if(u2_here && u2Place && u2Show && u2Direction && u2Distance && u2Forever && u2ShowOrder && u2PointOrder){
                result['objectives']['initialize_u2'] = true;
            }
            else if(!u2_here){
                emptyProblem.push("Urchin 2");
            }
            else if(!u2Forever){
                foreverProblem.push("Urchin 2");
            }
            else if(!u1Show || !u2ShowOrder){
                showProblem.push("Urchin 2");
            }
            else if(!u2Distance || !u2PointOrder || !u2Direction){
                moveProblem.push("Urchin 2");
            }
            else if(!u2Place){
                placeProblem.push("Urchin 2");
            }
        }

        // No need to check costume, because that is done when scene change
        if(s.$.name == "Urchin3"){
            var u3_here = false;
            var u3Place = false;
            var u3Distance = false;
            var u3Direction = false;
            var u3Forever = false;
            var u3ShowOrder = true;
            var u3PointOrder = true;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "getReady"){
                        u3_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "doForever"){
                                u3Forever = true;
                                j.script[0].block.forEach(function(k){
                                    // Set as showing when it finds a show block
                                    if(k.$.s == "show"){
                                        u3Show = true;
                                    }
                                    // If they use glide direction block
                                    if(k.$.s == "doGlideDirection"){
                                        if(parseInt(k.l[0])>=360){
                                            u3Distance = true;
                                        }
                                        else{
                                            u3Distance = false;
                                        }
                                        if(k.l[1] == "down"){
                                            u3Direction = true;
                                        }
                                        else{
                                            u3Direction = false;
                                        }

                                        // If not already showing, then wrong order.
                                        if(u3Show != true){
                                            u3ShowOrder = false;
                                        }
                                    }
                                    // If they use point direction + move
                                    if(k.$.s == "setHeading"){
                                        if(k.l[0] == "down"){
                                            u3Direction = true;
                                        }
                                        else{
                                            u3Direction = false;
                                        }
                                    }
                                    if(k.$.s == "doSpeedGlideSteps"){
                                        if(parseInt(k.l[0]) >= 360){
                                            u3Distance = true;
                                        }
                                        else{
                                            u3Distance = false;
                                        }

                                        // If not already showing, then wrong order
                                        if(u3Show != true){
                                            u3ShowOrder = false;
                                        }
                                        // If not pointing downwards, then wrong order
                                        if(u3Direction != true){
                                            u3PointOrder = false;
                                        }
                                    }
                                });
                                // Check if the last block is the place at block
                                if(j.script[0].block[(j.script[0].block.length)-1].$.s == "gotoXYNegative"){
                                    if(j.script[0].block[(j.script[0].block.length)-1].l[0] == "392" && j.script[0].block[(j.script[0].block.length)-1].l[1] == "327"){
                                        u3Place = true;
                                    }
                                }
                            }
                        });

                    }
                });
            } catch(err){
                emptyProblem.push("Urchin 3");
            }

            if(u3_here && u3Place && u3Show && u3Direction && u3Distance && u3Forever && u3ShowOrder && u3PointOrder){
                result['objectives']['initialize_u3'] = true;
            }
            else if(!u3_here){
                emptyProblem.push("Urchin 3");
            }
            else if(!u3Forever){
                foreverProblem.push("Urchin 3");
            }
            else if(!u3Show || !u3ShowOrder){
                showProblem.push("Urchin 3");
            }
            else if(!u3Distance || !u3PointOrder || !u3Direction){
                moveProblem.push("Urchin 3");
            }
            else if(!u3Place){
                placeProblem.push("Urchin 3");
            }
        }
        


        if(s.$.name == "Obstacle1"){
            var o1_here = false;
            var o1Place = false;
            var o1Distance = false;
            var o1Direction = false;
            var o1Forever = false;
            var o1ShowOrder = true;
            var o1PointOrder = true;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "getReady"){
                        o1_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "doForever"){
                                o1Forever = true;
                                j.script[0].block.forEach(function(k){
                                    // Set as showing when it finds a show block
                                    if(k.$.s == "show"){
                                        o1Show = true;
                                    }
                                    // If they use glide direction block
                                    if(k.$.s == "doGlideDirection"){
                                        if(parseInt(k.l[0])>=360){
                                            o1Distance = true;
                                        }
                                        else{
                                            o1Distance = false;
                                        }
                                        if(k.l[1] == "down"){
                                            o1Direction = true;
                                        }
                                        else{
                                            o1Direction = false;
                                        }

                                        // If not already showing, then wrong order.
                                        if(o1Show != true){
                                            o1ShowOrder = false;
                                        }
                                    }
                                    // If they use point direction + move
                                    if(k.$.s == "setHeading"){
                                        if(k.l[0] == "down"){
                                            o1Direction = true;
                                        }
                                        else{
                                            o1Direction = false;
                                        }
                                    }
                                    if(k.$.s == "doSpeedGlideSteps"){
                                        if(parseInt(k.l[0]) >= 360){
                                            o1Distance = true;
                                        }
                                        else{
                                            o1Distance = false;
                                        }

                                        // If not already showing, then wrong order
                                        if(o1Show != true){
                                            o1ShowOrder = false;
                                        }
                                        // If not pointing downwards, then wrong order
                                        if(o1Direction != true){
                                            o1PointOrder = false;
                                        }
                                    }
                                });
                                // Check if the last block is the place at block
                                if(j.script[0].block[(j.script[0].block.length)-1].$.s == "gotoXYNegative"){
                                    if(j.script[0].block[(j.script[0].block.length)-1].l[0] == "330" && j.script[0].block[(j.script[0].block.length)-1].l[1] == "319"){
                                        o1Place = true;
                                    }
                                }
                            }
                        });

                    }
                });
            } catch(err){
                emptyProblem.push("Obstacle 1");
            }

            if(o1_here && o1Place && o1Show && o1Direction && o1Distance && o1Forever && o1ShowOrder && o1PointOrder){
                result['objectives']['initialize_o1'] = true;
            }
            else if(!o1_here){
                emptyProblem.push("Obstacle 1");
            }
            else if(!o1Forever){
                foreverProblem.push("Obstacle 1");
            }
            else if(!o1Show || !o1ShowOrder){
                showProblem.push("Obstacle 1");
            }
            else if(!o1Distance || !o1PointOrder || !o1Direction){
                moveProblem.push("Obstacle 1");
            }
            else if(!o1Place){
                placeProblem.push("Obstacle 1");
            }
        }

        if(s.$.name == "Obstacle2"){
            var o2_here = false;
            var o2Place = false;
            var o2Distance = false;
            var o2Direction = false;
            var o2Forever = false;
            var o2ShowOrder = true;
            var o2PointOrder = true;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "getReady"){
                        o2_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "doForever"){
                                o2Forever = true;
                                j.script[0].block.forEach(function(k){
                                    // Set as showing when it finds a show block
                                    if(k.$.s == "show"){
                                        o2Show = true;
                                    }
                                    // If they use glide direction block
                                    if(k.$.s == "doGlideDirection"){
                                        if(parseInt(k.l[0])>=360){
                                            o2Distance = true;
                                        }
                                        else{
                                            o2Distance = false;
                                        }
                                        if(k.l[1] == "down"){
                                            o2Direction = true;
                                        }
                                        else{
                                            o2Direction = false;
                                        }

                                        // If not already showing, then wrong order.
                                        if(o2Show != true){
                                            o2ShowOrder = false;
                                        }
                                    }
                                    // If they use point direction + move
                                    if(k.$.s == "setHeading"){
                                        if(k.l[0] == "down"){
                                            o2Direction = true;
                                        }
                                        else{
                                            o2Direction = false;
                                        }
                                    }
                                    if(k.$.s == "doSpeedGlideSteps"){
                                        if(parseInt(k.l[0]) >= 360){
                                            o2Distance = true;
                                        }
                                        else{
                                            o2Distance = false;
                                        }

                                        // If not already showing, then wrong order
                                        if(o2Show != true){
                                            o2ShowOrder = false;
                                        }
                                        // If not pointing downwards, then wrong order
                                        if(o2Direction != true){
                                            o2PointOrder = false;
                                        }
                                    }
                                });
                                // Check if the last block is the place at block
                                if(j.script[0].block[(j.script[0].block.length)-1].$.s == "gotoXYNegative"){
                                    if(j.script[0].block[(j.script[0].block.length)-1].l[0] == "136" && j.script[0].block[(j.script[0].block.length)-1].l[1] == "327"){
                                        o2Place = true;
                                    }
                                }
                            }
                        });

                    }
                });
            } catch(err){
                emptyProblem.push("Obstacle 2");
            }

            if(o2_here && o2Place && o2Show && o2Direction && o2Distance && o2Forever && o2ShowOrder && o2PointOrder){
                result['objectives']['initialize_o2'] = true;
            }
            else if(!o2_here){
                emptyProblem.push("Obstacle 2");
            }
            else if(!o2Forever){
                foreverProblem.push("Obstacle 2");
            }
            else if(!o2Show || !o2ShowOrder){
                showProblem.push("Obstacle 2");
            }
            else if(!o2Distance || !o2PointOrder || !o2Direction){
                moveProblem.push("Obstacle 2");
            }
            else if(!o2Place){
                placeProblem.push("Obstacle 2");
            }
        }

        if(s.$.name == "Obstacle3"){
            var o3_here = false;
            var o3Place = false;
            var o3Distance = false;
            var o3Direction = false;
            var o3Forever = false;
            var o3ShowOrder = true;
            var o3PointOrder = true;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "getReady"){
                        o3_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "doForever"){
                                o3Forever = true;
                                j.script[0].block.forEach(function(k){
                                    // Set as showing when it finds a show block
                                    if(k.$.s == "show"){
                                        o3Show = true;
                                    }
                                    // If they use glide direction block
                                    if(k.$.s == "doGlideDirection"){
                                        if(parseInt(k.l[0])>=360){
                                            o3Distance = true;
                                        }
                                        else{
                                            o3Distance = false;
                                        }
                                        if(k.l[1] == "down"){
                                            o3Direction = true;
                                        }
                                        else{
                                            o3Direction = false;
                                        }

                                        // If not already showing, then wrong order.
                                        if(o3Show != true){
                                            o3ShowOrder = false;
                                        }
                                    }
                                    // If they use point direction + move
                                    if(k.$.s == "setHeading"){
                                        if(k.l[0] == "down"){
                                            o3Direction = true;
                                        }
                                        else{
                                            o3Direction = false;
                                        }
                                    }
                                    if(k.$.s == "doSpeedGlideSteps"){
                                        if(parseInt(k.l[0]) >= 360){
                                            o3Distance = true;
                                        }
                                        else{
                                            o3Distance = false;
                                        }

                                        // If not already showing, then wrong order
                                        if(o3Show != true){
                                            o3ShowOrder = false;
                                        }
                                        // If not pointing downwards, then wrong order
                                        if(o3Direction != true){
                                            o3PointOrder = false;
                                        }
                                    }
                                });
                                // Check if the last block is the place at block
                                if(j.script[0].block[(j.script[0].block.length)-1].$.s == "gotoXYNegative"){
                                    if(j.script[0].block[(j.script[0].block.length)-1].l[0] == "109" && j.script[0].block[(j.script[0].block.length)-1].l[1] == "331"){
                                        o3Place = true;
                                    }
                                }
                            }
                        });

                    }
                });
            } catch(err){
                emptyProblem.push("Obstacle 3");
            }

            if(o3_here && o3Place && o3Show && o3Direction && o3Distance && o3Forever && o3ShowOrder && o3PointOrder){
                result['objectives']['initialize_o3'] = true;
            }
            else if(!o3_here){
                emptyProblem.push("Obstacle 3");
            }
            else if(!o3Forever){
                foreverProblem.push("Obstacle 3");
            }
            else if(!o3Show || !o3ShowOrder){
                showProblem.push("Obstacle 3");
            }
            else if(!o3Distance || !o3PointOrder || !o3Direction){
                moveProblem.push("Obstacle 3");
            }
            else if(!o3Place){
                placeProblem.push("Obstacle 3");
            }
        }
    });
}
catch(err){}
    var completed = true;
    for (var property in result['objectives']) {
        if (result['objectives'][property] != true) {
            completed = false;
        }
    }

    result['completed'] = completed;

    // Case in which sprites do not have any scripts written for initialization
    if(emptyProblem.length > 0){
        result.html = "Make sure you have written a script for every sprite (besides Crab)! It looks like you might have forgotten to write scripts for ";
        if(emptyProblem.length == 1){
            result.html += emptyProblem[0] + ".";
        }
        else if(emptyProblem.length == 2){
            result.html += emptyProblem[0] + " and " + emptyProblem[1] + ".";
        }
        else{
            result.html += emptyProblem[0] + ", ";
            for(var i = 1; i < emptyProblem.length-1; i++){
                result.html += emptyProblem[i] + ", ";
            }
            result.html += "and " + emptyProblem[emptyProblem.length-1] + ".";
        }
    }
    // Case in which something is missing a forever block
    else if(foreverProblem.length > 0){
        result.html = "Good job so far! It looks like ";
        if(foreverProblem.length == 1){
            result.html += foreverProblem[0];
            result.html += " might be missing a forever block. Try again."
        }
        else if(foreverProblem.length == 2){
            result.html += foreverProblem[0] + " and " + foreverProblem[1];
            result.html += " might be missing a forever block. Try again."
        }
        else{
            result.html += foreverProblem[0] + ", ";
            for(var i = 1; i < foreverProblem.length-1; i++){
                result.html += foreverProblem[i] + ", ";
            }
            result.html += "and " + foreverProblem[foreverProblem.length-1];
            result.html += " might be missing a forever block. The urchins and obstacles need to show, glide 360 steps downwards, and be placed back at the top over and over again."
        }
    }
    // Case in which the sprite isn't showing before moving.
    else if(showProblem.length > 0){
        result.html = "Nice job! It seems you might have forgotten to make sure ";
        if(showProblem.length == 1){
            result.html += showProblem[0];
            result.html += " has the right hide/show block before gliding to the bottom."
        }
        else if(showProblem.length == 2){
            result.html += showProblem[0] + " and " + showProblem[1];
            result.html += " have the right hide/show block before gliding to the bottom."
        }
        else{
            result.html += showProblem[0] + ", ";
            for(var i = 1; i < showProblem.length-1; i++){
                result.html += showProblem[i] + ", ";
            }
            result.html += "and " + showProblem[showProblem.length-1];
            result.html += " have the right hide/show block before gliding to the bottom. The first block inside the forever block should be a hide or show block."
        }
    }
    // Case in which movement is not correct (should be gliding 360 steps downwards)
    else if(moveProblem.length > 0){
        result.html = "It looks like your urchins and obstacles aren't moving correctly. Check ";
        if(moveProblem.length == 1){
            result.html += moveProblem[0];
            result.html += " to make sure that it's falling properly.";
        }
        else if(moveProblem.length == 2){
            result.html += moveProblem[0] + " and " + moveProblem[1];
            result.html += " and make sure they are gliding to the bottom of the screen.";
        }
        else{
            result.html += moveProblem[0] + ", ";
            for(var i = 1; i < moveProblem.length-1; i++){
                result.html += moveProblem[i] + ", ";
            }
            result.html += "and " + moveProblem[moveProblem.length-1];
            result.html += " and make sure they are gliding to the bottom of the screen. Hint: the screen is 360 steps from the top to the bottom.";
        }
        
    }
    // Case in which sprite is not being placed back at original coordinates.
    else if(placeProblem.length > 0){
        result.html = "Good job so far! It looks like there might be sprite(s) that aren't being sent back to the right place. The last block inside the forever block should place the sprite back to it's original coordinates. Check ";
        if(placeProblem.length == 1){
            result.html += placeProblem[0];
            result.html += " and make sure it's placed back to the right x, y coordinates.";
        }
        else if(placeProblem.length == 2){
            result.html += placeProblem[0] + " and " + placeProblem[1];
            result.html += " and make sure they are sent to the right x, y coordinates.";
        }
        else{
            result.html += placeProblem[0] + ", ";
            for(var i = 1; i < placeProblem.length-1; i++){
                result.html += placeProblem[i] + ", ";
            }
            result.html += "and " + placeProblem[placeProblem.length-1];
            result.html += " and make sure they are sent to the right x, y coordinates.";
        }
        
    }
    
    return result;
}

