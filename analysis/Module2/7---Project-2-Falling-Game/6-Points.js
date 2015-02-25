exports.process = function (xmlObj) {
    var result = {};
    result.html = "";
    result['objectives'] = {};
    result['objectives']['crab'] = false;
    result['objectives']['u1'] = false;
    result['objectives']['u2'] = false;
    result['objectives']['u3'] = false;
    result['objectives']['o1'] = false;
    result['objectives']['o2'] = false;
    result['objectives']['o3'] = false;

    var hidingProblem = [];
    var emptyProblem = [];
    var foreverProblem = [];

    // Check the Sprites initialization

    var crab = false;
    var crab_feedback = "";

    var u1Hide = false;
    var u2Hide = false;
    var u3Hide = false;

    var u1For = false;
    var u2For = false;
    var u3For = false;

    var o1Hide = false;
    var o2Hide = false;
    var o3Hide = false;

    var o1For = false;
    var o2For = false;
    var o3For = false;

    xmlObj.project.stage[0].sprites[0].sprite.forEach(function(s){

        if(s.$.name == "Crab"){
            var crab_here = false;
            var varname = false;
            var varnum = false;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "receiveGo"){
                        crab_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "doSetVar"){
                                if(j.l[0] == "points"){
                                    varname = true;
                                }
                                else{
                                    varname = false;
                                }

                                if(j.l[1] == "0"){
                                    varnum = true;
                                }
                                else{
                                    varnum = false;
                                }
                            }
                        });
                    }
                    if (i.block[0].$.s == "getReady")
                    {
                        i.block.forEach(function(j){
                            if (/*j.block[0].$.s */ j.$.s== "doForever"){
                                
                                 u1For = true;
                                 u2For = true;
                                 u3For = true;
                                 o1For = true;
                                 o2For = true;
                                 o3For = true;
                                j.script[0].block.forEach(function(k){

                                    if (k.$.s == "doIf"){
                                        //k.block.forEach(function(m){
                                            if (k.block[0].$.s == "reportTouchingObject" && k.block[0].l[0] == "Urchin1"){
                                                //result['objectives']['u1'] = true;
                                                //u1_here = true;
                                                 k.script[0].block.forEach(function(p){
                                                    if(p.$.s == "incDecVar" && p.l[0].option[0] == "increase"){
                                                        points = true;
                                                        result['objectives']['u1'] = true;
                                                    }
                                                   // if (p.$.s == "doSwitchToCostume")
                                                     //   result['objectives']['u1']=true;
                                                //    }
                                                });
                                                 //if (! u1_here) emptyProblem.push('Urchin 1');
                                                 //if(u1Hide && u1For) result['objectives']['u1'] = true;
                                                 //else if(!u1For) foreverProblem.push('Urchin 1');
                                                 //else hidingProblem.push('Urchin 1');
                                            }
                                             if (k.block[0].$.s == "reportTouchingObject" && k.block[0].l[0] == "Urchin2"){
                                                 u2_here = true;
                                                 k.script[0].block.forEach(function(p){
                                                   
                                                    if(p.$.s == "incDecVar" && p.l[0].option[0] == "increase"){
                                                        points = true;
                                                    }});
                                                 if (! u2_here) emptyProblem.push('Urchin 2');
                                                 if(u2Hide && u2For) result['objectives']['u2'] = true;
                                                 else if(!u2For) foreverProblem.push('Urchin 2');
                                                 else hidingProblem.push('Urchin 2');
                                            }
                                            if (k.block[0].$.s == "reportTouchingObject" && k.block[0].l[0] == "Urchin3"){
                                                 u3_here = true;
                                                 k.script[0].block.forEach(function(p){
                                                   
                                                    if(p.$.s == "incDecVar" && p.l[0].option[0] == "increase"){
                                                        points = true;
                                                    }});
                                                 if (! u3_here) emptyProblem.push('Urchin 1');
                                                 if(u3Hide && u3For) result['objectives']['u3'] = true;
                                                 else if(!u3For) foreverProblem.push('Urchin 3');
                                                 else hidingProblem.push('Urchin 3');
                                            }
                                            if (k.block[0].$.s == "reportTouchingObject" && k.block[0].l[0] == "Obstacle1"){
                                                var numCostumeChanges = 0; var wait = false;
                                                k.script[0].block.forEach(function(p){
                                                    if(p.$.s == "doSwitchToCostume" && numCostumeChanges >= 0){
                                                        numCostumeChanges += 1;
                                                        if (numCostumeChanges == 2 && wait)
                                                         result['objectives']['o1'] = true;
                                                        else result['objectives']['o1'] = false;
                                                    }
                                                    if (p.$.s == "doWait")
                                                    {
                                                        wait = true;
                                                    }
                                                    if(p.$.s == "incDecVar" && p.l[0].option[0] == "decrease"){
                                                        points = true;
                                                    }
                                                });
                                               
                                            }
                                            if (k.block[0].$.s == "reportTouchingObject" && k.block[0].l[0] == "Obstacle2"){
                                               var numCostumeChanges = 0; var wait = false;
                                                k.script[0].block.forEach(function(p){
                                                    if(p.$.s == "doSwitchToCostume" && numCostumeChanges >= 0){
                                                        numCostumeChanges += 1;
                                                        if (numCostumeChanges == 2 && wait)
                                                         result['objectives']['o2'] = true;
                                                        else result['objectives']['o2'] = false;
                                                    }
                                                    if (p.$.s == "doWait")
                                                    {
                                                        wait = true;
                                                    }
                                                    if(p.$.s == "incDecVar" && p.l[0].option[0] == "decrease"){
                                                        points = true;
                                                    }
                                                });
                                               
                                            }
                                            if (k.block[0].$.s == "reportTouchingObject" && k.block[0].l[0] == "Obstacle3"){
                                                  var numCostumeChanges = 0; var wait = false;
                                                k.script[0].block.forEach(function(p){
                                                    if(p.$.s == "doSwitchToCostume" && numCostumeChanges >= 0){
                                                        numCostumeChanges += 1;
                                                        if (numCostumeChanges == 2 && wait)
                                                         result['objectives']['o3'] = true;
                                                        else result['objectives']['o3'] = false;
                                                    }
                                                    if (p.$.s == "doWait")
                                                    {
                                                        wait = true;
                                                    }
                                                    if(p.$.s == "incDecVar" && p.l[0].option[0] == "decrease"){
                                                        points = true;
                                                    }
                                                });
                                               
                                            }
                                      
                                    }
                                });
                            }
                        });
                    }

                });
                
            } catch (err){
                // do nothing
            }

            if(crab_here && varname && varnum){
                result['objectives']['crab'] = true;
            }
            else if(crab_here == false){
                crab = true;
                crab_feedback = "It looks like you might be missing the 'when blue flag is clicked' script. Check the Crab sprite and make sure that you are adding block(s) to the 'when the blue flag is clicked' script."
            }
            else if(varname == false){
                crab = true;
                crab_feedback = "Good job so far. It seems like you aren't setting any number to the 'points' variable. In the initialiation script, add a block that will set the 'points' variable to 0. Hint: Look for the 'set __ to __' block in ther Variables section."
            }
            else if(varnum == false){
                crab = true;
                crab_feedback = "Well done! It looks like you haven't set the 'points' variable to 0. Remember that we would like to set the score to zero when the game starts. Try again!";
            }
            
        }

        var points = false;

        if(s.$.name == "Urchin1" && u1_here){
            var u1_here = false;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "getReady"){
                        u1_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "doForever"){
                                u1For = true;
                                j.script[0].block.forEach(function(k){
                                    if(k.$.s == "doIf"){
                                        if(k.block[0].$.s == "reportTouchingObject"){
                                            if(k.block[0].l[0] == "Crab"){
                                                k.script[0].block.forEach(function(p){
                                                    if(p.$.s == "hide"){
                                                        u1Hide = true;
                                                    }
                                                    if(p.$.s == "incDecVar" && p.l[0].option[0] == "increase"){
                                                        points = true;
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        });

                    }
                });
                if(u1_here == false){
                    emptyProblem.push('Urchin 1');
                }
            } catch(err){
                emptyProblem.push("Urchin 1");
            }

            if(u1Hide && u1For){
               result['objectives']['u1'] = true;
            }
            else if(!u1For){
                foreverProblem.push('Urchin 1');
            }
            else{
                hidingProblem.push('Urchin 1');
            }
        }
        // Check the Urchin2 sprite initialization
        if(s.$.name == "Urchin2" && u2_here){
            var u2_here = false;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "getReady"){
                        u2_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "doForever"){
                                u2For = true;
                                j.script[0].block.forEach(function(k){
                                    if(k.$.s == "doIf"){
                                        if(k.block[0].$.s == "reportTouchingObject"){
                                            if(k.block[0].l[0] == "Crab"){
                                                k.script[0].block.forEach(function(p){
                                                    if(p.$.s == "hide"){
                                                        u2Hide = true;
                                                    }
                                                    if(p.$.s == "incDecVar" && p.l[0].option[0] == "increase"){
                                                        points = true;
                                                    }
                                                })
                                            }
                                        }
                                    }
                                });
                            }
                        });

                    }
                });
                if(u2_here == false){
                    emptyProblem.push('Urchin 2');
                }
            } catch(err){
                emptyProblem.push("Urchin 2");
            }

            if(u2Hide && u2For){
                result['objectives']['u2'] = true;
            }
            else if(!u2For){
                foreverProblem.push('Urchin 2');
            }
            else{
                hidingProblem.push('Urchin 2');
            }
        }

        // No need to check costume, because that is done when scene change
        if(s.$.name == "Urchin3" && u3_here){
            var u3_here  = false;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "getReady"){
                        u3_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "doForever"){
                                u3For = true;
                                j.script[0].block.forEach(function(k){
                                    if(k.$.s == "doIf"){
                                        //u3Hide = true;
                                        if(k.block[0].$.s == "reportTouchingObject"){
                                            u3Hide = true;
                                            if(k.block[0].l[0] == "Crab"){
                                                k.script[0].block.forEach(function(p){
                                                    if(p.$.s == "hide"){
                                                        //u3Hide = true;
                                                    }
                                                    if(p.$.s == "incDecVar" && p.l[0].option[0] == "increase"){
                                                        points = true;
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
                if(u3_here == false){
                    emptyProblem.push('Urchin 3');
                }
            } catch(err){
                emptyProblem.push("Urchin 3");
            }

            if(u3Hide && u3For){
                result['objectives']['u3'] = true;
            }
            else if(!u3For){
                foreverProblem.push('Urchin 3');
            }
            else{
                hidingProblem.push('Urchin 3');
            }
        }
        


        if(s.$.name == "Obstacle1" && o1_here){
            var o1_here  = false;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "getReady"){
                        o1_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "doForever"){
                                o1For = true;
                                j.script[0].block.forEach(function(k){
                                    if(k.$.s == "doIf"){
                                        if(k.block[0].$.s == "reportTouchingObject"){
                                            if(k.block[0].l[0] == "Crab"){
                                                k.script[0].block.forEach(function(p){
                                                    if(p.$.s == "hide"){
                                                        o1Hide = true;
                                                    }
                                                    if(p.$.s == "incDecVar" && p.l[0].option[0] == "decrease"){
                                                        points = true;
                                                    }
                                                })
                                            }
                                        }
                                    }
                                });
                            }
                        });

                    }
                });
                if(o1_here == false){
                    emptyProblem.push('Obstacle 1');
                }
            } catch(err){
                emptyProblem.push("Obstacle 1");
            }

            if(o1Hide && u1For){
                result['objectives']['o1'] = true;
            }
            else if(!o1For){
                foreverProblem.push('Obstacle 1');
            }
            else{
                hidingProblem.push('Obstacle 1');
            }
        }

        if(s.$.name == "Obstacle2" && o2_here){
            var o2_here  = false;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "getReady"){
                        o2_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "doForever"){
                                o2For = true;
                                j.script[0].block.forEach(function(k){
                                    if(k.$.s == "doIf"){
                                        if(k.block[0].$.s == "reportTouchingObject"){
                                            if(k.block[0].l[0] == "Crab"){
                                                k.script[0].block.forEach(function(p){
                                                    if(p.$.s == "hide"){
                                                        o2Hide = true;
                                                    }
                                                    if(p.$.s == "incDecVar" && p.l[0].option[0] == "decrease"){
                                                        points = true;
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        });

                    }
                });
                if(o2_here == false){
                    emptyProblem.push('Obstacle 2');
                }
            } catch(err){
                emptyProblem.push("Obstacle 2");
            }

            if(o2Hide && u1For){
                result['objectives']['o2'] = true;
            }
            else if(!o2For){
                foreverProblem.push('Obstacle 2');
            }
            else{
                hidingProblem.push('Obstacle 2');
            }
        }

        if(s.$.name == "Obstacle3" && o3_here){
            var o3_here  = false;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "getReady"){
                        o3_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "doForever"){
                                o3For = true;
                                j.script[0].block.forEach(function(k){
                                    if(k.$.s == "doIf"){
                                        if(k.block[0].$.s == "reportTouchingObject"){
                                            if(k.block[0].l[0] == "Crab"){
                                                k.script[0].block.forEach(function(p){
                                                    if(p.$.s == "hide"){
                                                        o3Hide = true;
                                                    }
                                                    if(p.$.s == "incDecVar" && p.l[0].option[0] == "decrease"){
                                                        points = true;
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        });

                    }
                });
                if(o3_here == false){
                    emptyProblem.push('Obstacle 3');
                }
            } catch(err){
                emptyProblem.push("Obstacle 3");
            }

            if(o3Hide && u1For){
                result['objectives']['o3'] = true;
            }
            else if(!o3For){
                foreverProblem.push('Obstacle 3');
            }
            else{
                hidingProblem.push('Obstacle 3');
            }
        }
        

    });

    var completed = true;
    for (var property in result['objectives']) {
        if (result['objectives'][property] != true) {
            completed = false;
        }
    }

    result['completed'] = completed;

    // Case in which sprites do not have any scripts written for initialization
    if(emptyProblem.length > 0){
        result.html = "Make sure you have written a script for every sprite! It looks like you might have forgotten to write one for ";
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
    else if(crab){
        result.html = crab_feedback;
    }
    else if(foreverProblem.length > 0){
        result.html = "Good job so far! It looks like there might be sprite(s) that need a forever block. Check ";
        if(foreverProblem.length == 1){
            result.html += foreverProblem[0];
            result.html += " and make sure that you are using a forever block.";
        }
        else if(foreverProblem.length == 2){
            result.html += foreverProblem[0] + " and " + foreverProblem[1];
            result.html += " and make sure that you are using a forever block.";
        }
        else{
            result.html += foreverProblem[0] + ", ";
            for(var i = 1; i < foreverProblem.length-1; i++){
                result.html += foreverProblem[i] + ", ";
            }
            result.html += "and " + foreverProblem[foreverProblem.length-1];
            result.html += " and make sure that you are using a forever block. The sprites need to check over and over again whether or not they are touching the Crab. Try again!";
        }
        
    }
    // Case in which everything is correct except needs hide/show blocks corrected
    else if(hidingProblem.length > 0){
        result.html = "Nice job! It seems you might have forgotten to make sure ";
        if(hidingProblem.length == 1){
            result.html += hidingProblem[0];
            result.html += " is hiding when touching the Crab."
        }
        else if(foreverProblem.length == 2){
            result.html += hidingProblem[0] + " and " + hidingProblem[1];
            result.html += " are hiding when touching the Crab."
        }
        else{
            result.html += hidingProblem[0] + ", ";
            for(var i = 1; i < hidingProblem.length-1; i++){
                result.html += hidingProblem[i] + ", ";
            }
            result.html += "and " + hidingProblem[hidingProblem.length-1];
            result.html += " are hiding when touching the Crab. Hint: Use a yellow 'if' block from the Control section and a blue 'touching sprite' block from the Sensing section."
        }
    }
    return result;
}

