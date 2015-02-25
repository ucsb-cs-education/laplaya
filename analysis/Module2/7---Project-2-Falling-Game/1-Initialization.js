exports.process = function (xmlObj) {
    var result = {};
    result.html = "";
    result['objectives'] = {};
    result['objectives']['initialize_crab'] = false;
    result['objectives']['initialize_u1'] = false;
    result['objectives']['initialize_u2'] = false;
    result['objectives']['initialize_u3'] = false;
    result['objectives']['initialize_o1'] = false;
    result['objectives']['initialize_o2'] = false;
    result['objectives']['initialize_o3'] = false;

    var placeProblem = [];
    var hidingProblem = [];
    var emptyProblem = [];
    var wrongEvent = [];

    // Check the Sprites initialization

    var crab = false;
    var crab_feedback = "";

    var u1Hide = false;
    var u2Hide = false;
    var u3Hide = false;

    var o1Hide = false;
    var o2Hide = false;
    var o3Hide = false;
try{//}
    xmlObj.project.stage[0].sprites[0].sprite.forEach(function(s){

        // Check the Crab sprite initialization
        if(s.$.name == "Crab"){
            var crab_here = false;
            var crab_costume = false;
            var crab_place = false;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "receiveGo"){
                        crab_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "doSwitchToCostume"){
                                if(i.block[1].l == "crab"){
                                    crab_costume = true;
                                }
                                else{
                                    crab_costume = false;
                                }
                            }
                            if(j.$.s == "gotoXYNegative"){
                                crab_place = true;
                            }
                        });
                    }
                    else {
                        if (i.block[0]){
                            wrongEvent.push("Crab");
                            //crab_feedback = "It looks like you are using the wrong event to initialize! Keep trying!";
                    }
                }
                });
                
            } catch (err){
                emptyProblem.push("Crab");
            }

            if(crab_here == true && crab_costume == true && crab_place == true){
                result['objectives']['initialize_crab'] = true;
            }
            else if(crab_here == false){
                emptyProblem.push("Crab");
            }
            else if(crab_costume == false){
                crab = true;
                crab_feedback = "It looks like you might not have set the Crab to the right costume when the blue square is clicked. Try again!";
            }
            else if(crab_place == false){
                placeProblem.push("Crab");
            }
            
        }
        if(s.$.name == "Urchin1"){
            var u1_here = false;
            var u1Place = false;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "receiveGo"){
                        u1_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "hide"){
                                u1Hide = true;
                            }
                            if(j.$.s == "show"){
                                u1Hide = false;
                            }
                            if(j.$.s == "gotoXYNegative"){
                                u1Place = true;
                            }
                        });

                    }
                          else {
                        if (i.block[0]){
                            wrongEvent.push("Urchin 1");
                           
                    }
                }
                });
                if(u1_here == false){
                    emptyProblem.push('Urchin 1');
                }
            } catch(err){
                emptyProblem.push("Urchin 1");
            }

            if(u1Place == true && u1Hide == true){
                result['objectives']['initialize_u1'] = true;
            }
            else{
                if(u1Place == false){
                    placeProblem.push("Urchin 1");
                }
                else if(u1Hide == false){
                    hidingProblem.push("Urchin 1");
                }
            }
        }
        // Check the Urchin2 sprite initialization
        if(s.$.name == "Urchin2"){
            var u2_here = false;
            var u2Place = false;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "receiveGo"){
                        u2_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "hide"){
                                u2Hide = true;
                            }
                            if(j.$.s == "show"){
                                u2Hide = false;
                            }
                            if(j.$.s == "gotoXYNegative"){
                                u2Place = true;
                            }
                        });

                    }
                          else {
                        if (i.block[0]){
                            wrongEvent.push("Urchin 2");
                            
                    }
                }
                });
                if(u2_here == false){
                    emptyProblem.push('Urchin 2');
                }
            } catch(err){
                emptyProblem.push("Urchin 2");
            }

            if(u2Hide == true && u2Place == true){
                result['objectives']['initialize_u2'] = true;
            }
            else{
                if(u2Place == false){
                    placeProblem.push("Urchin 2");
                }
                else if(u2Hide == false){
                    hidingProblem.push("Urchin 2");
                }
            }
        }

        // No need to check costume, because that is done when scene change
        if(s.$.name == "Urchin3"){
            var u3_here = false;
            var u3Place = false;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "receiveGo"){
                        u3_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "hide"){
                                u3Hide = true;
                            }
                            if(j.$.s == "show"){
                                u3Hide = false;
                            }
                            if(j.$.s == "gotoXYNegative"){
                                u3Place = true;
                            }
                        });

                    }
                    else {
                        if (i.block[0]){
                            wrongEvent.push("Urchin 3");
                            
                    }
                }
                });
                if(u3_here == false){
                    emptyProblem.push('Urchin 3');
                }
            } catch(err){
                emptyProblem.push("Urchin 3");
            }

            if(u3Hide == true && u3Place == true){
                result['objectives']['initialize_u3'] = true;
            }
            else{
                if(u3Place == false){
                    placeProblem.push("Urchin 3");
                }
                else if(u3Hide == false){
                    hidingProblem.push("Urchin 3");
                }
            }
        }
        


        if(s.$.name == "Obstacle1"){
            var o1_here = false;
            var o1Place = false;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "receiveGo"){
                        o1_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "hide"){
                                o1Hide = true;
                            }
                            if(j.$.s == "show"){
                                o1Hide = false;
                            }
                            if(j.$.s == "gotoXYNegative"){
                                o1Place = true;
                            }
                        });

                    }
                    else {
                        if (i.block[0]){
                            wrongEvent.push("Obstacle 1");
                            
                    }
                }
                });
                if(o1_here == false){
                    emptyProblem.push('Obstacle 1');
                }
            } catch(err){
                emptyProblem.push("Obstacle 1");
            }

            if(o1Hide == true && o1Place == true){
                result['objectives']['initialize_o1'] = true;
            }
            else{
                if(o1Place == false){
                    placeProblem.push("Obstacle 1");
                }
                else if(o1Hide == false){
                    hidingProblem.push("Obstacle 1");
                }
            }
        }

        if(s.$.name == "Obstacle2"){
            var o2_here = false;
            var o2Place = false;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "receiveGo"){
                        o2_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "hide"){
                                o2Hide = true;
                            }
                            if(j.$.s == "show"){
                                o2Hide = false;
                            }
                            if(j.$.s == "gotoXYNegative"){
                                o2Place = true;
                            }
                        });

                    }
                    else {
                        if (i.block[0]){
                            wrongEvent.push("Obstacle 2");
                            
                    }
                }
                });
                if(o2_here == false){
                    emptyProblem.push('Obstacle 2');
                }
            } catch(err){
                emptyProblem.push("Obstacle 2");
            }

            if(o2Hide == true && o2Place == true){
                result['objectives']['initialize_o2'] = true;
            }
            else{
                if(o2Place == false){
                    placeProblem.push("Obstacle 2");
                }
                else if(o2Hide == false){
                    hidingProblem.push("Obstacle 2");
                }
            }
        }

        if(s.$.name == "Obstacle3"){
            var o3_here = false;
            var o3Place = false;
            try{
                s.scripts[0].script.forEach(function(i){
                    if(i.block[0].$.s == "receiveGo"){
                        o3_here = true;
                        i.block.forEach(function(j){
                            if(j.$.s == "hide"){
                                o3Hide = true;
                            }
                            if(j.$.s == "show"){
                                o3Hide = false;
                            }
                            if(j.$.s == "gotoXYNegative"){
                                o3Place = true;
                            }
                        });

                    }
                    else {
                        if (i.block[0]){
                            wrongEvent.push("Obstacle 3");
                            
                    }
                }
                });
                if(o3_here == false){
                    emptyProblem.push('Obstacle 3');
                }
            } catch(err){
                emptyProblem.push("Obstacle 3");
            }

            if(o3Hide == true && o3Place == true){
                result['objectives']['initialize_o3'] = true;
            }
            else{
                if(o3Place == false){
                    placeProblem.push("Obstacle 3");
                }
                else if(o3Hide == false){
                    hidingProblem.push("Obstacle 3");
                }
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

    if(wrongEvent.length > 0){
        result.html = "Make sure you are using the correct event to initialize! It looks like you might not be using the blue square for  ";
        if(wrongEvent.length == 1){
            result.html += wrongEvent[0] + ".";
        }
        else if(wrongEvent.length == 2){
            result.html += wrongEvent[0] + " and " + wrongEvent[1] + ".";
        }
        else{
            result.html += wrongEvent[0] + ", ";
            for(var i = 1; i < wrongEvent.length-1; i++){
                result.html += wrongEvent[i] + ", ";
            }
            result.html += "and " + wrongEvent[wrongEvent.length-1] + ".";
        }
    }
    // Case in which sprites do not have any scripts written for initialization
    else if(emptyProblem.length > 0){
        result.html = "Make sure you have written initialization for every sprite! It looks like you might have forgotten to initialize ";
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
    // Special case: Crab does not have right costume
    else if(crab == true){
        result.html = crab_feedback;
    }
    else if(placeProblem.length > 0){
        result.html = "Good job so far! It looks like there might be sprite(s) that aren't initialized to the right place. Check ";
        if(placeProblem.length == 1){
            result.html += placeProblem[0];
            result.html += " and make sure it's initailized to the right x, y coordinates.";
        }
        else if(placeProblem.length == 2){
            result.html += placeProblem[0] + " and " + placeProblem[1];
            result.html += " and make sure they initialized to the right x, y coordinates.";
        }
        else{
            result.html += placeProblem[0] + ", ";
            for(var i = 1; i < placeProblem.length-1; i++){
                result.html += placeProblem[i] + ", ";
            }
            result.html += "and " + placeProblem[placeProblem.length-1];
            result.html += " and make sure they are initialized to the right x, y coordinates.";
        }
        
    }
    // Case in which everything is correct except needs hide/show blocks corrected
    else if(hidingProblem.length > 0){
        result.html = "Nice job! It seems you might have forgotten to make sure ";
        if(hidingProblem.length == 1){
            result.html += hidingProblem[0];
            result.html += " has the right hide/show block in it's initialization."
        }
        else if(placeProblem.length == 2){
            result.html += hidingProblem[0] + " and " + hidingProblem[1];
            result.html += " have the right hide/show block in it's initialization."
        }
        else{
            result.html += hidingProblem[0] + ", ";
            for(var i = 1; i < hidingProblem.length-1; i++){
                result.html += hidingProblem[i] + ", ";
            }
            result.html += "and " + hidingProblem[hidingProblem.length-1];
            result.html += " have the right hide/show block in it's initialization."
        }
    }
    return result;
}

