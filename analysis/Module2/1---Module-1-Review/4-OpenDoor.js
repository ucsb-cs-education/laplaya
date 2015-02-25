exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    result['objectives']['door opens'] = false;
    result.html = "";

    var doorClick = false;
    var angle = false;

    try{
        xmlObj.project.stage[0].sprites[0].sprite.forEach(function(u){
            if (u.$.devName == "Door"){
                u.scripts[0].script.forEach(function(v){
                    if (v.block[0].$.s == "receiveClick")
                    {
                        doorClick = true;
                    }
                    if (v.block[1].$.s == "turn" || v.block[1].$.s == "turnLeft")
                    {
                        result['objectives']['door opens'] = true;
                        if (v.block[1].l[0] == '90')
                            angle = true;
                    }
                });
            }
        });
    }
    catch(err){}

    // If all objectives are completed, result.completed = true
    var completed = true;
    for (var property in result['objectives']) {
        if (result['objectives'][property] != true) {
            completed = false;
        }
    }
    result['completed'] = completed;

    if (!doorClick && completed)
    {
        result['completed'] = false;
        result.html = "You're so close! You used the right block to turn the door, but we want the door to open only when it is clicked! Change the event block and check your work again! Keep trying!";
    }
    else if (doorClick && !result['objectives']['door opens'])
        result.html = "You're close! It looks like your script is not using the block that will turn the door! Make sure the door rotates 90 degrees when it is clicked, then check your work again! Keep trying!";
    else if (!angle)
    {
        result['completed'] = false;
        result.html = "You're almost there! You have all the right blocks! The only problem is that the door is not being rotated 90 degrees when it is clicked! Change the angle and check your work again! Keep trying!";
    }
    else if (completed)
        result.html = "Congratulations! You have completed this activity!";
    return result;

  };

