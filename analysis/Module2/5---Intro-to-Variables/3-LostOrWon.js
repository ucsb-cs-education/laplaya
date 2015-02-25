exports.process = function (xmlObj) {
  var result = {};
   result['objectives'] = {};

   result['objectives']['tested'] = false;

   result['objectives']['on END received'] = false;
   result['objectives']['if statement'] = false;
   result['objectives']['score'] = false;
   result['objectives']['5'] = false;
   result['objectives']['less than'] = false;
   result['objectives']['switch background'] = false;
   result['objectives']['correct background'] = false;

try{
xmlObj.project.stage[0].scripts[0].script.forEach(function(v){
	if (v.block[0].$.s == "receiveMessage"  && v.block[0].l[0] == "End"){
		result['objectives']['on END received'] = true;
		if (v.block[1].$.s == "doIf"){
			result['objectives']['if statement'] = true;
			if (v.block[1].block[0].$.s == "reportLessThan"){
				 result['objectives']['less than'] =true;
				 if (v.block[1].block[0].block[0].$.var =="score")
				 	result['objectives']['score'] = true;
				 if (v.block[1].block[0].l[0] == "5")
				 	result['objectives']['5'] = true;
			}
			else if (v.block[1].block[0].$.s =="reportGreaterThan"){
				 result['objectives']['less than'] =true;
          var x = v.block[1].block[0];
            result['objectives']['5'] =x;
				 if (v.block[1].block[0].l[0] == "5")
				 	result['objectives']['5'] = true;
				  if (v.block[1].block[0].block[0].$.var =="score")
				 	result['objectives']['score'] = true;
         //for (i = 0; i<(v.block[1].block[0]).length)
			}
			if (v.block[1].script[0].block[0].$.s == "doSwitchToBackground"){
				result['objectives']['switch background'] = true;
				if (v.block[1].script[0].block[0].l[0] == "lost" ) result['objectives']['correct background'] = true;
			}
		}
	}

});
}
catch(err){}

xmlObj.project.variables[0].variable.forEach(function(v){
  if(v.$.name == "completed") {
            if(v.l == "1"){
              result['objectives']['tested']= true;
            }}
 });
   // If all objectives are completed, result.completed = true
   var completed = true;
   for (var property in result['objectives']) {
       if (result['objectives'][property] != true) {
           completed = false;
       }
   }

   result['completed'] = completed;

	if (result['objectives']['on END received'] == false) 
		result.html = "You are not using the correct event type! You want to change the scene after the message 'End' has been received! Keep trying!";
   	else if (result['objectives']['if statement'] == false)
   		result.html = "Use the script that was already given to you and add to it! You need an if statement after the event! Keep trying";
   	else if (result['objectives']['less than'] == false)
   		result.html = "You need to use the if statement to compare two things! Go to the operators category and drag the one that is most useful here!";
   	else if (result['objectives']['score'] == false || result['objectives']['5'] == false)
   		result.html = "You need to compare the variable 'score' to the number 5 to check that the score is less than 5...that is how the user would have lost. Keep trying!";
   	else if (result['objectives']['switch background'] == false)
   		result.html = "You are so close! After comparing the score to the maximum number of point (5), you want to change the background only if the score is less than that number! Check that you changed the background in that case! ";
   	else if (result['objectives']['correct background'] == false)
   		result.html = "You're almost done! You want to switch to the background named 'lost' if the user lost. Check that you have done that and click the green checkmark again!";
   	else if (result['objectives']['tested'] == false)
      result.html = "You are very close! Test by getting a score lower than 5 that the background 'lost' pops up, then click the green checkmark again!";
    else if (completed == true)
   		result.html = "Congratulations! You completed this task!";
    return result;
};
