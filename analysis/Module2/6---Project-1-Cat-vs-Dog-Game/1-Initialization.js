exports.process = function (xmlObj) {
    var result = {};
    result['objectives'] = {};

    //result['completed'] = false;
    result['objectives']['cat event'] = false ;
    result['objectives']['cat place at'] = false ;
    result['objectives']['cat completed'] = false;


    result['objectives']['dog event'] = false ;
    result['objectives']['dog place at'] = false;
    result['objectives']['dog dir'] = false;
    result['objectives']['dog completed'] = false;

    result['objectives']['fish event'] = false ;
    result['objectives']['fish place at'] = false;
    result['objectives']['fish hide'] = false;
    result['objectives']['fish dir'] = false;
    result['objectives']['fish completed'] = false;

    result.html = ""; 
try{
xmlObj.project.stage[0].sprites[0].sprite.forEach(function(sprite){
    var scripts = sprite.scripts[0].script;
       if (scripts) { // if not empty
            if (sprite.$.name == "Cat") {
                scripts.forEach(function (script) {
                    if (script.block[0].$.s == 'receiveGo' && script.block[0].$.isInert == "false") { //if a non-inert Blue Square block exists
                        if (script.block.length > 1) {
                            result['objectives']['cat event'] = true;
                           script.block.forEach(function (block) { // for each block in the script
                                if (block.$.s == 'gotoXYNegative') { //if place at block used
                                    result['objectives']['cat place at'] = true;
                                    if (block.l[0] == 197 && block.l[1] == 256)
                                        result['objectives']['cat completed'] = true;
                                }
                            });
                        }
                    }
                });
            }

    if (sprite.$.name == "Dog") {
                scripts.forEach(function (script) {
                    if (script.block[0].$.s == 'receiveGo' && script.block[0].$.isInert == "false") { //if a non-inert Blue Square block exists
                        if (script.block.length > 1) {
                            result['objectives']['dog event'] = true;
                            script.block.forEach(function (block) { // for each block in the script
                                if (block.$.s == 'gotoXYNegative') { //if place at block used
                                    result['objectives']['dog place at'] = true;
                                    if (block.l[0] == 50 && block.l[1] == 34) { //if placed in correct position
                                        result['objectives']['dog completed'] = true;
                                    }
                                }
                                 if (block.$.s == "setHeading" && (block.l[0] == 90 || block.l[0]=='right'))
                                    result['objectives']['dog dir'] = true;
                            });
                        }
                    }
                });
            }
    if (sprite.$.name == 'Fish') {
                scripts.forEach(function (script) {
                    if (script.block[0].$.s == 'receiveGo' && script.block[0].$.isInert == "false") { //if a non-inert Blue Square block exists
                        if (script.block.length > 1) {
                            result['objectives']['fish event'] = true;
                            script.block.forEach(function (block) { // for each block in the script
                                if (block.$.s == 'gotoXYNegative') { //if place at block used
                                    result['objectives']['fish place at'] = true;
                                    if (block.l[0] == 236 && block.l[1] == 275) { //if placed in correct position
                                        result['objectives']['fish completed'] = true;
                                    }
                                }
                                if (block.$.s == "hide")
                                    result['objectives']['fish hide'] = true;
                                if (block.$.s == "setHeading" && (block.l[0] == 180 || block.l[0]=='down'))
                                    result['objectives']['fish dir'] = true;
                            });
                        }
                    }
                });
            }
        //}
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

if (result['objectives']['cat event'] == false || result['objectives']['fish event'] == false || result['objectives']['dog event'] == false)
    result.html = "It seems like you haven't added anything under the event block for at least one sprite. Check them and keep trying!";
else if ( result['objectives']['cat place at'] == false || result['objectives']['dog place at'] == false  || result['objectives']['fish place at'] == false)
    result.html = "You need to use the 'place at' block to initialize the sprites to the correct location! Be sure to add this under the event block. Keep trying!";
else if (result['objectives']['cat completed'] == false || result['objectives']['dog completed'] == false || result['objectives']['fish completed'] == false)
    result.html = "You're so close! You placed one of the sprites at the wrong place. Check the x-y coordinates, adjust them and check your work again!";
else if (result['objectives']['fish hide'] == false)
    result.html = "You're so close! Don't forget that you also need to hide the fish initially, only the dog and the cat holding the brown bag should be showing!";   
else if (result['objectives']['fish dir'] == false)
    result.html = "You're super close! The fish needs to initially be pointing in the direction down (180). Correct that under the event block in the fish sprite and check your work again! You're almost done!"; 
else if (result['objectives']['dog dir'] == false)
    result.html = "You're so close! The dog needs to be initialized facing in the right (90) direction. Correct that under the event block in the dog sprite and check your work again!";
else if (completed == true) 
    result.html = "Congratulations! You completed this activity!";
    return result; 
    
}
