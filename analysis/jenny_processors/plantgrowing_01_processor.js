var plantgrowing_01 = {};

plantgrowing_01.analyzeThisProject = function (xmlObj) {
    var result = {};
    result['objectives'] = {};
    result['objectives']['initialize_Stage'] = false;
    result['objectives']['initialize_Plant'] = false;
    result['objectives']['initialize_Sun'] = false;
    result['objectives']['initialize_Cloud'] = false;
    result['objectives']['initialize_One'] = false;
    result['objectives']['initialize_Two'] = false;
    result['objectives']['initialize_Three'] = false;

    // Check the stage initialization
    var stageScripts = xmlObj.project.stage[0].scripts[0].script;
    for(var s in stageScripts){
        if(stageScripts[s].block[0].$.s == "receiveGo" & stageScripts[s].block[0].$.isFrozen == "false"){
            if(stageScripts[s].block[1].$.s == "doSwitchToCostume" & stageScripts[s].block[1].$.isFrozen == "false"){
                if(stageScripts[s].block[1].l == "Scene1"){
                    result['objectives']['initialize_Stage'] = true;
                } 
            } 
        }
    }

    // Check the Sprites initialization
    var sprites = xmlObj.project.stage[0].sprites[0].sprite;
    for(var s in sprites){
        // Check the One sprite initialization
        if(sprites[s].$.name == "One"){
            for(var i in sprites[s].scripts[0].script){
                if(sprites[s].scripts[0].script[i].block[0].$.s == "receiveGo"){
                    if(sprites[s].scripts[0].script[i].block[1].$.s == "doSwitchToCostume"){
                        if(sprites[s].scripts[0].script[i].block[1].l == "selected"){
                            result['objectives']['initialize_One'] = true;
                        } 
                    } 
                }
            }
        }
        // Check the Two sprite initialization
        if(sprites[s].$.name == "Two"){
            for(var i in sprites[s].scripts[0].script){
                if(sprites[s].scripts[0].script[i].block[0].$.s == "receiveGo"){
                    if(sprites[s].scripts[0].script[i].block[1].$.s == "doSwitchToCostume"){
                        if(sprites[s].scripts[0].script[i].block[1].l == "normal"){
                            result['objectives']['initialize_Two'] = true;
                        } 
                    } 
                }
            }
        }
        // Check the Three sprite initialization
        if(sprites[s].$.name == "Three"){
            for(var i in sprites[s].scripts[0].script){
                if(sprites[s].scripts[0].script[i].block[0].$.s == "receiveGo"){
                    if(sprites[s].scripts[0].script[i].block[1].$.s == "doSwitchToCostume"){
                        if(sprites[s].scripts[0].script[i].block[1].l == "normal"){
                            result['objectives']['initialize_Three'] = true;
                        }
                    }
                }
            }
        }
        // Check the Sun sprite initialization
        var sunPlacement = false;
        var sunHide = false;
        // No need to check costume, because that is done when scene change
        if(sprites[s].$.name == "Sun"){
            for(var i in sprites[s].scripts[0].script){
                if(sprites[s].scripts[0].script[i].block[0].$.s == "receiveGo"){
                    for(var j in sprites[s].scripts[0].script[i].block){
                        if(sprites[s].scripts[0].script[i].block[j].$.s == "gotoXYNegative"){
                            sunPlacement = true;
                        }
                        if(sprites[s].scripts[0].script[i].block[j].$.s == "hide"){
                            sunHide = true;
                        }
                        if(sprites[s].scripts[0].script[i].block[j].$.s == "show"){
                            sunHide = false;
                        }
                    }
                }
            }
        }
        if(sunPlacement == true && sunHide == true){
            result['objectives']['initialize_Sun'] = true;
        }

        // Check the Cloud sprite initialization
        var cloudCostume = false;
        var cloudPlacement = false;
        var cloudShow = false;
        if(sprites[s].$.name == "Cloud"){
            for(var i in sprites[s].scripts[0].script){
                if(sprites[s].scripts[0].script[i].block[0].$.s == "receiveGo"){
                    for(var j in sprites[s].scripts[0].script[i].block){
                        if(sprites[s].scripts[0].script[i].block[j].$.s == "doSwitchToCostume"){
                            if(sprites[s].scripts[0].script[i].block[j].l == "Not raining"){
                                cloudCostume = true;
                            }
                            else{
                                cloudCostume = false;
                            }
                        }
                        if(sprites[s].scripts[0].script[i].block[j].$.s == "gotoXYNegative"){
                            cloudPlacement = true;
                        }
                        if(sprites[s].scripts[0].script[i].block[j].$.s == "hide"){
                            cloudShow = false;
                        }
                        if(sprites[s].scripts[0].script[i].block[j].$.s == "show"){
                            cloudShow = true;
                        }
                    }
                }
            }
        }
        if(cloudPlacement == true && cloudCostume == true && cloudShow == true){
            result['objectives']['initialize_Cloud'] = true;
        }

        // Check the Plant initialization
        var plantCostume = false;
        var plantPlacement = false;
        // No need to check if plant is showing, it is never hiding
        if(sprites[s].$.name == "Plant"){
            for(var i in sprites[s].scripts[0].script){
                if(sprites[s].scripts[0].script[i].block[0].$.s == "receiveGo"){
                    for(var j in sprites[s].scripts[0].script[i].block){
                        if(sprites[s].scripts[0].script[i].block[j].$.s == "doSwitchToCostume"){
                            if(sprites[s].scripts[0].script[i].block[j].l == "Seed"){
                                plantCostume = true;
                            }
                            else{
                                plantCostume = false;
                            }
                        }
                        if(sprites[s].scripts[0].script[i].block[j].$.s == "gotoXYNegative"){
                            plantPlacement = true;
                        }
                    }
                }
            }
        }
        if(plantCostume == true && plantPlacement == true){
            result['objectives']['initialize_Plant'] = true;
        }

    }

    var completed = true;
    for (var property in result['objectives']) {
        if (result['objectives'][property] != true) {
            completed = false;
        }
    }
    result['completed'] = completed;
    return result;
}

plantgrowing_01.htmlwrapper = function(result){
    var html = [];
    if(result['completed'] == true){
        html.push('<p>Complete</p>');
    }
    else{
        if(result['objectives']['initialize_Stage'] == false){
            html.push('<p>The Stage is not properly initialized</p>');
        }
        if(result['objectives']['initialize_Plant'] == false){
            html.push('<p>The Plant sprite is not properly initialized</p>');
        }
        if(result['objectives']['initialize_Sun'] == false){
            html.push('<p>The Sun sprite is not properly initialized</p>');
        }
        if(result['objectives']['initialize_Cloud'] == false){
            html.push('<p>The Cloud sprite is not properly initialized</p>');
        }
        if(result['objectives']['initialize_One'] == false){
            html.push('<p>The One sprite is not properly initialized</p>');
        }
        if(result['objectives']['initialize_Two'] == false){
            html.push('<p>The Two sprite is not properly initialized</p>');
        }
        if(result['objectives']['initialize_Three'] == false){
            html.push('<p>The Three sprite is not properly initialized</p>');
        }
    }

    return html;
}
