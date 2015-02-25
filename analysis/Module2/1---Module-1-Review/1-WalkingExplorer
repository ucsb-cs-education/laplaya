exports.process = function (xmlObj) {
    // Create result object, containing objectives object
    var result = {};
    result['objectives'] = {};

    
    result['objectives']['right direction'] = false;
    result['objectives']['left direction'] = false;
    result['objectives']['up direction'] = false;
    result['objectives']['down direction'] = false;

    result['objectives']['right event'] = false;
    result['objectives']['left event'] = false;
    result['objectives']['up event'] = false; 
    result['objectives']['down event'] = false;

    result['objectives']['right glide'] = false;
    result['objectives']['left glide'] = false;
    result['objectives']['up glide'] = false;
    result['objectives']['down glide'] = false;
    
    result['objectives']['correct end'] = true;

    result.html = "";


    try{
    xmlObj.project.stage[0].sprites[0].sprite.forEach(function(v){
   
        if(v.$.devName == "Explorer") {
            v.scripts[0].script.forEach(function(w){
                if (w.block[0].$.s == "receiveKey" && w.block[0].l[0].option[0] == "right arrow"){
                    result['objectives']['right event'] = true;
                    if (w.block[1].$.s == "doGlideDirection"){  
                        result['objectives']['right glide'] = true;
                        if (w.block[1].l[1] == "right"){
                             result['objectives']['right direction'] = true;
                            if (w.block[2] != null) 
                                result['objectives']['correct end'] = false;

                    }}
                    else if (w.block[1].$.s == "setHeading" && w.block[1].l[0] == "right"){
                        result['objectives']['right direction'] = true;
                        if (w.block[2].$.s == "doSpeedGlideSteps")
                            result['objectives']['right glide'] = true;
                        if (w.block[3] != null) result['objectives']['correct end'] = false;
                    

                    }

                }
                if (w.block[0].$.s == "receiveKey" && w.block[0].l[0].option[0] == "left arrow"){
                    result['objectives']['left event'] = true;
                     if (w.block[1].$.s == "doGlideDirection"){  
                        result['objectives']['left glide'] = true;
                        if (w.block[1].l[1] == "left"){
                             result['objectives']['left direction'] = true;
                      if (w.block[2] != null) 
                                result['objectives']['correct end'] = false;

                    }}
                    else if (w.block[1].$.s == "setHeading" && w.block[1].l[0] == "left"){
                        result['objectives']['left direction'] = true;
                        if (w.block[2].$.s == "doSpeedGlideSteps")
                            result['objectives']['left glide'] = true;
                        if (w.block[3] != null) result['objectives']['correct end'] = false;
                    

                    }
                   }
                     
                if (w.block[0].$.s == "receiveKey" && w.block[0].l[0].option[0] == "down arrow"){
                    result['objectives']['down event'] = true;
                     if (w.block[1].$.s == "doGlideDirection"){  
                        result['objectives']['down glide'] = true;
                        if (w.block[1].l[1] == "down"){
                             result['objectives']['down direction'] = true;
                      if (w.block[2] != null) 
                                result['objectives']['correct end'] = false;

                    }}
                    else if (w.block[1].$.s == "setHeading" && w.block[1].l[0] == "down"){
                        result['objectives']['down direction'] = true;
                        if (w.block[2].$.s == "doSpeedGlideSteps")
                            result['objectives']['down glide'] = true;
                        if (w.block[3] != null) result['objectives']['correct end'] = false;
                    

                    }
                    }
                    
                
                if (w.block[0].$.s == "receiveKey" && w.block[0].l[0].option[0] == "up arrow" && w.block[0].$.isInert == "false"){
                    result['objectives']['up event'] = true;
                     if (w.block[1].$.s == "doGlideDirection"){  
                        result['objectives']['up glide'] = true;
                        if (w.block[1].l[1] == "up"){
                             result['objectives']['up direction'] = true;
                    }}
                     else if (w.block[1].$.s == "setHeading" && w.block[1].l[0] == "up"){
                        result['objectives']['up direction'] = true;
                        if (w.block[2].$.s == "doSpeedGlideSteps")
                            result['objectives']['up glide'] = true;
                        if (w.block[2] != null) 
                                result['objectives']['correct end'] = false;

                    }
                
                  
                    }
                
            }); 
        }
        else {}
    });
}
catch(err){}        
	
   var completed = true;
    for (var property in result['objectives']) {
        if (result['objectives'][property] != true) {
            completed = false;
        }
    }
    result['completed'] = completed;

if (result['objectives']['right event'] == false)/* || result['objectives']['left event'] == false || result['objectives']['up event'] == false
    || result['objectives']['down event'] == false)*/
//{
    result.html = "This activity requires you to use the \"When Right Key Pressed\" event block when you click the right key, like in the inert script. Check that you are using the correct event and try again!";
//}
else if (result['objectives']['right direction'] == false)/* || result['objectives']['left direction'] == false || result['objectives']['up direction'] == false
    || result['objectives']['down direction'] == false){*/
    result.html = "You have the correct event block for the right key, but when that key is pressed you need the explorer to glide in the right direction! Double check that your explorer is pointed in the right direction and try again!";
else if (result['objectives']['left event'] == false)
    result.html = "This activity requires you to use the \"When Left Key Pressed\" event block when you click the left key. Check that you are using the correct event and try again!";
else if (result['objectives']['left direction'] == false)
    result.html = "You have the event block for the left key, but when that key is pressed you need the explorer to glide in the left direction! Double check that your explorer is pointed to the left and try again!";
else if (result['objectives']['up event'] == false)
    result.html = "This activity requires you to use the \"When Up Key Pressed\" event block when you click the up key. Check that you are using the correct event and try again!";
else if (result['objectives']['up direction'] == false)
        result.html = "You have the event block for the up key, but when that key is pressed you need the explorer to glide upwards! Double check that your explorer is pointed upwards and try again!";
else if (result['objectives']['down event'] == false)
    result.html = "This activity requires you to use the \"When Down Key Pressed\" event block when you click the down key. Check that you are using the correct event and try again!";
else if (result['objectives']['down direction'] == false)
    result.html = "You have the event block for the down key, but when that key is pressed you need the explorer to glide downwards! Double check that your explorer is pointed downwards and try again!";
else if (  result['objectives']['right glide'] == false || result['objectives']['left glide'] == false || result['objectives']['up glide'] == false
    || result['objectives']['down glide'] == false)
    result.html = "You're so close! Be sure to make the explorer move using the glide block no matter which direction he is moving in and click the green check mark again!";
    
else if (result['objectives']['correct end'] == false){
    result.html = "You're so close but you have unnecessary blocks at the end of your scripts! Remove them and click the green check mark again!";

}
else if (completed == true) result.html = "Congratulations! You completed this activity!";

   
    return result;

  };


