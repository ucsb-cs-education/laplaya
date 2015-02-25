exports.process = function (xmlObj) {
    var results = {};
    results['objectives'] = {};

    results['completed'] = false;

results['objectives']['event'] =false;
results['objectives']['forever loop'] = false;
results['objectives']['repeat'] = false;
results['objectives']['right'] = false;
results['objectives']['stepRight'] = false;
results['objectives']['costume right'] = false;
results['objectives']['costume left'] = false;
results['objectives']['left'] = false;
results['objectives']['stepLeft'] = false; 
results.html = "";

var numCostumesRight = 0;
var numCostumesLeft = 0;
  //  results['dog'] = {};
    //results['html'] = 'Keep Going!'; 
    try{
    var sprites = xmlObj.project.stage[0].sprites[0].sprite
    sprites.forEach(function (sprite) {
        var scripts = sprite.scripts[0].script;
        if (scripts) { 
            if (sprite.$.name == "Dog"){
                scripts.forEach(function (script) {
                  if (script.block[0].$.s == 'getReady' && script.block[0].$.isInert == 'false') { //if a non-inert Blue Square block exists
                        results['objectives']['event'] = true;
                        if (script.block.length > 1) {
                            
                            if (script.block[1].$.s == "doForever") 
                                results['objectives']['forever loop'] = true;
                            //if (script.)
                            
                            var left, right; 
                            script.block[1].script[0].block.forEach(function (block) { // for each block in the script
                                if (block.$.s == "setHeading" && block.l[0] == 'right')
                                    results['objectives']['right']=true;
                                if (block.$.s == "doRepeat"){
                                    results['objectives']['repeat']=true;
                                    block.script[0].block.forEach(function(block){//});
                                if (block.$.s == "setHeading" && block.l[0] == 'right')
                                    results['objectives']['right']=true;
                                if (block.$.s == "doWearNextCostume" && numCostumesRight==0)
                                {
                                    if (numCostumesRight == 0 )
                                    {
                                        results['objectives']['costume right'] = true;
                                        numCostumesRight =1;
                                    }
                                    else results['objectives']['costume right']=false;
                                }
                                if (block.$.s == 'doSpeedGlideSteps'){
                                        if (block.l[0] == 15) {
                                            results['objectives']['stepRight'] = true;
                                           
                                            }}
                                    });
                                }
                                else results['objectives']['repeat']=false;
                            });
                            script.block[1].script[0].block.forEach(function (block) { // for each block in the script
                                if (block.$.s == "setHeading" && block.l[0] == 'left')
                                    results['objectives']['left']=true;
                                if (block.$.s == "doRepeat"){
                                    results['objectives']['repeat']=true;   
                                    block.script[0].block.forEach(function(block){//});
                                if (block.$.s == "setHeading" && block.l[0] == 'left')//{
                                    results['objectives']['left']=true;
                                 if (block.$.s == "doWearNextCostume" && numCostumesLeft==0)
                                {
                                    if (numCostumesLeft == 0 )
                                    {
                                        results['objectives']['costume left'] = true;
                                        numCostumesLeft =1;
                                    }
                                    else results['objectives']['costume left']=false;
                                }
                                if (block.$.s == 'doSpeedGlideSteps'){
                                        if (block.l[0] == 15) {
                                            results['objectives']['stepLeft'] = true; 
                                            }}
                                    });
                                }
                                else results['objectives']['repeat']=false;
                            });

}}});}}});

}

    catch(err){}

var completed = true;
    for (var property in results['objectives']) {
        if (results['objectives'][property] != true) {
            completed = false;
        }
    }
    results['completed'] = completed;

    if (! results['objectives']['event'])
        results.html = "Check that you are using the correct event to make the dog move! You want the dog to start walking when the green flag is clicked. Keep trying!";
    else if (! results['objectives']['forever loop'])
        results.html = "You're off to a good start! You have the correct event but it is not followed by the forever loop. Add the loop to make the dog continue moving forever or until the activity is stopped. Keep trying!";
    else if (! results['objectives']['repeat'])
        results.html = "You need two separate repeate loops: one to make the dog repeatedly move to the right and one to do the same to the left! Keep trying!";
    else if (!results['objectives']['right']) {
        results.html = "<br> Make sure the dog goes to the right!"
    }
    else if (!results['objectives']['left']) {
        results.html = "<br> Make sure the dog goes to the left!"
    }
    else if (!results['objectives']['stepRight']) {
        results.html = "<br> It looks like you need to check how far the dog steps to the right";
    }
    else if (!results['objectives']['stepLeft']) {
        results.html = "<br> It looks like you need to check how far the dog steps to the left";
    }
    else if (! results['objectives']['costume right'])
        results.html = "Try to animate the dog when he is walking to the right! Do this by adding 'next costume' one time in each repeat loop! This way, each time the dog takes a step, it will change costumes and look like it is walking. Keep trying!";
    else if (!results['objectives']['costume left'])
        results.html = "It looks like you animated the dog as it goes to the right, but not as it goes to the left! Make sure there is only one 'next costume' block in each repeat loop and keep trying!";
    else if (completed == true)
        results.html = "Congratulations! You completed this task!";
    return results; 
    
}
