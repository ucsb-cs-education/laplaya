exports.process = function (xmlObj) {
    var results = {};
    results['objectives'] = {};
    results['completed'] = false;;
    //results['dog'] = {};
     results['objectives']['event'] = false;
    results['objectives']['if'] = false;
    results['objectives']['loop'] = false;
    results['objectives']['hides'] = false; 
    results.html = "";


   // results['html'] = 'Keep Going!'; 
   try{
    var sprites = xmlObj.project.stage[0].sprites[0].sprite;
    sprites.forEach(function (sprite) {
        var scripts = sprite.scripts[0].script;
        if (scripts) { // if not empty
            if (sprite.$.name == 'Dog') {
                scripts.forEach(function (script) {
                    if (script.block[0].$.s == "getReady" && script.block[0].$.isInert == 'false') { //if a non-inert Blue Square block exists
                        if (script.block.length > 1) {
                            results['objectives']['event'] = true;
                            var left, right;
                            //if (script.block[1].$.s == "doForever") 
                                //results['objectives']['loop'] = true;
                            script.block.forEach(function (block) { // for each block in the script
                                if (block.$.s == 'doForever') { //if foreverloop
                                    if (block.script && block.script[0].block) {
                                        results['objectives']['loop'] = true;
                                        block.script[0].block.forEach(function (innerBlock) {
                                            if (innerBlock.$.s == 'doIf') {
                                                if (innerBlock.block && innerBlock.block[0].$.s == 'reportTouchingObject') {
                                                    if(innerBlock.block[0].l[0] == 'Fish'){
                                                        results['objectives']['if'] = true; 
                                                    }
                                                }
                                                if (innerBlock.script && innerBlock.script[0].block) {
                                                    innerBlock.script[0].block.forEach(function (ifBlock) { // for all blocks in the if statement
                                                        if (ifBlock.$.s == 'hide') {
                                                            results['objectives']['hides'] = true;
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                   }
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

   /* if (results['completed']){

    }    
        else{ */
            if (!results['objectives']['event']) {
                results.html = "<br> Check to make sure you're using the right event!";
            }
            else if (!results['objectives']['loop']) {
                results.html = "<br> Is the script using a loop?"; 
            }
            else if (!results['objectives']['if']) {
                results.html = "<br> Are you checcking if the dog is touching the fish?";
            }
            else if (!results['objectives']['hides']) {
                results.html = "<br> Make sure to tell the dog to hide!";
            }
            else if (completed == true)
                results.html = "Congratulations! You have completed this task!";
        //}
    
    return results; 
    
}
