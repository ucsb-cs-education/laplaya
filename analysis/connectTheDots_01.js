var connectTheDots_01 = {}; //to keep from polluting namespace when doing multiple projects without closing session 

connectTheDots_01.analyzeThisProject = function (project) {
    var results = {}; //store results in a dictionary that will be passed to htmlwrapper
    var keys = Object.keys(project.sprites); //iterating through all sprites in project(doesn't get hidden sprites)
    keys.forEach(function (key) {
        var sprite = project.sprites[key];
        if (sprite.devName == 'Pen') { //or sprite.name == pen, etc. 
            results['PenExists'] = true; 
            sprite.scripts.children.forEach(function (topBlock) { //script actually refers to the top block of the script
                if (!(topBlock instanceof CommentMorph)) { //sort out comments 
                    while (topBlock != null) { //iterate through all blocks in script 
                        if (topBlock.selector == 'doGlidetoObject') {//check for Glide To block
                            var block = topBlock;
                            if (block.inputs()[0].contents().text == 'dot2'); //navigating through blocks will be annoying
                            {
                                results['goToDot2'] = true;
                            }
                        }
                            topBlock = topBlock.nextBlock();
                    }
                }
            });
        }
    });
    return results;
}

connectTheDots_01.htmlwrapper = function (resultsDict) {
    var html = [] // example output (not guaranteed to be what goes in later) 
    if (resultsDict['goToDot2'] == true) {
        html.push('<p> Goes to dot 2 </p>')
    }
    else {
        html.push('<p> You still need to go to dot 2!</p>');
    }
    if (resultsDict['PenExists'] == true) {
        html.push('<p> Pen still exists </p>')
    }
    return (html);
}
/*

Creating an analysis file for a project

Step 1: Create file named after project you wish to analyze
    (if project is "Fish", file should be "Fish.js")

Step 2: 
    Each file needs three things (using example above)
        - var Fish = {}
        - Fish.analyzeThisProject = function (project)
        - Fish.htmlwrapper = function (resultsDict)

Snap will pass a project model into analyzeThisProject. See the above
for examples of traversing through sprites, scripts, and within blocks.
Maybe we need some documentation, but right now it's mostly trial and
error.

If you have any questions about the setup, let me know! 

-Tim 

*/