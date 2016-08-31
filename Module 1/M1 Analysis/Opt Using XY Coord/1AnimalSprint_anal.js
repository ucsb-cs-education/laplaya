exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    var events = {};

    events.rooster_block = false;
    events.rooster_x = false;
    events.rooster_y = false;
    events.rooster_direction = false;

    events.cat_block = false;
    events.cat_x = false;
    events.cat_y = false;

    events.html = "";

    try {
        xmlObj.project.stage[0].sprites[0].sprite.forEach(function (sprites) {
            if (sprites.$.devName == "Cat") {
                sprites.scripts[0].script.forEach(function (scr) {
                    //   if (scr.block[0].$.s == "receiveGo"){
                    scr.block.forEach(function (blocks) {
                        if ((blocks.$.s == "gotoXYNegative")) {
                            events.cat_block = true;
                            var x = blocks.l[0];
                            var y = blocks.l[1];
                            if (x >= 425 && x <= 440)
                                events.cat_x = true;
                            if (y >= 235 && y <= 250)
                                events.cat_y = true;
                        }
                    });
                });
            }
            if (sprites.$.devName == "Rooster") {
                sprites.scripts[0].script.forEach(function (scr) {
                    //if (scr.block[0].$.s == "receiveGo"){
                    scr.block.forEach(function (blocks) {
                        // check if facing correct direction
                        if ((blocks.$.s == "doFaceTowards" && blocks.l[0] == "Finish Line") ||
                            (blocks.$.s == "setHeading" && blocks.l[0] == "left")) {
                            events.rooster_direction = true;
                        }
                        if ((blocks.$.s == "gotoXYNegative")) {
                            events.rooster_block = true;
                            var x = blocks.l[0];
                            var y = blocks.l[1];
                            if (x >= 425 && x <= 440)
                                events.rooster_x = true;
                            if (y >= 145 && y <= 160)
                                events.rooster_y = true;
                        }
                    });
                });
            }
        });
    } catch (err) {
        events.html += "oops! error";
    } finally {
        events.progress = 0;
        events['progress.txt'] = "";

        if (!events.cat_block) {
            events['progress.txt'] = "cat: not started";
        } else if (!events.cat_x && !events.cat_y) {
            events.progress = 2;
            events['progress.txt'] = "cat: block";
        } else if (!events.cat_x) {
            events.progress = 4;
            events['progress.txt'] = "cat: y";
        } else if (!events.cat_y) {
            events.progress = 4;
            events['progress.txt'] = "cat: x";
        } else {
            events.progress = 10;
            events['progress.txt'] = "cat: completed";
        }

        if (!events.rooster_block && !events.rooster_direction) {
            events['progress.txt'] += ", rooster: not started";
        } else if (!events.rooster_block) {
            events['progress.txt'] += ", rooster: direction";
            events.progress += 1;
        } else {
            if (!events.rooster_x && !events.rooster_y) {
                events.progress += 2;
                events['progress.txt'] += ", rooster: block";
            } else if (!events.rooster_x) {
                events.progress += 4;
                events['progress.txt'] += ", rooster: y";
            } else if (!events.rooster_y) {
                events.progress += 4;
                events['progress.txt'] += ", rooster: x";
            } else {
                events.progress += 10;
                events['progress.txt'] += ", rooster: xy";
            }

            if (events.rooster_direction) {
                events.progress++;
                events['progress.txt'] += ", direction";
            }
        }

        if (events.progress == 21) {
            events['progress.txt'] = "completed";
        }
    }
    result.results = events;
    return result;
};