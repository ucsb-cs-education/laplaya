// Author: Iris

exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
  	var events = {};

    // Only one objective for Animal Maze (get all the honey pots)
    events.Run = false;
    events['Correct Event'] = false;
		events.goTo = false; 
    events['correct xy coordinates'] = false;
    events['pen down'] = false;
    events.html = "";

    result.error_type = 0;
    var error_type;

    var x_coord = false;
    var y_coord = false;
    result.html = "";
try{
    // Find the variable named "completed" or "tested"
    xmlObj.project.variables[0].variable.forEach(function(v){
        // Variable "tested": if 1 -> continue analysis, if 0 -> all false
        if(v.$.name == "tested") {
            if(v.l == "1")
                events.Run = true;

        }
    });
	var sprites = xmlObj.project.stage[0].sprites[0].sprite;

    if (sprites) {
    	sprites.forEach(function (sprite) {
    		if(sprite.$.devName == "Bear"){
    		    var scripts = sprite.scripts[0].script;
    			//if (scripts.block[0].$.s == "getReady") {
    				scripts.forEach(function(script){
                        if (script.block[0].$.s == "getReady"){
                            events['Correct Event'] = true;
    					script.block.forEach(function (block){
                            if (block.$.s == 'down') 
                                events['pen down'] = true;
    					    if (block.$.s == 'doGlideCoord' && block.$.isInert == "false"){
    							events.goTo = true; 
                                var x = block.l[1];
                                var y = block.l[2];
                                if (x >= 290 && x <= 310 ) x_coord = true;
                                if (y >= 40 && y <= 60) y_coord = true;
    						}
    					});
    				}
                    });
    			//}
    		}

    	});
    }
}
catch(err){
    events.html += "oops! error";
}
finally{
	 if (x_coord && y_coord) events['correct xy coordinates'] = true;
            // If all objectives are completed, result.completed = true
    var completed = true;
    for (var property in events) {
        if (events[property] === false) {
            completed = false;
        }
    }
  events.progress = 0;
  events['progress.txt'] = "";
        
  if (! events['Correct Event']){
    events['progress.txt'] = "not started";
  }
  else if (! events.goTo){
    events['progress.txt'] = "event";
    events.progress = 1;
  }
  else if (!x_coord){
    events['progress.txt'] = "motion block";
    events.progress = 2;
  }
  else if (!y_coord){
    events['progress.txt'] = "x coordinate";
    events.progress = 3;
  }
  else if (!events['pen down']){
    events['progress.txt'] = "y coordinate";
    events.progress = 4;
  }
  else if (! events.Run){
    events['progress.txt'] = "pen down";
    events.progress = 5;
  }
  else if (completed) {
    events['progress.txt'] = "completed";
    events.progress = 6;
  }
  
  events.completed = completed;
  result.results = events;
  return result;
}
  };
