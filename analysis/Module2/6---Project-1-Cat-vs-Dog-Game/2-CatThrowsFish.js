exports.process = function (xmlObj) {
    var results = {};
    results['objectives'] = {};

    results['completed'] = false;

    results['objectives']['cat event'] = false;
    results['objectives']['cat completed'] =false;

    results['objectives']['fish event'] = false; 
    results['objectives']['fish shown'] = false;
    results['objectives']['fish hid'] = false;
    results['objectives']['fish placed'] = false;
    results['objectives']['fish glide'] = false;
    results['objectives']['fish completed']=false;
    //results['html'] = 'Keep Going!'; 

    results.html = "";
try{
    var sprites = xmlObj.project.stage[0].sprites[0].sprite
    sprites.forEach(function (sprite) {
        var scripts = sprite.scripts[0].script;
        if (scripts) { // if not empty
           // if (sprite.$.devName == 'Cat') {
            if (sprite.$.name == "Cat"){
                scripts.forEach(function (script) {
                    if (script.block[0].$.s == 'receiveKey' && script.block[0].$.isInert == "false") { //if a non-inert Blue Square block exists
                        if (script.block[0].l[0].option[0] == 'space') {
                            //results['cat']['event'] = true;
                             results['objectives']['cat event'] = true;
                            script.block.forEach(function (block) { // for each block in the script
                          if (block.$.s == "doSwitchToCostume"  && block.l[0]=='catThrow') { //if costume switches to cat throw when thrown
                                     results['objectives']['cat completed'] = true;//results['cat']['completed'] = true;
                                }
                            });
                        }
                    }
                });
            }
            if (sprite.$.name == 'Fish') {
                scripts.forEach(function (script) {
                    if (script.block[0].$.s == 'receiveKey' && script.block[0].$.isInert == "false") { //if a non-inert Blue Square block exists
                        if (script.block[0].l[0].option[0] == 'space') {
                           // results['fish']['event'] = true;
                           results['objectives']['fish event'] = true;
                            script.block.forEach(function (block) { // for each block in the script
                                if (block.$.s == 'show') {
                                     results['objectives']['fish shown'] = true;
                                    //results['fish']['shown'] = true;
                                }
                                if (block.$.s == 'hide') {
                                    results['objectives']['fish hid'] = true;
                                    //results['fish']['hid'] = true; 
                                }
                                if (block.$.s == 'doGotoObject') { //if place at block used
                                    results['objectives']['fish placed'] = true;
                                    if (block.l[0] == 'Cat') { //if placed in correct position
                                        results['objectives']['fish completed'] = true;
                                    }
                                }
                                else if (block.$.s == "gotoXYNegative"){
                                     results['objectives']['fish placed'] = true;
                                     if (block.l[0] == 236 && block.l[1] == 275)
                                        results['objectives']['fish completed'] = true;
                                }
                                if (block.$.s.indexOf('Glide') > -1) {
                                    results['objectives']['fish glide'] = true; 
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}
catch(err){}

var completed = true;
    for (var property in results['objectives']) {
        if (results['objectives'][property] != true) {
            completed = false;
        }
    }
    results['completed'] = completed;

    if (results['objectives']['cat event'] == false)
        results.html = "Check the event block for the cat! You want the cat to change costumes when the space key is pressed! Keep trying!";
    else if (results['objectives']['cat completed'] ==false)
        results.html = "Be sure to change the cat's costume to CatThrow! Keep trying!";
    else if (results['objectives']['fish event'] == false)
        results.html = "Check the event block for the fish! You want the fish to glide down only when the space key is pressed! Keep trying!";
    else if (results['objectives']['fish shown'] == false)
        results.html = "Make sure you are showing the fish when the space bar is pressed! Use the block that says 'show' and keep trying!";
    else if (results['objectives']['fish glide'] == false)
         results.html = "Be sure to make the fish glide to the ground when the space key is pressed! Keep trying!";
    else if (results['objectives']['fish hid'] == false)
        results.html = "After the fish glides to the ground, it needs to be hidden before being placed back at the cat (otherwise it will look funny)! Add that block and keep trying!";
    else if (results['objectives']['fish placed'] == false)
        results.html = "After the fish glides to the ground and is hidden, it needs to be placed back at the cat using the 'go to' block! Keep trying!";  
    else if (results['objectives']['fish completed']==false)
         results.html = "You're so close! Be sure that you make the fish go to the cat!"
    else if (completed == true)
        results.html = "Congratulations! You have completed this task!";

    return results; 
    
}
