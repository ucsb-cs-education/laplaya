exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    result['objectives']['start event'] = false;
    result['objectives']['correct start'] = false;
    result['objectives']['initial costume'] = false;
    result['objectives']['placing block'] = false;
    result['objectives']['correct end'] = true;

    var costume1 = false;

    var x_coor = true;
    var y_coor = true;

    var costume_first = false;
    var start_first = false;

    result.html = "";

try{
    
    xmlObj.project.stage[0].sprites[0].sprite.forEach(function(v){
   
        if(v.$.devName == "Explorer") {
            v.scripts[0].script.forEach(function(w){
                if (w.block[0].$.s == "receiveGo"){
                    result['objectives']['start event'] = true;
                    if (w.block[1] == null ) {
                         result['objectives']['correct end'] = false;
                    }
                    else if (w.block[2] == null) {
                         result['objectives']['correct end'] = false;
                      
                    }
                    else if (w.block[1].$.s == "doGotoObject"  || w.block[1].$.s == "gotoXYNegative"){
                        result['objectives']['placing block'] = true;
                         if (w.block[1].$.s == "doGotoObject"  && w.block[1].l[0] == "Start")
                            result['objectives']['correct start'] = true;
                        else if (w.block[1].$.s == "gotoXYNegative"){
                            var x = parseInt(w.block[1].l[0]);
                            var y = parseInt(w.block[1].l[1]);
                            if (!(x >= 40 && x < 50))
                                x_coor = false;
                            if (!(y >= 315 && y <= 325))
                                y_coor = false;
                            if (x_coor && y_coor)
                                result['objectives']['correct start'] = true;

                        }
                        if (w.block[2].$.s == "doSwitchToCostume"){
                        //result['objectives']['costume block'] = true;
                       result['objectives']['initial costume'] = true;
                            if (w.block[2].l[0] == "costume1")
                                costume1 = true; 

                        }}//}
                    else if (w.block[1].$.s == "doSwitchToCostume"){
                        result['objectives']['initial costume'] = true;
                        if (w.block[1].l[0] == "costume1") costume1 = true;
                        if (w.block[2].$.s == "doGotoObject" || w.block[2].$.s == "gotoXYNegative"){
                            result['objectives']['placing block'] = true;
                            if (w.block[2].$.s == "doGotoObject"  && w.block[2].l[0] == "Start" )
                              result['objectives']['correct start'] = true;
                            else if (w.block[2].$.s == "gotoXYNegative"){
                                var x = parseInt(w.block[2].l[0]);
                                var y = parseInt(w.block[2].l[1]);
                            if (!(x >= 40 && x < 50))
                                x_coor = w.block[2].l[0];
                            if (!(y >= 315 && y <= 325))
                                y_coor = false;
                            if (x_coor && y_coor)
                                result['objectives']['correct start'] = true;
                        }
                    }
                    
}
                    if (w.block[3] != null)
                        result['objectives']['correct end'] = false;
                }});}});//}
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



if (result['objectives']['start event'] == false) 
    result.html = "Be sure to use the event that sets up the stage! Keep trying!";
else if (costume_first && result['objectives']['initial costume'] == false) 
    result.html = "Be sure to set the initial costume! To do this, add the block that switches the costume, then set the initial costume to the first one. You're so close to done! Keep trying!";
else if (!costume1)
{
    result.html = "You're so close! It looks like you used the right block to initialize the costume, but the wrong costume is set! Be sure to set costume1 as the initial costume, then check your work again!";
    result['completed'] = false;
}
else if (result['objectives']['placing block'] == false || result['objectives']['correct start']==false){//}
    if (!x_coor)
        result.html = "The explorer isn't initialized to the right place! Check that you place the explorer at a value of x between 40 and 49! You're so close,eep trying!";
    else if (!y_coor)
        result.html = "The explorer isn't initialized to the right place! Check that you place the explorer at a value of y between 315 and 325! You're so close, keep trying!";
    else
     result.html = "Oops! It looks like the explorer isn't initializing to the assigned place! Place him at Start and check your work again!";
}
else if (result['objectives']['correct end'] == false) 
    result.html = "It looks like you may have missed a block! Re-read the instructions and try again!";
else if (completed == true) 
    result.html = "Congratulations! You completed this activity!";
    return result;

  };


