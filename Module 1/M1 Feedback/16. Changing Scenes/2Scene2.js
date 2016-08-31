// Author: Iris and Diana Franklin
// Project:  Scene 2 scene changes.  Data structures show what the initialization should look like
// Now there are two scenes.  state applies to get ready script and when One pressed.
//  scene2_state applies to when Two pressed.
// Status: Logic is in, need to put in feedback and then test the logic.
// 
// url: https://octopi.herokuapp.com/laplaya_tasks/237
// https://octopi.herokuapp.com/laplaya_tasks/236/base_file

exports.process = function (xmlObj) {
    var result = {};
    result['objectives'] = {};
    /*
     */
    // I am taking out looking at the get ready script - they are given
    //var script_names = Array("initial","scene1","scene2");
    var script_names = Array("scene1", "scene2");

    var i;
    var script_name;
    for (i = 0; i < script_names.length; i++) {
        script_name = script_names[i];
        result['objectives'][script_name] = {};
        result['objectives'][script_name]['Plant_script'] = false;
        result['objectives'][script_name]['Plant_event'] = false;
        result['objectives'][script_name]['Plant_costume'] = false;
        result['objectives'][script_name]['Plant_othercostume'] = true;

        result['objectives'][script_name]['Two_script'] = false;
        result['objectives'][script_name]['Two_event'] = false;
        result['objectives'][script_name]['Two_costume'] = false;
        result['objectives'][script_name]['Two_othercostume'] = true;

        result['objectives'][script_name]['One_script'] = false;
        result['objectives'][script_name]['One_event'] = false;
        result['objectives'][script_name]['One_costume'] = true;
        result['objectives'][script_name]['One_othercostume'] = true;

        result['objectives'][script_name]['Sun_script'] = false;
        result['objectives'][script_name]['Sun_event'] = false;
        result['objectives'][script_name]['Sun_show'] = false;
        result['objectives'][script_name]['Sun_othershow'] = true;

        result['objectives'][script_name]['Rainbow_script'] = false;
        result['objectives'][script_name]['Rainbow_event'] = false;
        result['objectives'][script_name]['Rainbow_show'] = false;
        result['objectives'][script_name]['Rainbow_othershow'] = true;

        // make sure they don't hide ones that stay there
        result['objectives'][script_name]['Cloud_othershow'] = true;
        result['objectives'][script_name]['Planet_othershow'] = true;
        result['objectives'][script_name]['One_othershow'] = true;
        result['objectives'][script_name]['Two_othershow'] = true;
    }
    result.html = "Hi!";

    result['error_type'] = 0;
    var error_type;

    // check if one or two are hidden and if sun/rainbow have a costume

    var current;
    var state = {};
    state["initial"] = {};
    state["initial"]["Plant"] = {costume: "Sapling", show: null, size: null}; // show
    state["initial"]["Two"] = {costume: "normal", show: null, size: null};
    state["initial"]["One"] = {costume: "selected", show: null, size: null};
    state["initial"]["Sun"] = {costume: null, show: "hide"};
    state["initial"]["Rainbow"] = {costume: null, show: "hide", size: null};
    state["initial"]["Cloud"] = {costume: null, show: null, size: null};  // show

    // store the initial state twice!
    state["scene1"] = {};
    state["scene1"]["Plant"] = {costume: "Sapling", show: null, size: null}; // show
    state["scene1"]["Two"] = {costume: "normal", show: null, size: null};
    state["scene1"]["One"] = {costume: "selected", show: null, size: null};
    state["scene1"]["Sun"] = {costume: null, show: "hide"};
    state["scene1"]["Rainbow"] = {costume: null, show: "hide", size: null};
    //state["scene1"]["Cloud"] = {costume: null, show: null, size: null};  // show

    // Now the specifications for scene 2    
    state["scene2"] = {};
    state["scene2"]["Plant"] = {costume: "Flower", show: null, size: null}; // show
    state["scene2"]["Two"] = {costume: "selected", show: null, size: null};
    state["scene2"]["One"] = {costume: "normal", show: null, size: null};
    state["scene2"]["Sun"] = {costume: null, show: "show"};
    state["scene2"]["Rainbow"] = {costume: null, show: "show", size: null};
    //state["scene2"]["Cloud"] = {costume: null, show: "null", size: null};  // show


    try {
        //################################################################//
        //Helper functions
        function checkSwitchCostume(scene, block) {
            console.log("costume?");
            //result.html += "<br>Costume?";
            var block_type = block.$.s;
            if (block_type == "doSwitchToCostume") {
                //result.html += "  Costume!";
                if (block.l[0] == state[scene][current].costume) {
                    //result.html += "costume: true<br>";
                    result['objectives'][scene][current + '_costume'] = true;
                }
                else {
                    //result.html += "othercostume: false<br>";
                    result['objectives'][scene][current + '_othercostume'] = false;
                }
            }
        }

        function checkSize(scene, block) {
            console.log("size?");
            //result.html += "<br>Size?";
            var block_type = block.$.s;
            //result.html += "Block: "+block_type+"<br>";
            if (block_type == "setScaleDropDown") {
                //result.html += "  Size!";
                var sz = parseInt(block.l[0]);
                var target = state[scene][current].size;
                if ((sz >= target * 0.8) && (sz <= target * 1.2)) {
                    //result.html += "size: true<br>";
                    result['objectives'][scene][current + '_size'] = true;
                }
            }
        }

        function checkHideOrShow(scene, block) {
            console.log("show?");
            //result.html += "<br>Show?";
            var block_type = block.$.s;
            var visibility = state[scene][current].show;
            if ((block_type == "hide") || (block_type == "show")) {
                //result.html += "  Show!";
                if (block_type == visibility) {
                    //result.html += "show: true<br>";
                    result['objectives'][scene][current + '_show'] = true;
                }
                else {
                    //result.html += "othershow: false<br>";
                    result['objectives'][scene][current + '_othershow'] = false;
                }
            }

        }

        //################################################################//
        // Parse XML

        // go through each sprite to look for scripts
        /*
         */
        //var counter = 0;
        xmlObj.project.stage[0].sprites[0].sprite.forEach(function (sprites) {
            current = sprites.$.devName;
            //result.html += "<br>sprite: " + current;
            // if there is an initial state for this sprite
            if (state["initial"][current]) {
                // if there is no script, then they need to get started!
                if (!sprites.scripts[0].script)
                    noScript.push(current);
                // look at the script
                else {
                    //var wrong_event = false;
                    // look through each script
                    sprites.scripts[0].script.forEach(function (scr) {
                        console.log("HERE?");
                        // check to see if it is the right event
                        var event_name = scr.block[0].$.s;
                        //result.html += "<br>" + event_name;
                        if ((event_name == "otherReceiveClick") || (event_name == "receiveClick")) {
                            var scene;
                            //var keepgoing = true;
                            //var which_event; // DIANA
                            result['objectives']["scene1"][current + '_script'] = true;
                            result['objectives']["scene2"][current + '_script'] = true;
                            var othersprite;
                            if (event_name == "otherReceiveClick")
                                othersprite = scr.block[0].l[0];
                            else
                                othersprite = current;

                            // check if it is when One or Two clicked
                            // result.html += "<br>other: "+othersprite;
                            if (othersprite == "One") {
                                //result.html += "<br>One";
                                scene = "scene1";
                                result['objectives'][scene][current + '_event'] = true;
                                // for each block in the script
                                scr.block.forEach(function (b) {
                                    console.log("loop");
                                    console.log(current);
                                    if (state[scene][current].costume)
                                        checkSwitchCostume(scene, b);
                                    if (state[scene][current].show)
                                        checkHideOrShow(scene, b);
                                    if (state[scene][current].size > 0)
                                        checkSize(scene, b);
                                }); // end for each block in the get ready script
                            } // end scene 1
                            else if (othersprite == "Two") {
                                //result.html += "<br>Two";
                                scene = "scene2";
                                result['objectives'][scene][current + '_event'] = true;
                                // for each block in the script
                                scr.block.forEach(function (b) {
                                    console.log("loop");
                                    console.log(current);
                                    if (state[scene][current].costume)
                                        checkSwitchCostume(scene, b);
                                    if (state[scene][current].show)
                                        checkHideOrShow(scene, b);
                                    if (state[scene][current].size > 0)
                                        checkSize(scene, b);
                                }); // end for each block in the get ready script
                            } // scene 2
                            // wrong one! DIANA
                            else {
                            }
                        }
                        else if (event_name == "receiveClick") {
                            // if this is a One or Two sprite, then this is like otherSpriteClicked!
                            // they just need to switch costume
                        }
                    }); // end for each script in the sprite
                }
            } // if there is an initial state for this sprite
        }); // for each sprite
        /*
         */
    }
    catch (err) {
    }
    finally {
        //##############################################//
        // Feedback
        var completed = true;
        error_type = 0;
        for (var scene in result['objectives']) {
            for (var property in result['objectives'][scene]) {
                if (result['objectives'][scene][property] != true) {
                    completed = false;
                    //result.html += "Not completed: " + scene + property + "<br>";
                }
            }
        }

        for (i = 0; i < script_names.length; i++) {
            script_name = script_names[i];
            if (result['objectives'][script_name]['Plant_script'] == false) {
                result.html += "Make sure that you have a plant script for " + script_name + "!";
                error_type = 1;
            } else if (result['objectives'][script_name]['Plant_event'] == false) {
                result.html += "Make sure that you are using the correct event for the plant in " + script_name + "!";
                error_type = 2;
            } else if (result['objectives'][script_name]['Plant_costume'] == false ||
                result['objectives'][script_name]['Plant_othercostume'] == false) {
                result.html += "Make sure that you set the plant costume correctly for " + script_name + "!";
                error_type = 3;
            }

            if (result['objectives'][script_name]['One_script'] == false) {
                result.html += "Make sure that you have a One script for " + script_name + "!";
                error_type = 1;
            } else if (result['objectives'][script_name]['One_event'] == false) {
                result.html += "Make sure that you are using the correct event for the One in " + script_name + "!";
                error_type = 2;
            } else if (result['objectives'][script_name]['One_costume'] == false ||
                result['objectives'][script_name]['One_othercostume'] == false) {
                result.html += "Make sure that you set the One costume correctly for " + script_name + "!";
                error_type = 3;
            }

            if (result['objectives'][script_name]['Two_script'] == false) {
                result.html += "Make sure that you have a Two script for " + script_name + "!";
                error_type = 1;
            } else if (result['objectives'][script_name]['Two_event'] == false) {
                result.html += "Make sure that you are using the correct event for the Two in " + script_name + "!";
                error_type = 2;
            } else if (result['objectives'][script_name]['Two_costume'] == false ||
                result['objectives'][script_name]['One_othercostume'] == false) {
                result.html += "Make sure that you set the Two costume correctly for " + script_name + "!";
                error_type = 3;
            }

            if (result['objectives'][script_name]['Sun_script'] == false) {
                result.html += "Make sure that you have a Sun script for " + script_name + "!";
                error_type = 1;
            } else if (result['objectives'][script_name]['Sun_event'] == false) {
                result.html += "Make sure that you are using the correct event for the Sun in " + script_name + "!";
                error_type = 2;
            } else if (result['objectives'][script_name]['Sun_show'] == false ||
                result['objectives'][script_name]['Sun_othershow'] == false) {
                result.html += "Make sure that you hide or show the Sun correctly for " + script_name + "!";
                error_type = 3;
            }

            if (result['objectives'][script_name]['Rainbow_script'] == false) {
                result.html += "Make sure that you have a Rainbow script for " + script_name + "!";
                error_type = 1;
            } else if (result['objectives'][script_name]['Rainbow_event'] == false) {
                result.html += "Make sure that you are using the correct event for the Rainbow in " + script_name + "!";
                error_type = 2;
            } else if (result['objectives'][script_name]['Rainbow_show'] == false ||
                result['objectives'][script_name]['Rainbow_othershow'] == false) {
                result.html += "Make sure that you hide or show the Rainbow correctly for " + script_name + "!";
                error_type = 3;
            }

            // make sure they don't hide ones that stay there
            if (result['objectives'][script_name]['Cloud_othershow'] != true) {
                result.html += "Make sure that you don't hide the Cloud!";
                error_type = 3;
            }

            if (result['objectives'][script_name]['Planet_othershow'] != true) {
                result.html += "Make sure that you don't hide the Planet!";
                error_type = 3;
            }

            if (result['objectives'][script_name]['One_othershow'] != true) {
                result.html += "Make sure that you don't hide the One!";
                error_type = 3;
            }

            if (result['objectives'][script_name]['Two_othershow'] != true) {
                result.html += "Make sure that you don't hide the Two!";
                error_type = 3;
            }
        }

        result['error_type'] = error_type;
        result['completed'] = completed;

        return result;

    }
};
