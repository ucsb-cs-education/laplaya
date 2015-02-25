exports.process = function (xmlObj) {
    var results = {};
    results['html'] = "Keep going!";
    results['completed'] = false;

    var sprites = xmlObj.project.stage[0].sprites[0].sprite;

    if (sprites) {
        sprites.forEach(function (sprite) {
            if (sprite.$.devName == 'Ballerina') {
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
                                                if (innerBlock.$.s.indexOf('turn') > -1 || innerBlock.$.s.indexOf('point') > -1) { // if a rotation is used 
                                                    results['rotates'] = true;
                                                }
                                                if (innerBlock.$.s.indexOf('glide' > -1 || innerBlock.$.s.indexOf('place') > -1)) {//if  amovement block is used
                                                    results['moves'] = true;
                                                }
                                                if (innerBlock.$.s.indexOf('Costume') > -1) { // if a costume change is used
                                                    results['costume'] = true;
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
    var completed = 0;
    if (!(results['event'] == true)) {
        results['html'] = 'Are you using the correct event block?';
    }
    else {
        if (results['loop']) {
            completed++;
        }
        else {
            results['html'] += "<br>Check to make sure you're using a loop";
        }
        if (results['rotates']) {
            completed++;
        }
        else {
            results['html'] += "<br>Check to make sure the dancer rotates!";
        }
        if (results['moves']) {
            completed++;
        }
        else {
            results['html'] += "<br>Make sure you move the dancer!";
        }
        if (results['costume']) {
            completed++;
        }
        else {
            results['html'] += "<br>Make sure to switch costumes!";
        }
        if (completed == 4) {
            results['completed'] = true;
        }
    }
    return results;
}
