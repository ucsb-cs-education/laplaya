exports.process = function (xmlObj) {
    var results = {};
    results['html'] = "Keep going!";
    results['completed'] = false;

    var sprites = xmlObj.project.stage[0].sprites[0].sprite;

    if (sprites) {
        sprites.forEach(function (sprite) {
            if (sprite.$.devName == 'Pen') {
                var scripts = sprite.scripts[0].script;
                if (scripts) {
                    scripts.forEach(function (script) {
                        if ((script.block[0].$.s == "receiveClick")) { //if block is when clicked
                            if (script.block[0].$.isInert == "false") { // if block is NOT intert
                                results['event'] = true;
                                script.block.forEach(function (block) { //for each block in script
                                    if (block.$.s == 'doRepeat' || block.$.s == 'doForever') { //if block is a repeat block
                                        results['loop'] = true;
                                        if (block.script && block.script[0].block) { //if block has blocks inside it
                                            block.script[0].block.forEach(function (innerBlock) { //for each block inside the repeat block
                                                if (innerBlock.$.s.indexOf('turn') > -1) {
                                                    results['rotates'] = true;
                                                    if (innerBlock.l[0] == '90') {
                                                        results['rotatesDegrees'] = true;
                                                    }
                                                }
                                                if (innerBlock.$.s == 'doSpeedGlideSteps') {
                                                    results['moves'] = true;
                                                }
                                            });
                                        }
                                        if (block.$.s == 'doForever') {
                                            results['iterations'] = true;
                                        }
                                        else {
                                            if (block.l[0] == '4') {
                                                results['iterations'] = true;
                                            }
                                            if (parseInt(block.l[0]) < 4) {
                                                results['iterations'] = 'less';
                                            }
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
    if (!(results['event'] == true)) {
        results['html'] = 'Are you using the correct event block?';
    }
    if (!results['moves']) {
        results['html'] += '<br> Are you making sure to move the pen?';
    }
    if (!results['rotates']) {
        results['html'] += "<br> Don't forget to rotate the pen!";
    }
    if (!results['loop']) {
        results['html'] = 'Do you have a loop?';
    }
    if (results['moves'] && results['rotates']) {
        if (results['rotatesDegrees']) {
            results['completed'] = true;
        }
        else {
            results['html'] = 'Remember, a the pen must rotate exactly 90 degrees each time it moves in order to draw a square!';
        }
        if (results['iterations'] == 'less') {
            results['completed'] = false;
            results['html'] = results['html'] + '<br>Your code needs to loop more times to work!';
        }
    }

    return results;
}
