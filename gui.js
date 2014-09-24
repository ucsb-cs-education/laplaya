/*

 gui.js

 a programming environment
 based on morphic.js, blocks.js, threads.js and objects.js
 inspired by Scratch

 written by Jens Mönig

 napCloud

 Copyright (C) 2014 by Jens Mönig

 This file is part of Snap!.

 Snap! is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of
 the License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.


 prerequisites:
 --------------
 needs blocks.js, threads.js, objects.js and morphic.js


 toc
 ---
 the following list shows the order in which all constructors are
 defined. Use this list to locate code in this document:

 IDE_Morph
 ProjectDialogMorph
 SpriteIconMorph
 TurtleIconMorph
 CostumeIconMorph
 WardrobeMorph


 credits
 -------
 Nathan Dinsmore contributed saving and loading of projects,
 ypr-Snap! project conversion and countless bugfixes
 Ian Reynolds contributed handling and visualization of sounds

 */

/*global modules, Morph, SpriteMorph, BoxMorph, SyntaxElementMorph, Color,
 ListWatcherMorph, isString, TextMorph, newCanvas, useBlurredShadows,
 radians, VariableFrame, StringMorph, Point, SliderMorph, MenuMorph,
 morphicVersion, DialogBoxMorph, ToggleButtonMorph, contains,
 ScrollFrameMorph, StageMorph, PushButtonMorph, InputFieldMorph, FrameMorph,
 Process, nop, SnapSerializer, ListMorph, detect, AlignmentMorph, TabMorph,
 Costume, CostumeEditorMorph, MorphicPreferences, touchScreenSettings,
 standardSettings, Sound, BlockMorph, ToggleMorph, InputSlotDialogMorph,
 ScriptsMorph, isNil, SymbolMorph, BlockExportDialogMorph,
 BlockImportDialogMorph, SnapTranslator, localize, List, InputSlotMorph,
 SnapCloud, Uint8Array, HandleMorph, SVG_Costume, fontHeight, hex_sha512,
 sb, CommentMorph, CommandBlockMorph, BlockLabelPlaceHolderMorph, Audio*/

// Global stuff ////////////////////////////////////////////////////////

modules.gui = '2014-February-13';

// Declarations

var IDE_Morph;
var ProjectDialogMorph;
var SpriteIconMorph;
var CostumeIconMorph;
var TurtleIconMorph;
var WardrobeMorph;
var SoundIconMorph;
var JukeboxMorph;

// IDE_Morph ///////////////////////////////////////////////////////////

// I am SNAP's top-level frame, the Editor window

// IDE_Morph inherits from Morph:

IDE_Morph.prototype = new Morph();
IDE_Morph.prototype.constructor = IDE_Morph;
IDE_Morph.uber = Morph.prototype;

// IDE_Morph preferences settings and skins

IDE_Morph.prototype.setDefaultDesign = function () { //previously setFlatDesign
    MorphicPreferences.isFlat = true;
    SpriteMorph.prototype.paletteColor = new Color(211, 207, 198);//new Color(255, 255, 255);
    SpriteMorph.prototype.paletteTextColor = new Color(70, 70, 70);
    StageMorph.prototype.paletteTextColor
        = SpriteMorph.prototype.paletteTextColor;
    StageMorph.prototype.paletteColor = SpriteMorph.prototype.paletteColor;
    SpriteMorph.prototype.sliderColor = SpriteMorph.prototype.paletteColor.darker(100);

    IDE_Morph.prototype.buttonContrast = 30;
    IDE_Morph.prototype.backgroundColor = new Color(69, 63, 55);
    IDE_Morph.prototype.frameColor = SpriteMorph.prototype.paletteColor;

    IDE_Morph.prototype.groupColor = new Color(180, 174, 163);//new Color(230, 230, 230);
    IDE_Morph.prototype.sliderColor = SpriteMorph.prototype.sliderColor;
    IDE_Morph.prototype.buttonLabelColor = new Color(70, 70, 70);
    IDE_Morph.prototype.tabColors = [
        IDE_Morph.prototype.groupColor.lighter(80),
        IDE_Morph.prototype.groupColor.darker(20),
        IDE_Morph.prototype.groupColor
    ];
    IDE_Morph.prototype.rotationStyleColors = [
        IDE_Morph.prototype.groupColor,
        IDE_Morph.prototype.groupColor.darker(10),
        IDE_Morph.prototype.groupColor.darker(15)
    ];
    IDE_Morph.prototype.appModeColor = IDE_Morph.prototype.frameColor;
    IDE_Morph.prototype.scriptsPaneTexture = IDE_Morph.prototype.root_path + 'scriptsPaneTexture2.png';
    IDE_Morph.prototype.padding = 1;

    SpriteIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    CostumeIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    SoundIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    TurtleIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
};

IDE_Morph.prototype.getLogTime = function () {
    return (new Date).getTime(); //TODO: Change to getLogTime() when this is pushed to the server
};

//Log Change Function
IDE_Morph.prototype.updateLog = function (json) {
    json.date = this.getLogTime();

    this.log.data.push(json);
    //console.log(JSON.stringify(json));
};

// Offsetting the first 13 hex numbers by a hex portion of the timestamp. That way, even if Math.random is on the same
// seed, both clients would have to generate the UUID at the exact same millisecond (or 10,000+ years later) to get the
// same UUID
function generateUUID() { //
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};

//IDE_Morph.prototype.setDefaultDesign();

// IDE_Morph instance creation:

function IDE_Morph(paramsDictionary) {
    if (typeof paramsDictionary == 'undefined') {
        paramsDictionary = {};
    }
    this.init(paramsDictionary);
}

IDE_Morph.prototype.init = function (paramsDictionary) {
    // global font setting
    MorphicPreferences.globalFontFamily = 'Helvetica, Arial';

    var getParamsVal = function (key, defaultVal) {
        var val = paramsDictionary[key];
        if (typeof defaultVal == 'undefined') {
            defaultVal = 'undefined'
        }
        return (typeof val != 'undefined' ?
            val : defaultVal);
    };

    //Setting developer mode based on html
    this.developer = getParamsVal('developerMode', false);
    this.developerMode = this.developer; //to initialize settings button correctly

    //Prioritized file ID - This will load first if it exists, regardless of sandbox mode
    this.loadFileID = getParamsVal('fileID', 'undefined');

    //Setting demo mode based on html
    this.demoMode = getParamsVal('demoMode', false);

    //Setting push state base URL
    this.pushStateBase = getParamsVal('pushStateBase', '');

    this.analysisProcessor = null;
    this.instructions = null;

    //Setting root path, next task, previous task, exit
    IDE_Morph.prototype.root_path = getParamsVal('root_path', '');
    IDE_Morph.prototype.prevTaskPath = getParamsVal('prevTask', '');
    IDE_Morph.prototype.nextTaskPath = getParamsVal('nextTask', '');
    IDE_Morph.prototype.returnPath = getParamsVal('returnPath', '');
    //this.createControlBar();

    this.setDefaultDesign();
    // restore saved user preferences
    this.userLanguage = null; // user language preference for startup
    this.applySavedSettings();

    //Log for tracking students' changes
    this.log = { data: [], logHash: generateUUID(), parentHash: getParamsVal('parentHash', null) };
    this.unsavedChanges = false;

    // additional properties:
    this.cloudMsg = null;
    this.source = 'local';
    this.serializer = new SnapSerializer();

    this.globalVariables = new VariableFrame();
    this.currentSprite = new SpriteMorph(this.globalVariables);
    if (this.developer) {
        this.currentSprite.devName = this.currentSprite.name;
    }
    this.sprites = new List([this.currentSprite]);
    this.currentCategory = 'motion';
    this.currentTab = 'scripts';
    this.currentSpriteTab = 'Sprites';
    this.allowTurbo = true;
    this.currentState = 0;
    this.currentEvent = null;
    this.projectName = '';
    this.projectNotes = '';
    this.projectId = '';

    this.importableSprites = true;
    this.logo = null;
    this.controlBar = null;
    this.categories = null;
    this.palette = null;
    this.hiddenBlocks = null;
    this.spriteBar = null;
    this.spriteEditor = null;
    this.stage = null;
    this.corralBar = null;
    this.corral = null;
    this.hasHatThumbnails = false; // toggle events tab view (ETV) modes
    this.lastEventsHat = null; // live toggle of ETV for developers

    this.isAutoFill = true; // used to be isAutoFill || true;
    this.isAppMode = false;
    this.isSmallStage = false;
    this.hasGrid = false;
    this.filePicker = null;
    this.hasChangedMedia = false;

    this.isAnimating = true;
    this.stageRatio = 1; // for IDE animations, e.g. when zooming

    this.loadNewProject = false; // flag when starting up translated
    this.shield = null;

    // initialize inherited properties:
    IDE_Morph.uber.init.call(this);

    // override inherited properites:
    this.color = this.backgroundColor;
    if (this.developer) {
        StageMorph.prototype.setHiddenBlocks();
    }
    else {
        StageMorph.prototype.inPaletteBlocks['whenCompleted'] = false;
    }
    this.paramsBuilder(paramsDictionary);


    // set costume
    var myself = this;
    if (this.currentSprite.costumes.length() == 0) {
        var url = IDE_Morph.prototype.root_path + 'Costumes/octopi.png';
        var img = new Image();
        img.onload = function () {
            var canvas = newCanvas(new Point(img.width, img.height));
            canvas.getContext('2d').drawImage(img, 0, 0);
            myself.setCostumeFromImage(canvas, name);
        };
        IDE_Morph.prototype.setImageSrc(img, url);
    }
};

IDE_Morph.prototype.paramsBuilder = function (paramsDictionary) {
    //Setting Sandbox mode and loading the base file based on html
    if (typeof paramsDictionary.sandboxMode != 'undefined') {
        if (!this.developer) {
            this.sandbox = true;
            if (typeof paramsDictionary.sandboxMode.modulePath_URL != 'undefined') {
                SnapCloud.api.getProjectList.url =
                    paramsDictionary.sandboxMode.modulePath_URL;
                SnapCloud.api.saveProject.url =
                    paramsDictionary.sandboxMode.modulePath_URL;

                if (typeof paramsDictionary.sandboxMode.baseFile_ID != 'undefined') {
                    this.sandboxBaseFile_ID = paramsDictionary.sandboxMode.baseFile_ID;
                }
                else {
                    this.sandboxBaseFile_ID = 'undefined';
                }
            }
        }
        else {
            this.sandbox = false;
        }
    }
    this.buildWithParams();
};

IDE_Morph.prototype.buildWithParams = function () {
    var myself = this,
        message = '',
        id;

    if (this.loadFileID != 'undefined' && this.sandbox) { //loading a student sandbox file
        message = 'Loading Sandbox File...';
        id = this.loadFileID;
    }
    else if (this.sandbox) { //loading a new sandbox
        message = 'Creating New Sandbox...';
        id = this.sandboxBaseFile_ID;
    }
    else if (this.loadFileID != 'undefined') { //loading non-sandbox file
        message = 'Loading File...';
        id = this.loadFileID
    }

    if (message != '') { //only do these steps if we have a fileID to load
        this.nextSteps([
            function () {
                SnapCloud.rawOpenProject({
                        file_id: id,
                        existingMessage: this.showMessage(message)},
                    myself,
                    function () {
                        myself.sprites.asArray().forEach(function (sprite) {
                            sprite.updateScriptNames('Sprite', sprite.name);
                        });
                    }
                );
            },
            function () {
                if (myself.instructions != null) {
                    myself.corralBar.tabBar.tabTo('instructions');
                }
            }
        ]);
    }
};

IDE_Morph.prototype.openIn = function (world) {
    var hash, usr, myself = this, urlLanguage = null;

    this.buildPanes();
    world.add(this);
    if (window.innerWidth < 1000 && this.resized == undefined) {
        this.toggleStageSize(true);
        this.resized = true;
    }
    if (window.innerWidth < 800) {
        alert('Warning: This screen size is not supported');
        this.alerted = true;
    }
    world.userMenu = this.userMenu;

    // get persistent user data, if any
    if (localStorage) {
        usr = localStorage['-snap-user'];
        if (usr) {
            usr = SnapCloud.parseResponse(usr)[0];
            if (usr) {
                SnapCloud.username = usr.username || null;
                SnapCloud.password = usr.password || null;
            }
        }
    }

    // override SnapCloud's user message with Morphic
    SnapCloud.message = function (string) {
        var m = new MenuMorph(null, string),
            intervalHandle;
        m.popUpCenteredInWorld(world);
        intervalHandle = setInterval(function () {
            m.destroy();
            clearInterval(intervalHandle);
        }, 2000);
    };

    // prevent non-DialogBoxMorphs from being dropped
    // onto the World in user-mode
    world.reactToDropOf = function (morph) {
        if (!(morph instanceof DialogBoxMorph)) {
            if (world.hand.grabOrigin) {
                morph.slideBackTo(world.hand.grabOrigin);
            } else {
                world.hand.grab(morph);
            }
        }
    };

    this.reactToWorldResize(world.bounds);

    function getURL(url) {
        try {
            var request = new XMLHttpRequest();
            request.open('GET', IDE_Morph.prototype.root_path + url, false);
            request.send();
            if (request.status === 200) {
                return request.responseText;
            }
            throw new Error('unable to retrieve ' + url);
        } catch (err) {
            return;
        }
    }

    // dynamic notifications from non-source text files
    // has some issues, commented out for now
    /*
     this.cloudMsg = getURL('http://snap.berkeley.edu/cloudmsg.txt');
     motd = getURL('http://snap.berkeley.edu/motd.txt');
     if (motd) {
     this.inform('Snap!', motd);
     }
     */

    function interpretUrlAnchors() {
        var dict;
        if (location.hash.substr(0, 6) === '#open:') {
            hash = location.hash.substr(6);
            if (hash.charAt(0) === '%'
                || hash.search(/\%(?:[0-9a-f]{2})/i) > -1) {
                hash = decodeURIComponent(hash);
            }
            if (contains(
                ['project', 'blocks', 'sprites', 'snapdata'].map(
                    function (each) {
                        return hash.substr(0, 8).indexOf(each);
                    }
                ),
                1
            )) {
                this.droppedText(hash);
            } else {
                this.droppedText(getURL(hash));
            }
            //.hash is everything after #
        } else if (location.hash.substr(0, 14) === '#octopi-cloud:') {
            hash = location.hash.substr(14);
            this.nextSteps([
                function () {
                    myself.showMessage('Fetching project\nfrom octopi-cloud...');
                },
                function () {
                    myself.setProjectId(null);
                    SnapCloud.rawOpenProject({file_id: hash}, myself);
                }
            ]);
        } else if (location.hash.substr(0, 5) === '#run:') {
            hash = location.hash.substr(5);
            if (hash.charAt(0) === '%'
                || hash.search(/\%(?:[0-9a-f]{2})/i) > -1) {
                hash = decodeURIComponent(hash);
            }
            if (hash.substr(0, 8) === '<project>') {
                this.rawOpenProjectString(hash);
            } else {
                this.rawOpenProjectString(getURL(hash));
            }
            this.toggleAppMode(true);
            this.runScripts('flag');
        } else if (location.hash.substr(0, 6) === '#lang:') {
            urlLanguage = location.hash.substr(6);
            this.setLanguage(urlLanguage);
            this.loadNewProject = true;
        }
    }

    if (this.userLanguage) {
        this.setLanguage(this.userLanguage, interpretUrlAnchors);
    } else {
        interpretUrlAnchors.call(this);
    }
    this.spriteBar.tabBar.tabTo('scripts');
    if (this.instructions != null) {
        this.corralBar.tabBar.tabTo('instructions');
    }
};

// IDE_Morph construction

IDE_Morph.prototype.buildPanes = function () {
    this.createLogo();
    this.createControlBar();
    this.createCategories();
    this.createPalette();
    this.createStage();
    this.createSpriteBar();
    this.createSpriteEditor();
    this.createCorralBar();
    this.createCorral();
};

IDE_Morph.prototype.createLogo = function () {
    var myself = this;

    if (this.logo) {
        this.logo.destroy();
    }

    this.logo = new Morph();
    // TO DO replace logo
    this.logo.texture = IDE_Morph.prototype.root_path + 'LPTrans.png';
    this.logo.drawNew = function () {
        this.image = newCanvas(this.extent());
        var context = this.image.getContext('2d'),
            gradient = context.createLinearGradient(
                0,
                0,
                this.width(),
                0
            );
        gradient.addColorStop(0, 'black');
        gradient.addColorStop(0.38, myself.frameColor.toString());
        context.fillStyle = gradient;//MorphicPreferences.isFlat ?
        // myself.frameColor.toString() : gradient;
        context.fillRect(0, 0, this.width(), this.height());
        if (this.cachedTexture) {
            this.drawCachedTexture();
        }
        else if (this.texture) {
            this.drawTexture(this.texture);
        }
    };

    this.logo.drawCachedTexture = function () {
        var context = this.image.getContext('2d');
        context.drawImage(
            this.cachedTexture,
            5,
            Math.round((this.height() - this.cachedTexture.height) / 2)
        );
        this.changed();
    };

    this.logo.mouseClickLeft = function () {
        myself.snapMenu();
    };

    this.logo.color = new Color();
    this.logo.setExtent(new Point(200, 28)); // dimensions are fixed
    this.add(this.logo);

    this.logo.wantsDropOf = function (droppedMorph) {
        return droppedMorph instanceof BlockMorph ||
            droppedMorph instanceof CommentMorph;
    };

    this.logo.reactToDropOf = function (droppedMorph) {
        if (droppedMorph instanceof BlockMorph ||
            droppedMorph instanceof CommentMorph) {
            if (myself.world().hand.grabOrigin) {
                droppedMorph.slideBackTo(myself.world().hand.grabOrigin);
            }
            else {
                droppedMorph.destroy();
            }
        }
    };
};

IDE_Morph.prototype.createControlBar = function () {
    // assumes the logo has already been created
    var padding = 5,
        button,
        stopButton,
        pauseButton,
        getReadyButton,
        goButton,
        projectButton,
        nextTaskButton,
        lastTaskButton,
        exitButton,
        checkButton,
        settingsButton,
        stageSizeButton,
        appModeButton,
        gridLinesButton,
    //cloudButton,
        x,
        colors = [
            this.groupColor,
            this.frameColor.darker(50),
            this.frameColor.darker(50)
        ],
        myself = this;

    if (this.controlBar) {
        this.controlBar.destroy();
    }
    this.controlBar = new Morph();
    this.controlBar.color = this.frameColor;
    this.controlBar.setHeight(this.logo.height()); // height is fixed
    this.controlBar.mouseClickLeft = function () {
        this.world().fillPage();
    };
    this.add(this.controlBar);

    //smallStageButton
    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the IDE is the target
        'toggleStageSize',
        [
            new SymbolMorph('smallStage', 14),
            new SymbolMorph('normalStage', 14)
        ],
        function () {  // query
            return myself.isSmallStage;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.hint = 'Small Stage';
    button.fixLayout();
    button.refresh();
    stageSizeButton = button;
    this.controlBar.add(stageSizeButton);
    this.controlBar.stageSizeButton = button; // for refreshing

    //appModeButton
    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the IDE is the target
        'toggleAppMode',
        [
            new SymbolMorph('fullScreen', 14),
            new SymbolMorph('normalScreen', 14)
        ],
        function () {  // query
            return myself.isAppMode;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.hint = 'Full Screen';
    button.fixLayout();
    button.refresh();
    appModeButton = button;
    if (!this.demoMode) {
        this.controlBar.add(appModeButton);
    }
    this.controlBar.appModeButton = appModeButton; // for refreshing

    // gridLines button
    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the IDE is the target
        'toggleGridLines',
        [
            new SymbolMorph('grid', 14),
            new SymbolMorph('grid', 14)
        ],
        function () {  // query
            return myself.hasGrid;
        }
    );

    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.hint = 'Add Grid Lines';
    button.fixLayout();
    button.refresh();
    gridLinesButton = button;
    if (!this.demoMode) {
        this.controlBar.add(gridLinesButton);
    }
    this.controlBar.gridLinesButton = gridLinesButton; // for refreshing

    // stopButton
    button = new PushButtonMorph(
        this,
        'stopAllScripts',
        new SymbolMorph('octagon', 14)
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(200, 0, 0);
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.hint = 'Stop';
    button.fixLayout();
    stopButton = button;
    this.controlBar.add(stopButton);

    //pauseButton
    if (StageMorph.prototype.inPaletteBlocks['tab-pauseplay'] == undefined) {
        StageMorph.prototype.inPaletteBlocks['tab-pauseplay'] = true;
    }
    if (this.developer || StageMorph.prototype.inPaletteBlocks['tab-pauseplay'] == true) {

        button = new ToggleButtonMorph(
            null, //colors,
            myself, // the IDE is the target
            'togglePauseResume',
            [
                new SymbolMorph('pause', 12),
                new SymbolMorph('pointRight', 14)
            ],
            function () {  // query
                return myself.isPaused();
            }
        );
        button.userMenu = function () {
            var menu = new MenuMorph(this),
                ide = this.parentThatIsA(IDE_Morph);

            function hidden() {
                var visible = StageMorph.prototype.inPaletteBlocks['tab-pauseplay'];
                if (visible == false) {
                    return true;
                }
                else {
                    return false;
                }
            }

            if (ide && ide.developer) {
                if (hidden()) {
                    menu.addItem(
                        'Show this button',
                        function () {
                            StageMorph.prototype.inPaletteBlocks['tab-pauseplay'] = true;
                            this.labelColor = new Color(255, 220, 0);
                            this.fixLayout();
                            this.refresh();
                        }
                    );
                }
                else {
                    menu.addItem(
                        'Hide this button',
                        function () {
                            StageMorph.prototype.inPaletteBlocks['tab-pauseplay'] = false;
                            this.labelColor = myself.buttonLabelColor.darker(50);
                            ///this.refresh();
                            this.fixLayout();
                            this.refresh();
                        }
                    );
                }
            }
            return menu;
        };
        button.color = colors[0];
        button.highlightColor = colors[1];
        button.pressColor = colors[2];
        button.labelMinExtent = new Point(36, 18);
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = colors[1];
        button.labelColor = new Color(255, 220, 0);
        button.contrast = this.buttonContrast;
        if (StageMorph.prototype.inPaletteBlocks['tab-pauseplay'] == false) {
            button.labelColor = myself.buttonLabelColor.darker(50);
        }
        button.drawNew();
        button.hint = 'Pause/Resume';
        button.fixLayout();
        button.refresh();
        pauseButton = button;
        this.controlBar.add(pauseButton);
        this.controlBar.pauseButton = pauseButton; // for refreshing
    }

    // goButton
    button = new PushButtonMorph(
        this,
        'go',
        new SymbolMorph('flag', 14)
    );
    myself.allowTurbo = true;
    if (this.developer) {
        button.userMenu = function () {
            var menu = new MenuMorph(this);
            if (myself.allowTurbo == false) {
                menu.addItem('Allow turbo',
                    function () {
                        myself.allowTurbo = true;
                        // myself.controlBar.refresh();
                    });
            }
            else {
                menu.addItem('Disallow turbo',
                    function () {
                        myself.allowTurbo = false;
                    });
            }
            return menu;
        }
    }
    button.corner = 12;
    //if (myself.currentState == 2 || myself.currentState == 3) {
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    //button.labelColor = new Color(0, 200, 0);
    //button.labelColor = myself.buttonLabelColor.darker(50);
    button.labelColor = new Color(125, 125, 125);
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.hint = 'Go';
    button.fixLayout();
    goButton = button;
    this.controlBar.add(goButton);
    this.controlBar.goButton = goButton;

    // getReadyButton
    button = new PushButtonMorph(
        this,
        'getReady',
        new SymbolMorph('square', 14)
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(0, 0, 200);
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.hint = 'Get Ready';
    button.fixLayout();
    getReadyButton = button;
    this.controlBar.add(getReadyButton);
    this.controlBar.getReadyButton = getReadyButton;

    // projectButton
    button = new PushButtonMorph(
        this,
        'projectMenu',
        new SymbolMorph('file', 14)
        //'\u270E'
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = this.buttonLabelColor;
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.hint = 'File Menu';
    button.fixLayout();
    projectButton = button;
    this.controlBar.add(projectButton);
    this.controlBar.projectButton = projectButton; // for menu positioning

    // settingsButton
    if (myself.developerMode) {
        button = new PushButtonMorph(
            this,
            'settingsMenu',
            new SymbolMorph('gears', 14)
            //'\u2699'
        );
        button.corner = 12;
        button.color = colors[0];
        button.highlightColor = colors[1];
        button.pressColor = colors[2];
        button.labelMinExtent = new Point(36, 18);
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = colors[1];
        button.labelColor = this.buttonLabelColor;
        button.contrast = this.buttonContrast;
        button.drawNew();
        button.hint = 'Settings';
        button.fixLayout();
        settingsButton = button;
        this.controlBar.add(settingsButton);
        this.controlBar.settingsButton = settingsButton; // for menu positioning
    }

    // nextTaskButton
    if (IDE_Morph.prototype.nextTaskPath != null && IDE_Morph.prototype.nextTaskPath != '') {
        if(myself.saveClicked != undefined) {
            button = new PushButtonMorph(
                this,
                function () {
                myself.confirm(
                    'Are you sure you want to leave this task and go to the next task?',
                    'Next Task',
                    function() {
                    	myself.nextTask();
                    }
                );
            },
                new SymbolMorph('arrowRight', 14)
            );
            button.color = colors[0];
            button.highlightColor = colors[1];
            button.pressColor = colors[2];
            button.hint = 'Next Task';
            button.labelColor = this.buttonLabelColor;
        }
        else { // Save and Check Task Hasn't Been Clicked Yet - Next Task is Available
            button = new PushButtonMorph(
                this,
                nop,
                new SymbolMorph('lock', 14)
            );
            button.color = colors[0];
            button.highlightColor = button.color;
            button.pressColor = button.color;
            button.hint = 'Please Save and Check First';
            button.labelColor = this.buttonLabelColor.lighter(50);
        }
    }
    else { //else there is no next Task, grey it out
        button = new PushButtonMorph(
            this,
            nop,
            new SymbolMorph('arrowRight', 14)
        );
        button.color = colors[0].lighter(25);
        button.highlightColor = button.color;
        button.pressColor = button.color;
        button.hint = 'No Next Task';
        button.labelColor = this.buttonLabelColor.lighter(50);
    }
    button.corner = 12;
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.fixLayout();
    nextTaskButton = button;
    this.controlBar.add(nextTaskButton);
    this.controlBar.nextTaskButton = nextTaskButton; // for menu positioning

    // lastTaskButton
    if (IDE_Morph.prototype.prevTaskPath != null && IDE_Morph.prototype.prevTaskPath != '') {
        button = new PushButtonMorph(
            this,
            function () {
                myself.confirm(
                    'Are you sure you want to leave this task and go back to the previous task?',
                    'Previous Task',
                    function(){
						myself.prevTask();
                    }
                );
            },
            new SymbolMorph('arrowLeft', 14)
        );
        button.color = colors[0];
        button.highlightColor = colors[1];
        button.pressColor = colors[2];
        button.hint = 'Previous Task';
        button.labelColor = this.buttonLabelColor;
    }
    else {
        button = new PushButtonMorph(
            this,
            nop,
            new SymbolMorph('arrowLeft', 14)
        );
        button.color = colors[0].lighter(25);
        button.highlightColor = button.color;
        button.pressColor = button.color;
        button.hint = 'No Previous Task';
        button.labelColor = this.buttonLabelColor.lighter(50);
    }
    button.corner = 12;
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.contrast = this.buttonContrast;
    button.drawNew();

    button.fixLayout();
    lastTaskButton = button;
    this.controlBar.add(lastTaskButton);
    this.controlBar.lastTaskButton = lastTaskButton; // for menu positioning

    // exitButton
    if (IDE_Morph.prototype.returnPath != null && IDE_Morph.prototype.returnPath != '') {
        button = new PushButtonMorph(
            this,
            function () {
                myself.confirm(
                    'Are you sure you want to leave this task?',
                    'Exit',
                    function() {
                    	myself.exitOut();
                    }
                );
            },
            new SymbolMorph('arrowUp', 14)
        );
        button.color = colors[0];
        button.highlightColor = colors[1];
        button.pressColor = colors[2];
        button.hint = 'Exit';
        button.labelColor = this.buttonLabelColor;
    }
    else {
        button = new PushButtonMorph(
            this,
            nop,
            new SymbolMorph('arrowUp', 14)
        );
        button.color = colors[0].lighter(25);
        button.highlightColor = button.color;
        button.pressColor = button.color;
        button.hint = 'No Exit';
        button.labelColor = this.buttonLabelColor.lighter(50);
    }
    button.corner = 12;
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.fixLayout();
    exitButton = button;
    this.controlBar.add(exitButton);
    this.controlBar.exitButton = exitButton; // for menu positioning

    // checkButton
    button = new PushButtonMorph(
        this,
        'saveTask',
        new SymbolMorph('checkMark', 14) //change to check mark
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(0, 200, 0);
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.hint = 'Save and Check Task';
    button.fixLayout();
    checkButton = button;
    this.controlBar.add(checkButton);
    this.controlBar.checkButton = checkButton; // for menu positioning

    this.controlBar.fixLayout = function () {
        x = this.right() - padding;
        if (StageMorph.prototype.inPaletteBlocks['tab-pauseplay'] == undefined || myself.developer || StageMorph.prototype.inPaletteBlocks['tab-pauseplay'] == true) {
            var buttons = [stopButton, pauseButton, goButton, getReadyButton];
        }
        else {
            var buttons = [stopButton, goButton, getReadyButton];
        }
        buttons.forEach(
            function (button) {
                button.setCenter(myself.controlBar.center());
                button.setRight(x);
                x -= button.width();
                x -= padding;
            }
        );

        x = myself.right() - (StageMorph.prototype.dimensions.x
            * (myself.isSmallStage ? myself.stageRatio : 1));

        [stageSizeButton, appModeButton, gridLinesButton].forEach(
            function (button) {
                x += padding;
                button.setCenter(myself.controlBar.center());
                button.setLeft(x);
                x += button.width();
            }
        );

        if (myself.developerMode) {
            projectButton.setCenter(myself.controlBar.center());
            projectButton.setRight(this.left() - padding * 17);

            settingsButton.setCenter(myself.controlBar.center());
            settingsButton.setLeft(projectButton.right() + padding);

            lastTaskButton.setCenter(myself.controlBar.center());
            lastTaskButton.setLeft(settingsButton.right() + padding);

            checkButton.setCenter(myself.controlBar.center());
            checkButton.setLeft(lastTaskButton.right() + padding);

            nextTaskButton.setCenter(myself.controlBar.center());
            nextTaskButton.setLeft(checkButton.right() + padding);

            exitButton.setCenter(myself.controlBar.center());
            exitButton.setLeft(nextTaskButton.right() + padding);
        }
        else {
            projectButton.setCenter(myself.controlBar.center());
            projectButton.setRight(this.left() - padding * 17);

            lastTaskButton.setCenter(myself.controlBar.center());
            lastTaskButton.setLeft(projectButton.right() + padding);

            checkButton.setCenter(myself.controlBar.center());
            checkButton.setLeft(lastTaskButton.right() + padding);

            nextTaskButton.setCenter(myself.controlBar.center());
            nextTaskButton.setLeft(checkButton.right() + padding);

            exitButton.setCenter(myself.controlBar.center());
            exitButton.setLeft(nextTaskButton.right() + padding);
        }

        //cloudButton.setCenter(myself.controlBar.center());
        //cloudButton.setRight(settingsButton.left() - padding);

        this.updateLabel();
    };

    this.controlBar.updateLabel = function () {
        var suffix = myself.world().isDevMode ?
            ' - ' + localize('development mode') : '';

        if (this.label) {
            this.label.destroy();
        }
        if (myself.isAppMode) {
            return;
        }

        this.label = new StringMorph(
                (myself.projectName || localize('untitled')) + suffix,
            14,
            'sans-serif',
            true,
            false,
            false,
            MorphicPreferences.isFlat ? null : new Point(2, 1),
            myself.frameColor.darker(myself.buttonContrast)
        );
        this.label.color = myself.buttonLabelColor;
        this.label.drawNew();
        this.add(this.label);
        this.label.setCenter(this.center());
        this.label.setLeft(this.exitButton.right() + padding);
        var labelMenuPos = this.label.bottomLeft();
    };

    this.controlBar.wantsDropOf = function (droppedMorph) {
        return droppedMorph instanceof BlockMorph ||
            droppedMorph instanceof CommentMorph;
    };

    this.controlBar.reactToDropOf = function (droppedMorph) {
        if (droppedMorph instanceof BlockMorph ||
            droppedMorph instanceof CommentMorph) {
            if (myself.world().hand.grabOrigin) {
                droppedMorph.slideBackTo(myself.world().hand.grabOrigin);
            }
            else {
                droppedMorph.destroy();
            }
        }
    };
};

IDE_Morph.prototype.createCategories = function () {
    // assumes the logo has already been created
    var myself = this;

    if (this.categories) {
        this.categories.destroy();
    }
    this.categories = new Morph();
    this.categories.color = this.groupColor;
    this.categories.silentSetWidth(this.logo.width()); // width is fixed

    var inPalette = StageMorph.prototype.inPaletteBlocks;
    if (this.developer == false && inPalette) {
        if (inPalette['cat-' + this.currentCategory] == false) {
            this.currentCategory = 'motion';
            SpriteMorph.prototype.categories.forEach(function (cat) {
                if (inPalette['cat-' + myself.currentCategory] == false) {
                    if (!contains(['other'], cat)) {
                        if (!(inPalette['cat-' + cat] == false)) {
                            myself.currentCategory = cat;
                        }
                    }
                }
            });
        }
    }

    function addCategoryButton(category) {
        var labelWidth = 75,
            colors = [
                myself.frameColor,
                myself.frameColor.darker(40),
                SpriteMorph.prototype.blockColor[category]
            ],
            button;

        var ide = myself.parentThatIsA(IDE_Morph);
        var hidden = StageMorph.prototype.inPaletteBlocks['cat-' + category];
        if (ide && ide.developer == true && hidden == false) {
            colors = [
                myself.frameColor.darker(30),
                myself.frameColor.darker(10),
                SpriteMorph.prototype.blockColor[category].darker(30)
            ]
        }


        button = new ToggleButtonMorph(
            colors,
            myself, // the IDE is the target
            function () {
                if (myself.currentCategory != category) {
                    myself.updateLog({action: "categoryChange", category: category});
                }
                myself.currentCategory = category;
                myself.categories.children.forEach(function (each) {
                    each.refresh();
                });
                myself.refreshPalette(true);
            },
            category[0].toUpperCase().concat(category.slice(1)), // label
            function () {  // query
                return myself.currentCategory === category;
            },
            null, // env
            null, // hint
            null, // template cache
            labelWidth, // minWidth
            true // has preview
        );

        button.userMenu = function () {
            var menu = new MenuMorph(this),
                ide = this.parentThatIsA(IDE_Morph);

            function hasRemovedBlocks() {
                var defs = SpriteMorph.prototype.blocks,
                    inPalette = StageMorph.prototype.inPaletteBlocks;
                return Object.keys(inPalette).some(function (any) {

                    var temp = defs[any] && (((inPalette[any] == false) && defs[any] &&
                        (defs[any].category === category ||
                            contains((button.more[category] || []), any))) || (inPalette[any] == false
                        && category == 'variables' && any.indexOf('reportGetVar') > -1));
                    return temp;
                });
            }

            function canRemoveBlocks() {
                return myself.palette.contents.children.some(function (any) {
                    return contains(
                        Object.keys(SpriteMorph.prototype.blocks),
                        any.selector
                    );
                });
            }

            if (canRemoveBlocks() && ide.developer) {
                if (!hasRemovedBlocks()) {
                    menu.addItem(
                        'Remove all category blocks',
                        function () {
                            this.changeCategory(false, myself, true);
                        }
                    );
                }
                else {
                    menu.addItem(
                        'Add all category blocks',
                        function () {
                            this.changeCategory(true, myself, true);
                        }
                    );
                }
            }
            return menu;
        };

        button.corner = 8;
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = colors[1];
        button.labelColor = myself.buttonLabelColor.darker(100);
        button.fixLayout();
        button.refresh();
        myself.categories.add(button);
        return button;
    }

    function fixCategoriesLayout() {
        var button = myself.categories.children[0] || null;
        var buttonWidth, buttonHeight;
        if (button) {
            buttonWidth = button.width();
            buttonHeight = button.height();
        }
        else {
            buttonWidth = 75;
            buttonHeight = 17;
        }
        var border = 3,
            rows = Math.ceil((myself.categories.children.length) / 2),
            xPadding = (myself.categories.width()
                - border
                - buttonWidth * 2) / 3,
            yPadding = 2,
            l = myself.categories.left(),
            t = myself.categories.top(),
            i = 0,
            row,
            col;

        if (rows < 5) {
            rows = 5;
        }

        myself.categories.children.forEach(function (button) {
            i += 1;
            row = Math.ceil(i / 2);
            col = 2 - (i % 2);
            button.setPosition(new Point(
                    l + (col * xPadding + ((col - 1) * buttonWidth)),
                    t + (row * yPadding + ((row - 1) * buttonHeight) + border)
            ));
        });

        myself.categories.setHeight(
                (rows + 1) * yPadding
                + rows * buttonHeight
                + 2 * border
        );
    }

    var ide = myself.parentThatIsA(IDE_Morph);
    SpriteMorph.prototype.categories.forEach(function (cat) {
        var hidden = StageMorph.prototype.inPaletteBlocks['cat-' + cat];
        if (ide && ide.developer == false && hidden == false) {
        }
        else {
            if (!contains(['other'], cat)) {
                addCategoryButton(cat);
            }
        }
    });
    fixCategoriesLayout();
    this.add(this.categories);

    this.categories.wantsDropOf = function (droppedMorph) {
        return droppedMorph instanceof BlockMorph ||
            droppedMorph instanceof CommentMorph;
    };

    this.categories.reactToDropOf = function (droppedMorph) {
        if (droppedMorph instanceof BlockMorph ||
            droppedMorph instanceof CommentMorph) {
            if (myself.world().hand.grabOrigin) {
                droppedMorph.slideBackTo(myself.world().hand.grabOrigin);
            }
            else {
                droppedMorph.destroy();
            }
        }
    };
};

IDE_Morph.prototype.createPalette = function () {
    // assumes that the logo pane has already been created
    // needs the categories pane for layout
    var myself = this,
        ide = myself.parentThatIsA(IDE_Morph),
        sprite = ide.currentSprite,
        name = sprite.devName ? sprite.devName : sprite.name;

    if (this.palette) {
        this.palette.destroy();
    }

    //var sprite = new SpriteMorph();
    //sprite.palette = sprite.freshPalette();

    this.palette = this.currentSprite.palette(this.currentCategory);
    this.palette.isDraggable = false;
    this.palette.acceptsDrops = true;
    this.palette.contents.acceptsDrops = false;
    this.palette.wantsDropOf = function (droppedMorph) {
        if (droppedMorph instanceof SpriteMorph) {
            return false;
        }
        else if (droppedMorph instanceof BlockMorph) {
            return true;
        }
        else if (droppedMorph instanceof DialogBoxMorph) {
            return true;
        }
        else if (droppedMorph instanceof SpriteIconMorph) {
            return true;
        }
        else if (droppedMorph instanceof CostumeIconMorph) {
            return true;
        }
        else if (droppedMorph instanceof CommentMorph) {
            return true;
        }
    };

    this.palette.reactToDropOf = function (droppedMorph) {
        if (droppedMorph instanceof DialogBoxMorph) {
            myself.world().add(droppedMorph);
        }
        else if (droppedMorph instanceof SpriteIconMorph) {
            //droppedMorph.destroy();
            //myself.removeSprite(droppedMorph.object);
            droppedMorph.slideBackTo(myself.world().hand.grabOrigin);
        }

        else if (droppedMorph instanceof CostumeIconMorph) {
            //myself.currentSprite.wearCostume(null);
            //droppedMorph.destroy();
            droppedMorph.slideBackTo(myself.world().hand.grabOrigin);
        }
        else if (droppedMorph instanceof BlockMorph) {
            if (droppedMorph.isFrozen && ide && !ide.developer) {
                droppedMorph.slideBackTo(myself.world().hand.grabOrigin);
            }
            else {
                droppedMorph.destroy();
                ide.updateLog({action:'scriptChange', spriteID: name, scriptID:droppedMorph.scriptID,
                    scriptContents: droppedMorph.scriptToString(),
                    blockDiff:droppedMorph.selector, change:'paletteDeletion'});
                ide.unsavedChanges = true;
            }
        }
        else if (droppedMorph instanceof CommentMorph) {
            if (droppedMorph.locked && ide && !ide.developer || ide.currentSprite.isLocked) {
                droppedMorph.slideBackTo(myself.world().hand.grabOrigin);
            }
            else if (droppedMorph.locked && ide && ide.developer) {
                droppedMorph.destroy();
                if (!droppedMorph.block)
                ide.updateLog({action:'scriptChange', spriteID: name, scriptID:droppedMorph.scriptID,
                    scriptContents:'comment', blockDiff:'comment',
                    commentText: droppedMorph.contents.text, change:'paletteDeletion'});
                ide.unsavedChanges = true;
            }
            else if (!droppedMorph.locked) {
                droppedMorph.destroy();
                if (!droppedMorph.block)
                ide.updateLog({action:'scriptChange', spriteID: name, scriptID:droppedMorph.scriptID,
                    scriptContents:'comment', blockDiff:'comment',
                    commentText: droppedMorph.contents.text, change:'paletteDeletion'});
                ide.unsavedChanges = true;
            }
        }
        else {
            droppedMorph.destroy();
        }
    };

    this.palette.setWidth(this.logo.width());
    this.add(this.palette);
    this.palette.scrollX(this.palette.padding);
    this.palette.scrollY(this.palette.padding);
};

IDE_Morph.prototype.createStage = function () {
    // assumes that the logo pane has already been created
    var myself = this;
    if (this.stage) {
        this.stage.destroy();
    }
    StageMorph.prototype.frameRate = 0;
    this.stage = new StageMorph(this.globalVariables);
    this.stage.setExtent(this.stage.dimensions); // dimensions are fixed
    if (this.currentSprite instanceof SpriteMorph) {
        this.currentSprite.setPosition(
            this.stage.center().subtract(
                this.currentSprite.extent().divideBy(2)
            )
        );
        this.stage.add(this.currentSprite);
    }
    this.add(this.stage);
};

window.onresize = function () {
    if (window.world) {
        var ide = window.world.children[0];
        if (window.innerWidth <= 1000) {
            if (ide && ide.resized == undefined) {
                ide.toggleStageSize(true);
                ide.resized = true;
            }
            if (ide && ide.alerted == undefined) {
                if (window.innerWidth < 800) {
                    alert('Warning: This screen size is not supported');
                    ide.alerted = true;
                }
            }
        }
        if (window.innerWidth > 1000) {
            if (ide.resized != undefined) {
                ide.resized = undefined;
            }
        }
    }
};

window.onkeydown = function (event) {

    if (event.which == 8) {

        event.preventDefault();  //prevents backspace from tabbing back in IE

    }
    ;

};

IDE_Morph.prototype.createSpriteBar = function () {
    // assumes that the categories pane has already been created
    var rotationStyleButtons = [],
        thumbSize = new Point(45, 45),
        nameField,
        padlock,
        thumbnail,
        tabCorner = 15,
        tabColors = this.tabColors,
        tabBar = new AlignmentMorph('row', -tabCorner * 2),
        tab,
        myself = this,
        ide = this.parentThatIsA(IDE_Morph),
        sprite = this.currentSprite,
        name = sprite.devName ? sprite.devName : sprite.name,
        logObj = {};

    if (this.spriteBar) {
        this.spriteBar.destroy();
    }

    this.spriteBar = new Morph();
    this.spriteBar.color = this.frameColor;
    this.add(this.spriteBar);

    function addRotationStyleButton(rotationStyle) {
        var colors = myself.rotationStyleColors,
            button,
            buttonLabel;


        button = new ToggleButtonMorph(
            colors,
            myself, // the IDE is the target
            function () {
                if (myself.currentSprite instanceof SpriteMorph) {
                    if (myself.currentSprite.isLocked && !myself.developer) {

                    }
                    else {
                        myself.currentSprite.rotationStyle = rotationStyle;
                        myself.currentSprite.changed();
                        myself.currentSprite.drawNew();
                        myself.currentSprite.changed();
                    }
                    rotationStyleButtons.forEach(function (each) {
                        each.refresh();
                    });
                }
                switch (rotationStyle) {
                    case 0:
                        buttonLabel = 'don\'t rotate';
                        break;
                    case 1:
                        buttonLabel = 'can rotate';
                        break;
                    case 2:
                        buttonLabel = 'only face left/right';
                        break;
                    case 3:
                        buttonLabel = 'mirror image';
                        break;
                }
                logObj = {action: 'buttonClick', button: buttonLabel, spriteID: name};
                ide.updateLog(logObj);
                ide.unsavedChanges = true;
            },
            ['\u2192', '\u21BB', '\u2194', '\u21eb'][rotationStyle], // label
            function () {  // query
                return myself.currentSprite instanceof SpriteMorph
                    && myself.currentSprite.rotationStyle === rotationStyle;
            },
            null, // environment
            localize(
                [
                    'don\'t rotate', 'can rotate', 'only face left/right', 'mirror image'
                ][rotationStyle]
            )
        );

        button.corner = 8;
        button.labelMinExtent = new Point(11, 11);
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = colors[1];
        button.labelColor = myself.buttonLabelColor;
        button.fixLayout();
        button.refresh();
        rotationStyleButtons.push(button);
        button.setPosition(myself.spriteBar.position().add(2));
        button.setTop(button.top()
                + ((rotationStyleButtons.length - 1) * (button.height() + 2))
        );
        myself.spriteBar.add(button);
        if (myself.currentSprite instanceof StageMorph) {
            button.hide();
        }
        return button;
    }

    if (myself.currentEvent == null) {
        addRotationStyleButton(1);
        addRotationStyleButton(2);
        addRotationStyleButton(0);
    }
    addRotationStyleButton(3);
    this.rotationStyleButtons = rotationStyleButtons;
    if (myself.currentEvent != null) {
        this.rotationStyleButtons[0].hide();
    }

    thumbnail = new Morph();
    thumbnail.setExtent(thumbSize);
    if (myself.currentEvent != null) {
        thumbnail.setExtent(new Point(myself.currentEvent.bounds.width(), 45));
        thumbnail.image = myself.currentEvent.fullImageClassic();
        thumbnail.setPosition(
            rotationStyleButtons[0].topRight().add(new Point(5, 3))
        );
    }
    else {
        if (this.currentSprite instanceof StageMorph) {
            thumbnail.image = this.currentSprite.thumbnail(thumbSize);
        }
        else {
            thumbnail.image = this.currentSprite.fullThumbnail(thumbSize);
            thumbnail.setPosition(
                rotationStyleButtons[0].topRight().add(new Point(5, 3))
            );
        }
        if (myself.currentSprite.isLocked) {
            var ctx = thumbnail.image.getContext('2d');
            var x = thumbnail.center().x + 20;
            var y = thumbnail.center().y + 25;
            ctx.fillStyle = "#FFE600"
            ctx.scale(.5, .5);
            ctx.fillRect(x, y, 20, 20);
            ctx.beginPath();
            ctx.arc(x + 10, y, 10, Math.PI, 0);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + 10, y, 7, Math.PI, 0);
            ctx.fillStyle = "#000000"
            ctx.fill();
            thumbnail.changed();
            thumbnail.version = myself.currentSprite.version;
        }
    }
    this.spriteBar.add(thumbnail);

    thumbnail.fps = 3;


    if (this.currentSprite instanceof SpriteMorph) {
        var xcoord = new StringMorph("x: " + Math.round(this.currentSprite.xPosition()),
            12, 'sans-serif', true, false, false, MorphicPreferences.isFlat ? null : new Point(2, 1),
            myself.frameColor.darker(myself.buttonContrast));
        xcoord.color = myself.buttonLabelColor;
        xcoord.drawNew();

        var ycoord = new StringMorph("y: " + Math.round(this.currentSprite.yPositionNegative()),
            12, 'sans-serif', true, false, false, MorphicPreferences.isFlat ? null : new Point(2, 1),
            myself.frameColor.darker(myself.buttonContrast));
        ycoord.color = myself.buttonLabelColor;
        ycoord.drawNew();

        xcoord.setPosition(thumbnail.bottomLeft());
        xcoord.setPosition(new Point(xcoord.position().x + 5.25, xcoord.position().y));
        ycoord.setPosition(xcoord.bottomLeft());
        this.spriteBar.add(xcoord);
        this.spriteBar.add(ycoord);

        if (myself.currentSpriteTab === 'events') {
            xcoord.destroy();
            ycoord.destroy();
        }

    }

    if (myself.currentEvent == null) {
        thumbnail.step = function () {
            if (thumbnail.version !== myself.currentSprite.version) {
                thumbnail.image = myself.currentSprite.thumbnail(thumbSize);
                thumbnail.changed();
                thumbnail.version = myself.currentSprite.version;
                if (myself.currentSprite.isLocked && !myself.isAppMode) {
                    myself.parentThatIsA(IDE_Morph).createSpriteBar();
                    myself.parentThatIsA(IDE_Morph).fixLayout();
                }
            }
        };
    }
    if (myself.currentEvent != null) {
        nameField = new InputFieldMorph(myself.currentEvent.selector);
        var y = (thumbnail.topRight().subtract(thumbnail.bottomRight())).y;
        nameField.setPosition(thumbnail.topRight().add(new Point(10, -1 * y / 4)));
        nameField.accept = function () {
        };
        nameField.children.forEach(function (child) {
            if (child instanceof StringFieldMorph) {
                child.children.forEach(function (grandchild) {
                    grandchild.isEditable = false;
                });
            }
        });
        this.spriteBar.add(nameField);

    }
    else {
        var oldName = sprite.name;
        nameField = new InputFieldMorph(this.currentSprite.name);
        nameField.setWidth(100); // fixed dimensions
        if (this.currentSprite.isLocked) {
            nameField.contrast = 0;
        }
        else {
            nameField.contrast = 90;
        }
        nameField.setPosition(thumbnail.topRight().add(new Point(10, 3)));
        this.spriteBar.add(nameField);
        nameField.drawNew();
        if (this.currentSprite.isLocked && !this.developer) {
            nameField.accept = function () {
            };
            nameField.children.forEach(function (child) {
                if (child instanceof StringFieldMorph) {
                    child.children.forEach(function (grandchild) {
                        grandchild.isEditable = false;
                    });
                }
            });
            nameField.mouseClickLeft = function () {
            };
            nameField.mouseDownLeft = function () {
            };
        }
        else {
            nameField.accept = function () {
                myself.currentSprite.setName(nameField.getValue());
            };
            this.spriteBar.reactToEdit = function () {
                if (nameField.getValue().length <= 20) {
                    myself.currentSprite.setName(nameField.getValue());
                    myself.refreshPalette();
                    logObj = {action: 'spriteRename',
                    originName: oldName, name: sprite.name};
                    ide.updateLog(logObj);
                    ide.unsavedChanges = true;
                }
            };
        }
    }

    if (myself.currentEvent == null) {
        // padlock
        padlock = new ToggleMorph(
            'checkbox',
            null,
            function () {
                if (!myself.currentSprite.isLocked && !myself.currentSprite.isInert) {
                    myself.currentSprite.isDraggable = !myself.currentSprite.isDraggable;
                    myself.updateLog({action: 'toggleSpriteDrag',
                        toState: myself.currentSprite.isDraggable ? 'draggable':'undraggable'
                    });
                }
            },
            localize('draggable'),
            function () {
                return myself.currentSprite.isDraggable;
            }
        );
        padlock.hint = 'The sprite can be dragged\n around in the stage';
        padlock.label.isBold = false;
        padlock.label.setColor(this.buttonLabelColor);
        padlock.color = tabColors[2];
        padlock.highlightColor = tabColors[0];
        padlock.pressColor = tabColors[1];

        padlock.tick.shadowOffset = MorphicPreferences.isFlat ?
            new Point() : new Point(-1, -1);
        padlock.tick.shadowColor = new Color(); // black
        padlock.tick.color = this.buttonLabelColor;
        padlock.tick.isBold = false;
        padlock.tick.drawNew();

        padlock.setPosition(new Point(nameField.bottomLeft().x, nameField.bottomLeft().y + 2));
        padlock.drawNew();
        this.spriteBar.add(padlock);
        if (this.currentSprite instanceof StageMorph) {
            padlock.hide();
        }
        if (!((myself.currentSprite.devName == undefined) || myself.developer)) {
            padlock.hide();
        }

        //locktoggle
        lock = new ToggleMorph(
            'checkbox',
            null,
            function () {
                myself.currentSprite.isLocked = !myself.currentSprite.isLocked;

                var blockArray = [];
                myself.currentSprite.scripts.children.forEach(function (pushBlock) {
                    if (!(pushBlock instanceof CommentMorph)) {
                        blockArray.push(pushBlock);
                    }
                });
                blockArray.forEach(function (block) {
                    if (block instanceof HatBlockMorph) { //do all hat blocks first to save processing
                        if (!block.isFrozen && myself.currentSprite.isLocked) {
                            if (block.isInert) {
                                block.removeInert();
                            }
                            block.makeFrozen();
                        }
                        else if (block.isFrozen && !myself.currentSprite.isLocked) {
                            block.removeFrozen();
                        }
                    }
                    /* single command blocks cannot be locked/inert 9.4.14
                    else { //otherwise, find the topBlock
                        if (!block.isFrozen && myself.currentSprite.isLocked) {
                            var topBlock = block.topBlock();
                            if (topBlock.isInert) {
                                topBlock.removeInert();
                            }
                            topBlock.makeFrozen();
                        }
                        else if (block.isFrozen && !myself.currentSprite.isLocked) {
                            var topBlock = block.topBlock();
                            topBlock.removeFrozen();
                        }
                    }
                    */
                });

                myself.currentSprite.costumes.contents.forEach(function (costume) {
                    costume.locked = myself.currentSprite.isLocked;
                    costume.isDraggable = myself.currentSprite.isLocked;
                    if (myself.currentTab == 'costumes') {
                        myself.spriteEditor.updateList();
                    }
                });
                myself.currentSprite.changed();
                myself.currentSprite.drawNew();
                myself.currentSprite.changed();
                myself.spriteBar.removeChild(nameField);
                if (myself.currentSprite.isLocked) {
                    nameField.contrast = 0;
                }
                else {
                    nameField.contrast = 90;
                }
                if (myself.currentSprite.isDraggable && myself.currentSprite.isLocked) {
                    myself.currentSprite.isDraggable = !myself.currentSprite.isDraggable;
                }
                nameField.changed();
                nameField.drawNew();
                myself.spriteBar.add(nameField);
            },
            localize('locked'),
            function () {
                return myself.currentSprite.isLocked
            }
        );
        lock.hint = 'Sprite is undraggable, sprite scripts are unchangeable\n and undeletable, sprite name is unchangeable';
        lock.label.isBold = false;
        lock.label.setColor(this.buttonLabelColor);
        lock.color = tabColors[2];
        lock.highlightColor = tabColors[0];
        lock.pressColor = tabColors[1];

        lock.tick.shadowOffset = MorphicPreferences.isFlat ?
            new Point() : new Point(-1, -1);
        lock.tick.shadowColor = new Color(); // black
        lock.tick.color = this.buttonLabelColor;
        lock.tick.isBold = false;
        lock.tick.drawNew();

        lock.setPosition(padlock.bottomLeft().add(new Point(0, 2)));
        lock.drawNew();
        this.spriteBar.add(lock);
        if (this.currentSprite instanceof StageMorph || !this.developer) {
            lock.hide();
        }

        //hiddenToggle
        hidden = new ToggleMorph(
            'checkbox',
            null,
            function () {
                myself.currentSprite.isInert = !myself.currentSprite.isInert;
                myself.currentSprite.changed();
                myself.currentSprite.drawNew();
                myself.currentSprite.changed();
                myself.createCorral();
                myself.fixLayout();
            },
            localize('hidden'),
            function () {
                return myself.currentSprite.isInert
            }
        );
        hidden.hint = 'The sprite will not show\n up in student view';
        hidden.label.isBold = false;
        hidden.label.setColor(this.buttonLabelColor);
        hidden.color = tabColors[2];
        hidden.highlightColor = tabColors[0];
        hidden.pressColor = tabColors[1];

        hidden.tick.shadowOffset = MorphicPreferences.isFlat ?
            new Point() : new Point(-1, -1);
        hidden.tick.shadowColor = new Color(); // black
        hidden.tick.color = this.buttonLabelColor;
        hidden.tick.isBold = false;
        hidden.tick.drawNew();

        hidden.setPosition(padlock.topRight().add(new Point(65, 0)));
        hidden.drawNew();
        this.spriteBar.add(hidden);

        if (this.currentSprite instanceof StageMorph || !this.developer) {
            hidden.hide();
        }

        resettable = new ToggleMorph(
            'checkbox',
            null,
            function () {
                myself.currentSprite.isResettable = !myself.currentSprite.isResettable;
                myself.currentSprite.changed();
                myself.currentSprite.drawNew();
                myself.currentSprite.changed();
            },
            localize('resettable'),
            function () {
                return myself.currentSprite.isResettable
            }
        );
        resettable.hint = 'The sprite scripts can be brought back\n to some initial state';
        resettable.label.isBold = false;
        resettable.label.setColor(this.buttonLabelColor);
        resettable.color = tabColors[2];
        resettable.highlightColor = tabColors[0];
        resettable.pressColor = tabColors[1];

        resettable.tick.shadowOffset = MorphicPreferences.isFlat ?
            new Point() : new Point(-1, -1);
        resettable.tick.shadowColor = new Color(); // black
        resettable.tick.color = this.buttonLabelColor;
        resettable.tick.isBold = false;
        resettable.tick.drawNew();

        resettable.setPosition(lock.topRight().add(new Point(65, 0)));
        resettable.drawNew();
        this.spriteBar.add(resettable);

        if (this.currentSprite instanceof StageMorph || !this.developer) {
            resettable.hide();
        }
    }

    tabBar.tabTo = function (tabString) {
        var active;
        if (tabString != myself.currentTab) {
            myself.updateLog({action: "tabChange", tab: tabString});
        }
        myself.currentTab = tabString;
        this.children.forEach(function (each) {
            each.refresh();
            if (each.state) {
                active = each;
            }
        });
        if (active != undefined) {
            active.refresh(); // needed when programmatically tabbing
        }
        myself.createSpriteEditor();
        myself.fixLayout('tabEditor');
    };

    tab = new TabMorph(
        tabColors,
        null, // target
        function () {
            tabBar.tabTo('scripts');
        },
        localize('Scripts'), // label
        function () {  // query
            return myself.currentTab === 'scripts';
        }
    );
    tab.padding = 3;
    tab.corner = tabCorner;
    tab.edge = 1;
    tab.labelShadowOffset = new Point(-1, -1);
    tab.labelShadowColor = tabColors[1];
    tab.labelColor = this.buttonLabelColor;

    tab.drawNew();
    tab.fixLayout();

    if (StageMorph.prototype.inPaletteBlocks['tab-scripts'] == undefined) {
        StageMorph.prototype.inPaletteBlocks['tab-scripts'] = true;
    }
    if (StageMorph.prototype.inPaletteBlocks['tab-scripts'] == false) {
        tab.labelColor = this.buttonLabelColor.darker(50);
    }
    if (StageMorph.prototype.inPaletteBlocks['tab-scripts'] || this.developer) {
        tabBar.add(tab);
    }

    if (myself.developer == true) {
        tab = new TabMorph(
            tabColors,
            null, // target
            function () {
                tabBar.tabTo('hidden scripts');
                if (myself.currentSpriteTab == 'events') {
                    myself.createSpriteEditor();
                    myself.fixLayout();
                }
            },
            localize('Hidden Scripts'), // label
            function () {  // query
                return myself.currentTab === 'hidden scripts';
            }
        );
        tab.padding = 3;
        tab.corner = tabCorner;
        tab.edge = 1;
        tab.labelShadowOffset = new Point(-1, -1);
        tab.labelShadowColor = tabColors[1];
        tab.labelColor = this.buttonLabelColor;
        tab.drawNew();
        tab.fixLayout();
        tabBar.add(tab);
    }

    if (StageMorph.prototype.inPaletteBlocks['tab-hidden scripts'] == undefined) {
        StageMorph.prototype.inPaletteBlocks['tab-hidden scripts'] = true;
    }
    if (StageMorph.prototype.inPaletteBlocks['tab-hidden scripts'] == false) {
        tab.labelColor = this.buttonLabelColor.darker(50);
    }

    if (myself.currentEvent == null) {
        if (myself.currentSprite instanceof StageMorph) {
            tab = new TabMorph(
                tabColors,
                null, // target
                function () {
                    tabBar.tabTo('costumes');
                },
                localize('Backgrounds'), // label
                function () {  // query
                    return myself.currentTab === 'costumes';
                }
            );
        }
        else {
            tab = new TabMorph(
                tabColors,
                null, // target
                function () {
                    tabBar.tabTo('costumes');
                },
                localize('Costumes'), // label
                function () {  // query
                    return myself.currentTab === 'costumes';
                }
            );
        }
        tab.padding = 3;
        tab.corner = tabCorner;
        tab.edge = 1;
        tab.labelShadowOffset = new Point(-1, -1);
        tab.labelShadowColor = tabColors[1];
        tab.labelColor = this.buttonLabelColor;

        if (StageMorph.prototype.inPaletteBlocks['tab-costumes'] == undefined) {
            StageMorph.prototype.inPaletteBlocks['tab-costumes'] = true;
        }
        if (StageMorph.prototype.inPaletteBlocks['tab-costumes'] == false) {
            tab.labelColor = new Color(200, 0, 0);
            tab.drawNew();
        }
        tab.drawNew();
        tab.fixLayout();
        tab.userMenu = function () {
            var menu = new MenuMorph(this),
                ide = this.parentThatIsA(IDE_Morph);

            function hidden() {
                var visible = StageMorph.prototype.inPaletteBlocks['tab-costumes'];
                if (visible == false) {
                    return true;
                }
                else {
                    return false;
                }
            }

            if (ide && ide.developer) {
                if (hidden()) {
                    this.labelColor = new Color(200, 0, 0);
                    menu.addItem(
                        'Show this tab',
                        function () {
                            StageMorph.prototype.inPaletteBlocks['tab-costumes'] = true;
                            this.labelColor = myself.buttonLabelColor;
                            myself.createSpriteBar();
                            myself.fixLayout();
                        }
                    );
                }
                else {
                    menu.addItem(
                        'Hide this tab',
                        function () {
                            StageMorph.prototype.inPaletteBlocks['tab-costumes'] = false;
                            this.labelColor = new Color(200, 0, 0);
                            myself.createSpriteBar();
                            myself.fixLayout();
                        }
                    );
                }
            }
            return menu;
        };
        var visible = StageMorph.prototype.inPaletteBlocks['tab-costumes'];
        if (myself.developer == true || !(visible == false)) {
            tabBar.add(tab);
        }

        tab = new TabMorph(
            tabColors,
            null, // target
            function () {
                tabBar.tabTo('sounds');
            },
            localize('Sounds'), // label
            function () {  // query
                return myself.currentTab === 'sounds';
            }
        );
        tab.padding = 3;
        tab.corner = tabCorner;
        tab.edge = 1;
        tab.labelShadowOffset = new Point(-1, -1);
        tab.labelShadowColor = tabColors[1];
        tab.labelColor = this.buttonLabelColor;

        if (StageMorph.prototype.inPaletteBlocks['tab-sounds'] == undefined) {
            StageMorph.prototype.inPaletteBlocks['tab-sounds'] = true;
        }

        if (StageMorph.prototype.inPaletteBlocks['tab-sounds'] == false) {
            tab.labelColor = new Color(200, 0, 0);
            tab.drawNew();
        }
        tab.drawNew();
        tab.fixLayout();
        tab.userMenu = function () {
            var menu = new MenuMorph(this),
                ide = this.parentThatIsA(IDE_Morph);

            function hidden() {
                var visible = StageMorph.prototype.inPaletteBlocks['tab-sounds'];
                if (visible == false) {
                    return true;
                }
                else {
                    return false;
                }
            }

            if (ide && ide.developer) {
                if (hidden()) {
                    menu.addItem(
                        'Show this tab',
                        function () {
                            StageMorph.prototype.inPaletteBlocks['tab-sounds'] = true;
                            this.labelColor = myself.buttonLabelColor;
                            myself.createSpriteBar();
                            myself.fixLayout();
                        }
                    );
                }
                else {
                    menu.addItem(
                        'Hide this tab',
                        function () {
                            StageMorph.prototype.inPaletteBlocks['tab-sounds'] = false;
                            this.labelColor = new Color(200, 0, 0);//myself.buttonLabelColor.darker(50);
                            myself.createSpriteBar();
                            myself.fixLayout();
                        }
                    );
                }
            }
            return menu;
        };
        var visible = StageMorph.prototype.inPaletteBlocks['tab-sounds'];
        if (myself.developer == true || !(visible == false)) {
            tabBar.add(tab);
        }
    }
    tabBar.fixLayout();
    tabBar.children.forEach(function (each) {
        each.refresh();
    });
    this.spriteBar.tabBar = tabBar;
    this.spriteBar.add(this.spriteBar.tabBar);

    this.spriteBar.fixLayout = function () {
        this.tabBar.setLeft(this.left());
        this.tabBar.setBottom(this.bottom());
    };
    if (!(!ide.developer && this.currentSprite.isLocked)) {

        var button = new PushButtonMorph(
            this,
            function () {
                myself.addComment();
                var sprite = myself.currentSprite,
                    name = sprite.devName ? sprite.devName : sprite.name,
                    logObj = {action: 'buttonClick', button: 'addComment',
                        spriteID: name};
                myself.updateLog(logObj);
                ide.unsavedChanges = true;

            },
            new SymbolMorph('comment', 8)
        );
        button.corner = 6;
        button.color = IDE_Morph.prototype.groupColor;
        button.highlightColor = IDE_Morph.prototype.groupColor.lighter(80),
            button.pressColor = IDE_Morph.prototype.groupColor.darker(20),
            button.labelMinExtent = new Point(36, 18);
        button.padding = 0;
        button.labelShadowOffset = new Point(-1, -1);
        button.labelShadowColor = SpriteMorph.prototype.paletteColor;
        button.labelColor = new Color(200, 0, 0);
        button.contrast = this.buttonContrast;
        button.drawNew();
        button.hint = 'add a new comment';
        this.spriteBar.add(button);
        button.label.setCenter(button.center());
        button.setPosition(new Point(nameField.bottomLeft().x + 110, nameField.topRight().y + 1));
    }

    this.spriteBar.wantsDropOf = function (droppedMorph) {
        return droppedMorph instanceof BlockMorph ||
            droppedMorph instanceof CommentMorph;
    };

    this.spriteBar.reactToDropOf = function (droppedMorph) {
        if (droppedMorph instanceof BlockMorph ||
            droppedMorph instanceof CommentMorph) {
            if (myself.world().hand.grabOrigin) {
                droppedMorph.slideBackTo(myself.world().hand.grabOrigin);
            }
            else {
                droppedMorph.destroy();
            }
        }
    };

};

IDE_Morph.prototype.createSpriteEditor = function () {
    // assumes that the logo pane and the stage have already been created
    var scripts = this.currentSprite.scripts,
        myself = this;

    var hiddenscripts = this.currentSprite.hiddenscripts
    if (myself.currentEvent != null) {
        scripts = myself.currentEvent.blockEvents;
    }
    if (myself.currentEvent != null) {
        hiddenscripts = myself.currentEvent.hiddenEvents;
    }
    if (this.spriteEditor) {

        this.spriteEditor.destroy();
    }

    if (this.currentTab === 'scripts') {
        scripts.isDraggable = false;
        scripts.color = this.groupColor;
        //scripts.texture = this.scriptsPaneTexture;

        this.spriteEditor = new ScrollFrameMorph(
            scripts,
            null,
            this.sliderColor
        );
        this.spriteEditor.padding = 10;
        this.spriteEditor.growth = 50;
        this.spriteEditor.isDraggable = false;
        this.spriteEditor.acceptsDrops = false;
        this.spriteEditor.contents.acceptsDrops = true;

        scripts.scrollFrame = this.spriteEditor;
        this.add(this.spriteEditor);
        this.spriteEditor.scrollX(this.spriteEditor.padding);
        this.spriteEditor.scrollY(this.spriteEditor.padding);


    } else if (this.currentTab === 'hidden scripts') {
        hiddenscripts.isDraggable = false;
        hiddenscripts.color = this.groupColor;
        //hiddenscripts.texture = this.scriptsPaneTexture;

        this.spriteEditor = new ScrollFrameMorph(
            hiddenscripts,
            null,
            this.sliderColor
        );
        this.spriteEditor.padding = 10;
        this.spriteEditor.growth = 50;
        this.spriteEditor.isDraggable = false;
        this.spriteEditor.acceptsDrops = false;
        this.spriteEditor.contents.acceptsDrops = true;

        hiddenscripts.scrollFrame = this.spriteEditor;
        this.add(this.spriteEditor);
        this.spriteEditor.scrollX(this.spriteEditor.padding);
        this.spriteEditor.scrollY(this.spriteEditor.padding);
    } else if (this.currentTab === 'costumes') {
        this.spriteEditor = new WardrobeMorph(
            this.currentSprite,
            this.sliderColor
        );
        this.spriteEditor.color = this.groupColor;

        this.add(this.spriteEditor);
        if (this.developer) {
            this.spriteEditor.updateList(); // reload to add dev buttons to costumes
        }
        this.spriteEditor.updateSelection();

        this.spriteEditor.acceptsDrops = false;
        this.spriteEditor.contents.acceptsDrops = false;
    } else if (this.currentTab === 'sounds') {
        this.spriteEditor = new JukeboxMorph(
            this.currentSprite,
            this.sliderColor
        );
        this.spriteEditor.color = this.groupColor;
        this.add(this.spriteEditor);

        this.spriteEditor.updateSelection();
        this.spriteEditor.acceptDrops = false;
        this.spriteEditor.contents.acceptsDrops = false;
    } else {
        this.spriteEditor = new Morph();
        this.spriteEditor.color = this.groupColor;
        this.spriteEditor.acceptsDrops = true;
        this.spriteEditor.reactToDropOf = function (droppedMorph) {
            if (droppedMorph instanceof DialogBoxMorph) {
                myself.world().add(droppedMorph);
            } else if (droppedMorph instanceof SpriteMorph) {
                myself.removeSprite(droppedMorph);
            } else {
                droppedMorph.destroy();
            }
        };
        this.add(this.spriteEditor);
    }
};

IDE_Morph.prototype.createCorralBar = function () {
    // assumes the stage has already been created
    var padding = 5,
        tabColors = this.tabColors,
        myself = this,
        tabBar = new AlignmentMorph('row', -30),
        newbutton,
        paintbutton,
        spriteListButton,
        colors = [
            this.groupColor,
            this.frameColor.darker(50),
            this.frameColor.darker(50)
        ];

    if (this.corralBar) {
        this.corralBar.destroy();
    }
    this.corralBar = new Morph();
    this.corralBar.color = this.frameColor;
    this.corralBar.setHeight(this.logo.height()); // height is fixed
    if (myself.isSmallStage == true && this.importableSprites) {
        this.corralBar.setHeight(this.logo.height() + 30);
    }
    this.add(this.corralBar);

    if (this.importableSprites) {
        // new sprite button
        newbutton = new PushButtonMorph(
            this,
            "addTurtleSprite",
            new SymbolMorph("turtle", 16)
        );
        newbutton.corner = 12;
        newbutton.color = colors[0];
        newbutton.highlightColor = colors[1];
        newbutton.pressColor = colors[2];
        newbutton.labelMinExtent = new Point(36, 18);
        newbutton.padding = 0;
        newbutton.labelShadowOffset = new Point(-1, -1);
        newbutton.labelShadowColor = colors[1];
        newbutton.labelColor = this.buttonLabelColor;
        newbutton.contrast = this.buttonContrast;
        newbutton.drawNew();
        newbutton.hint = "add a new Turtle sprite";
        newbutton.fixLayout();
        newbutton.setCenter(this.corralBar.center());
        newbutton.setLeft(this.corralBar.left() + padding);
        this.corralBar.add(newbutton);

        paintbutton = new PushButtonMorph(
            this,
            "paintNewSprite",
            new SymbolMorph("brush", 16)
        );
        paintbutton.corner = 12;
        paintbutton.color = colors[0];
        paintbutton.highlightColor = colors[1];
        paintbutton.pressColor = colors[2];
        paintbutton.labelMinExtent = new Point(36, 18);
        paintbutton.padding = 0;
        paintbutton.labelShadowOffset = new Point(-1, -1);
        paintbutton.labelShadowColor = colors[1];
        paintbutton.labelColor = this.buttonLabelColor;
        paintbutton.contrast = this.buttonContrast;
        paintbutton.drawNew();
        paintbutton.hint = "paint a new sprite";
        paintbutton.fixLayout();
        paintbutton.setCenter(this.corralBar.center());
        paintbutton.setLeft(
                this.corralBar.left() + padding + newbutton.width() + padding
        );
        this.corralBar.add(paintbutton);

        //spriteListButton
        spriteListButton = new PushButtonMorph(
            this,
            "pickSpriteLibrary",
            new SymbolMorph("octopi", 16)
        );
        spriteListButton.corner = 12;
        spriteListButton.color = colors[0];
        spriteListButton.highlightColor = colors[1];
        spriteListButton.pressColor = colors[2];
        spriteListButton.labelMinExtent = new Point(36, 18);
        spriteListButton.padding = 0;
        spriteListButton.labelShadowOffset = new Point(-1, -1);
        spriteListButton.labelShadowColor = colors[1];
        spriteListButton.labelColor = this.buttonLabelColor;
        spriteListButton.contrast = this.buttonContrast;
        spriteListButton.drawNew();
        spriteListButton.hint = "Choose sprite from library";
        spriteListButton.fixLayout();
        spriteListButton.setCenter(this.corralBar.center());
        spriteListButton.setLeft(
                this.corralBar.left() + padding + newbutton.width() + padding + paintbutton.width() + padding
        );
        this.corralBar.add(spriteListButton);
    }

    //Sprite Tabs
    instructions = new TabMorph(
        tabColors,
        null, // target
        function () {
            tabBar.tabTo('instructions');
        },
        localize('Instructions'), // label
        function () {  // query
            return myself.currentSpriteTab === 'instructions';
        }
    );
    instructions.padding = 3;
    instructions.corner = 15;
    instructions.edge = 1;
    instructions.labelShadowOffset = new Point(-1, -1);
    instructions.labelShadowColor = tabColors[1];
    instructions.labelColor = this.buttonLabelColor;
    instructions.drawNew();
    //instructions.fixLayout();
    if (this.importableSprites) {
        if (myself.isSmallStage == true) {
            instructions.setPosition(new Point(newbutton.bottomLeft().x, newbutton.bottomLeft().y));
        }
        else {
            instructions.setPosition(new Point(spriteListButton.topRight().x, spriteListButton.topRight().y + 9));
        }
    }
    else {
        instructions.setPosition(new Point(this.corralBar.bottomLeft().x, this.corralBar.bottomLeft().y-17));
    }
    instructions.drawNew();
    instructions.fixLayout();
    tabBar.add(instructions);


    visible = new TabMorph(
        tabColors,
        null, // target
        function () {
            tabBar.tabTo('Sprites');
            if (myself.currentSprite instanceof SpriteMorph) {
                myself.currentSprite.justDropped();
            }

        },
        localize('Sprites'), // label
        function () {  // query
            return myself.currentSpriteTab === 'Sprites';
        }
    );
    visible.padding = 3;
    visible.corner = 15;
    visible.edge = 1;
    visible.labelShadowOffset = new Point(-1, -1);
    visible.labelShadowColor = tabColors[1];
    visible.labelColor = this.buttonLabelColor;
    visible.drawNew();
    visible.fixLayout();
    visible.setPosition(new Point(instructions.center().x + 36, instructions.topRight().y + 8))
    visible.drawNew();
    visible.fixLayout();
    tabBar.add(visible)
    if (myself.developer == true) {
        hidden = new TabMorph(
            tabColors,
            null, // target
            function () {
                tabBar.tabTo('hiddenSprites');
            },
            localize('Hidden Sprites'), // label
            function () {  // query
                return myself.currentSpriteTab === 'hiddenSprites';
            }
        );
        hidden.padding = 3;
        hidden.corner = 15;
        hidden.edge = 1;
        hidden.labelShadowOffset = new Point(-1, -1);
        hidden.labelShadowColor = tabColors[1];
        hidden.labelColor = this.buttonLabelColor;
        hidden.drawNew();
        hidden.fixLayout();
        hidden.setPosition(new Point(instructions.center().x + 36, instructions.topRight().y + 8));
        hidden.drawNew();
        hidden.fixLayout();
        tabBar.add(hidden);
    }
    events = new TabMorph(
        tabColors,
        null, // target
        function () {
            tabBar.tabTo('events');
            myself.spriteBar.tabBar.tabTo('scripts');
        },
        localize('Events'), // label
        function () {  // query
            return myself.currentSpriteTab === 'events';
        }
    );
    events.padding = 3;
    events.corner = 15;
    events.edge = 1;
    events.labelShadowOffset = new Point(-1, -1);
    events.labelShadowColor = tabColors[1];
    events.labelColor = this.buttonLabelColor;
    events.drawNew();
    events.fixLayout();
    events.setPosition(new Point(instructions.center().x + 36, instructions.topRight().y + 8));
    events.drawNew();
    events.fixLayout();
    tabBar.add(events);


    tabBar.tabTo = function (tabString) {
        if (tabString != myself.currentSpriteTab) {
            myself.updateLog({action: "tabChange", tab: tabString});
        }
        var active;
        var sprite = new SpriteMorph();

        // if we're clicking away from the instructions tab, hide the instructions canvas
        if (myself.currentSpriteTab == 'instructions' && tabString != 'instructions') {
            document.getElementById('instructionsDiv').style.visibility = 'hidden';
            document.getElementById('instructionsDiv').style.overflow = 'hidden';
        }
        if (tabString == 'instructions') {
            document.getElementById('instructionsDiv').innerHTML = myself.instructions;
        }


        sprite.blocksCache['events'] = null;

        var blocks = sprite.freshPalette('events').children[0].children.slice();
        if (!myself.developer) {
            var temp = [];
            blocks.forEach(function (block) {
                if (StageMorph.prototype.inPaletteBlocks[block.selector] != false && block instanceof (BlockMorph)) {
                    temp.push(block);
                }
            });

            blocks = temp;
        }
        myself.currentSprite.blocksCache['events'] = blocks;
        if (tabString != 'events') {
            // if (tabString == 'Sprites') {
            if (myself.currentEvent != null) {
                myself.currentEvent.blockEvents.children.forEach(function (script) {
                    if (script instanceof CommandBlockMorph || script instanceof ReporterBlockMorph) {
                        myself.sprites.asArray().forEach(function (sprite) {
                            if (sprite.devName == script.spriteName) {
                                if (myself.hasHatThumbnails) {
                                    if (script.topBlock() instanceof HatBlockMorph) {
                                        script.setSpec(script.oldSpec);
                                        sprite.scripts.add(script.fullCopy());
                                        sprite.scripts.cleanUp();
                                    }
                                }
                                else {
                                    sprite.scripts.add(script.fullCopy());
                                    sprite.scripts.cleanUp();
                                }
                            }
                        });
                    }
                });
                myself.currentEvent.hiddenEvents.children.forEach(function (script) {
                    if (script instanceof CommandBlockMorph || script instanceof ReporterBlockMorph) {
                        myself.sprites.asArray().forEach(function (sprite) {
                            if (sprite.devName == script.spriteName&& script.topBlock() instanceof HatBlockMorph) {
                                if (myself.hasHatThumbnails) {
                                    if (script.topBlock() instanceof HatBlockMorph) {
                                        script.setSpec(script.oldSpec);
                                        sprite.scripts.add(script.fullCopy());
                                        sprite.scripts.cleanUp();
                                    }
                                }
                                sprite.hiddenscripts.add(script.fullCopy());
                                sprite.hiddenscripts.cleanUp();
                            }
                        });
                    }
                });
                myself.currentEvent = null;
                myself.createSpriteBar();
                myself.createSpriteEditor();
                myself.fixLayout();
                //}
            }
            myself.refreshPalette();
        }
        myself.currentSpriteTab = tabString;
        this.children.forEach(function (each) {
            each.refresh();
            if (each.state) {
                active = each;
            }
        });
        if (active != undefined) {
            active.refresh(); // needed when programmatically tabbing
        }
        myself.createCorral();
        myself.fixLayout();
        //myself.spriteBar.tabBar.tabTo('scripts');

    };
    tabBar.fixLayout();
    tabBar.children.forEach(function (each) {
        each.refresh();
    });
    this.corralBar.tabBar = tabBar;
    this.corralBar.add(tabBar);  ///hiddenBar.add(hidden);
    this.corralBar.fixLayout = function () {
        this.tabBar.setLeft(this.left());
        this.tabBar.setBottom(this.bottom());
    };

    this.corralBar.wantsDropOf = function (droppedMorph) {
        return droppedMorph instanceof BlockMorph ||
            droppedMorph instanceof CommentMorph;
    };

    this.corralBar.reactToDropOf = function (droppedMorph) {
        if (droppedMorph instanceof BlockMorph ||
            droppedMorph instanceof CommentMorph) {
            if (myself.world().hand.grabOrigin) {
                droppedMorph.slideBackTo(myself.world().hand.grabOrigin);
            }
            else {
                droppedMorph.destroy();
            }
        }
    };
};

IDE_Morph.prototype.createCorral = function () {
    // assumes the corral bar has already been created
    var frame, template, instrX, instrY, padding = 5, myself = this, y = 10;

    if (this.corral) {
        this.corral.destroy();
    }

    this.corral = new Morph();
    this.corral.color = this.groupColor;
    this.add(this.corral);

    if (this.currentSpriteTab != 'events' && this.currentSpriteTab != 'instructions') {
        this.corral.stageIcon = new SpriteIconMorph(this.stage);
        this.corral.stageIcon.isDraggable = false;
        this.corral.add(this.corral.stageIcon);
    }

    frame = new ScrollFrameMorph(null, null, this.sliderColor);
    frame.acceptsDrops = false;
    frame.contents.acceptsDrops = false;

    frame.contents.wantsDropOf = function (morph) {
        return morph instanceof SpriteIconMorph ||
            morph instanceof BlockMorph ||
            morph instanceof CommentMorph;
    };

    frame.contents.reactToDropOf = function (morph) {
        myself.corral.reactToDropOf(morph);

    };

    frame.alpha = 0;

    if (this.currentSpriteTab == 'instructions') {
        // check if the instructions tab already exists (but is hidden)
        if (!document.getElementById('instructionsDiv')) {
            this.createInstructions(1000, 400);
        }
        document.getElementById('instructionsDiv').style.visibility = 'visible';
        document.getElementById('instructionsDiv').style.overflow = "scroll";
    }
    else if (document.getElementById('instructionsDiv')) {
        document.getElementById('instructionsDiv').style.visibility = 'hidden';
    }

    if (myself.currentSpriteTab == 'events') {
        frame.contents.wantsDropOf = function (morph) {
            return morph instanceof BlockMorph ||
                morph instanceof CommentMorph;
        };
        frame.contents.reactToDropOf = function (morph) {
            if (morph instanceof BlockMorph || morph instanceof CommentMorph) {
                if (myself.world().hand.grabOrigin) {
                    morph.slideBackTo(myself.world().hand.grabOrigin);
                }
                else {
                    morph.destroy();
                }
            }
            //spriteIcon.destroy();
        };

        var sprite = new SpriteMorph();
        blocks = sprite.freshPalette('events').children[0].children; //get fresh set of event blocks
        if (!myself.developer) {
            var temp = [];
            blocks.forEach(function (block) {
                if (StageMorph.prototype.inPaletteBlocks[block.selector] != false && block instanceof (BlockMorph)) {
                    temp.push(block);
                }
            });

            myself.sprites.contents.forEach(function (sprite) {
                if (!sprite.isInert) {
                    sprite.scripts.children.forEach(function (topBlock) {
                        if (topBlock instanceof HatBlockMorph) {
                            if(!temp.some(function(element, index, array) { //checks to see if selector exists in array
                                            return (element.selector == topBlock.selector);}))
                            {
                                //only pushes if selector is not already present in the temp array
                                temp.push(sprite.blockForSelector(topBlock.selector));
                            }
                        }
                    });
                }
            });

            blocks = temp;
        }
       temp = [];
        blocks.forEach(function (block) {
            if (block instanceof HatBlockMorph) { //selects only the hat block morphs
                block.isTemplate = true;
                temp.push(block);
            }
        });
        blocks = temp;

        blocks.forEach(function (block){
                myself.currentEvent = null;
                block.isTemplate = true;
                block.contextMenu = function () { //remove right click
                };
                block.children.forEach(function (child) { //make all sub-morphs uninteractable
                    child.contextMenu = function () {
                    };
                    child.children.forEach(function (grandchild) {
                        grandchild.contextMenu = function () {
                        };
                    });
                });

                block.mouseClickLeft = function () {
                    myself.updateLog({action:'eventClick', block: this.buildBlockInfo()});
                    //hide all other blocks from palette
                    var toHide = sprite.freshPalette('events').children[0].children;
                    var holder = [];
                    toHide.forEach(function (item) { //get blocks to hide from the events palette
                        if (item instanceof BlockMorph) {
                            if (item.selector == block.selector) {
                                item.mouseClickLeft = CommandBlockMorph.prototype.rootForGrab;
                                item.rootForGrab = CommandBlockMorph.prototype.rootForGrab;
                                if (StageMorph.prototype.inPaletteBlocks[item.selector] != false) {
                                    holder.push(item);
                                }
                            }
                        }
                    });
                    myself.currentSprite.blocksCache['events'] = holder; //updates palette
                    if (myself.currentEvent != null) {
                        myself.currentEvent.blockEvents.children.forEach(function (script) {
                            if (script instanceof CommandBlockMorph) {
                                myself.sprites.asArray().forEach(function (sprite) {
                                    if (sprite.devName == script.spriteName) {
                                        sprite.scripts.add(script.fullCopy());
                                        sprite.scripts.cleanUp();
                                    }
                                });
                            }
                        });
                        myself.currentEvent.hiddenEvents.children.forEach(function (script) {
                            if (script instanceof CommandBlockMorph) {
                                myself.sprites.asArray().forEach(function (sprite) {
                                    if (sprite.devName == script.spriteName) {
                                        sprite.hiddenscripts.add(script.fullCopy());
                                        sprite.hiddenscripts.cleanUp();
                                    }
                                });
                            }
                        });
                    }
                    var events = myself.currentSprite.scripts.fullCopy(),
                        message = SpriteMorph.prototype.hatSelectorConversion(this.fullCopy());
                    events.userMenu = function () {
                        var menu = new MenuMorph(this);
                        menu.addItem('help', 'nop');
                        return menu;
                    }
                    events.reactToDropOf = function (morph, hand) {
                        var closest = Number.MAX_VALUE;
                        var obj = null;
                        this.children.forEach(function (item) {
                            if (morph instanceof CommandBlockMorph) {
                                if (item instanceof SpriteIconMorph && !myself.hasHatThumbnails) { // use obj as flag to delete script if below white partition
                                    var dist = ((item.barPos.y + events.topLeft().y) - (morph.bounds.origin.y));
                                    if (Math.abs(dist) == dist && dist < closest) {
                                        closest = dist;
                                        obj = item; // obj gets spriteiconmorph
                                    }
                                }
                                else if (myself.hasHatThumbnails) { // don't delete scripts based on position
                                    var blockSprite = item.blockSpec.substring(0, item.blockSpec.indexOf(' $')),
                                        sprites = myself.sprites.asArray();

                                    sprites.forEach(function (sprite) {
                                        if (sprite.name == blockSprite) {
                                            obj = sprite; // obj gets spritemorph
                                        }
                                    });
                                }
                            }
                        });
                        if (obj == null || (obj.object && obj.object.isLocked)) {
                            morph.destroy();
                            morph.parent.owner = null;
                            // TODO: pending events tab view finalization (log deletion)
                        }
                        else { // handle the two different cases of obj types
                            if (myself.hasHatThumbnails) {
                                morph.spriteName = obj.name; // this is where things named
                                morph.parent.owner = obj; // assign the block a 'currentSprite'
                                myself.currentSprite = obj; // assigns the currentSprite for accurate scriptID
                            }
                            else {
                                morph.spriteName = obj.labelString; // this is where things named
                                morph.parent.owner = obj.object; // assign the block a 'currentSprite'
                                myself.currentSprite = obj.object; // assigns the currentSprite for accurate scriptID
                            }
                        }
                       morph.snap(hand);
                    }
                    events.children = [];
                    events.addSprite = function (sprite) {
                        var current = this;
                        if (sprite.isInert == false) {
                            var header = new SpriteIconMorph(sprite, false);
                            header.mouseClickLeft = function () {
                                myself.corralBar.tabBar.tabTo('Sprites');
                                myself.selectSprite(sprite);
                                myself.updateLog({action:"spriteSelect",
                                    spriteID: sprite.devName ? sprite.devName : sprite.name
                                });
                            };
                            header.rootForGrab = function () {
                                return false;
                            };
                            header.userMenu = function () {
                                return null
                            };
                            if (!myself.hasHatThumbnails) {
                                current.add(header);
                                header.setPosition(new Point(0, y));
                                x = 65;
                                y = header.center().y;
                            }
                            if (sprites[sprite.name] != undefined && sprites[sprite.name] != null) {
                                if (current == events) {
                                    sprites[sprite.name].forEach(function (script) {
                                        script.spriteName = sprite.name;
                                        current.add(script);
                                        script.setPosition(new Point(x, y - 20));
                                        if (myself.hasHatThumbnails) {
                                            if (z == 1) {
                                                z = 0;
                                                x = 0;
                                                y = y + script.stackHeight() + 20;
                                            }
                                            else {
                                                z++;
                                                x += script.width() + 70; // make two wide
                                            }
                                        }
                                        else {
                                            y = y + script.stackHeight() + 10;
                                        }
                                    });
                                }
                                if (current == hiddenEvents) {
                                    if (hidden[sprite.name]) {
                                        hidden[sprite.name].forEach(function (script) {
                                            script.spriteName = sprite.name;
                                            current.add(script);
                                            script.setPosition(new Point(x, y - 20));
                                            if (myself.hasHatThumbnails) {
                                                if (z == 1) {
                                                    z = 0;
                                                    x = 0;
                                                    y = y + script.stackHeight() + 20;
                                                }
                                                else {
                                                    z++;
                                                    x += script.width() + 70; // make two wide
                                                }
                                            }
                                            else {
                                                y = y + script.stackHeight() + 10;
                                            }
                                        });
                                    }
                                    else {
                                        y = y + 30;
                                    }
                                }
                            }
                            else {
                                y = y + 30;
                            }
                            if (!myself.hasHatThumbnails) {
                                var string = new lineMorph('', myself.spriteBar.width(), 5);
                                y = y + 20;
                                string.setPosition(new Point(current.topLeft().x, y));
                                y = y + 20;
                                current.add(string);
                                header.barPos = string.bounds.origin;
                            }
                        }
                    };
                    var hiddenEvents = events.fullCopy();
                    hiddenEvents.reactToDropOf = events.reactToDropOf;
                    hiddenEvents.addSprite = events.addSprite;
                    var hidden = {};
                    var sprites = {};
                    var objects = {};

                    if (this.selector == 'receiveKey') { //specific case for the key press event
                        myself.lastEventsHat = this;
                        var key = this.children[1].children[0].text;
                        myself.sprites.asArray().forEach(function (sprite) {
                            sprite.allHatBlocksForKey(key).forEach(function (script) {
                                var sprite = script.parentThatIsA(ScriptsMorph).owner,
                                    block = script,
                                    icon;

                                if (myself.hasHatThumbnails) { // when 'HatBlocks with thumbnails' is toggled on
                                    icon = sprite.costume ? ' $' + sprite.costume.name : '';
                                    block.oldSpec = block.oldSpec || block.blockSpec; //only update if it doesn't currently have one
                                    block.setSpec(sprite.name + icon);
                                }

                                if (script.goesToHiddenTab == true) {
                                    if (hidden[sprite.devName] == undefined) {
                                        hidden[sprite.devName] = [];
                                        objects[sprite.devName] = (sprite)
                                    }
                                    hidden[sprite.devName].push(block);
                                    objects[sprite.devName] = (sprite);
                                }
                                else {
                                    if (sprites[sprite.devName] == undefined) {
                                        sprites[sprite.devName] = [];
                                        objects[sprite.devName] = (sprite);
                                    }
                                    sprites[sprite.devName].push(block);
                                    objects[sprite.devName] = (sprite);
                                }
                            });
                        });
                    }
                    else {
                        myself.lastEventsHat = this;
                        myself.sprites.asArray().forEach(function (sprite) { //all other blocks
                            sprite.allHatBlocksFor(message).forEach(function (script) {
                                var sprite = script.parentThatIsA(ScriptsMorph).owner,
                                    block = script,
                                    icon;

                                if (myself.hasHatThumbnails) { // when 'HatBlocks with thumbnails' is toggled on
                                    icon = sprite.costume ? ' $' + sprite.costume.name : '';
                                    block.oldSpec = block.oldSpec || block.blockSpec; //only update if it doesn't currently have one
                                    block.setSpec(sprite.name + icon);
                                }

                                if (script.goesToHiddenTab == true) {
                                    if (hidden[sprite.devName] == undefined) {
                                        hidden[sprite.devName] = [];
                                        objects[sprite.devName] = (sprite)
                                    }
                                    hidden[sprite.devName].push(block);
                                    objects[sprite.devName] = (sprite);
                                }
                                else {
                                    if (sprites[sprite.devName] == undefined) {
                                        sprites[sprite.devName] = [];
                                        objects[sprite.devName] = (sprite);
                                    }
                                    sprites[sprite.devName].push(block);
                                    objects[sprite.devName] = (sprite);
                                }
                            });
                        });
                    }

                    var keys = Object.keys(sprites);
                    var x = events.topLeft().x, y = events.topLeft().y;
                    //keys.forEach(function (key) {
                    //if (sprites[key] != undefined) {
                    var scriptless = [];
                    var scripted = [];
                    myself.sprites.asArray().forEach(function (sprite) {
                        var script = false;

                        keys.forEach(function (key) {
                            if (key == sprite.name) {
                                scripted.push(sprite);
                                script = true;
                            }
                        });
                        if (script == false) {
                            scriptless.push(sprite);
                        }
                    });
                    var x = 0, z = 0;
                    scripted.forEach(function (sprite) {
                        events.addSprite(sprite);
                    });
                    scriptless.forEach(function (sprite) {
                        events.addSprite(sprite);
                    });

                    x = events.topLeft().x;
                    y = events.topLeft().y;
                    var keys = Object.keys(hidden);
                    var scriptless = [];
                    var scripted = [];
                    myself.sprites.asArray().forEach(function (sprite) {
                        var script = false;

                        keys.forEach(function (key) {
                            if (key == sprite.name) {
                                scripted.push(sprite);
                                script = true;
                            }
                        });
                        if (script == false) {
                            scriptless.push(sprite);
                        }
                    });
                    scripted.forEach(function (sprite) {
                        hiddenEvents.addSprite(sprite);
                    });
                    scriptless.forEach(function (sprite) {
                        hiddenEvents.addSprite(sprite);
                    });

                    this.blockEvents = events;
                    this.hiddenEvents = hiddenEvents;
                    myself.currentEvent = this;
                    myself.refreshPalette();
                    myself.createSpriteBar();
                    myself.fixLayout();
                    myself.spriteBar.tabBar.tabTo('scripts');
                    myself.createSpriteEditor();
                    myself.fixLayout();
                    return true;
                }

                block.rootForGrab = function () {
                    return false;
                };
                frame.contents.add(block.fullCopy());
        });

    }

    this.sprites.asArray().forEach(function (morph) {
        template = new SpriteIconMorph(morph, template);
        if (myself.currentSpriteTab == 'Sprites') {
            if (!morph.isInert)
                frame.contents.add(template);
        }
        if (myself.currentSpriteTab == 'hiddenSprites') {
            if (morph.isInert && morph.name != 'toggleGrid') {
                frame.contents.add(template);
            }
        }
        //frame.contents.add(template);
    });

    this.corral.frame = frame;
    this.corral.add(frame);

    this.corral.fixLayout = function () {
    	var instructionsDiv = document.getElementById('instructionsDiv');
        if (this.stageIcon) {
            this.stageIcon.setCenter(this.center());
            this.stageIcon.setLeft(this.left() + padding);
            this.frame.setLeft(this.stageIcon.right() + padding);
        }
        this.frame.setExtent(new Point(
                this.right() - this.frame.left(),
            this.height()
        ));

        if (instructionsDiv == null) {
        	myself.createInstructions(1000, 400);
        	instructionsDiv = document.getElementById('instructionsDiv');
        	instructionsDiv.style.visibility = 'hidden';
        }
        if (myself.isAppMode) {
        	// resize for fullscreen
        	// TO DO adjust stage size to make room for instructions
        	instrX = myself.stage.bounds.origin.x;
        	instrY = myself.stage.bounds.corner.y;
        	instructionsDiv.style.left = instrX + "px";
            instructionsDiv.style.top = instrY + 20 + "px";
            instructionsDiv.style.width = myself.stage.bounds.corner.x - instrX - 20+ "px";
        	instructionsDiv.style.height = "40px";
        	instructionsDiv.style.visibility = 'visible';
        }
        else {
        	// resize for normal
        	instrX = myself.extent().x - this.frame.extent().x + 20;
        	instrY = myself.extent().y - this.frame.extent().y + 20;
            instructionsDiv.style.left = instrX + "px";
            instructionsDiv.style.top = instrY + "px";
            instructionsDiv.style.width = "420px";
        	instructionsDiv.style.height = "300px";
        }

        if (myself.currentSpriteTab == 'events') {
            var y = 10, x = 10;
            frame.contents.children.forEach(function (block) {
                block.setPosition(frame.topLeft().add(new Point(x, y)));
                if (block instanceof CommandBlockMorph) {
                    y = y + block.stackHeight() + 10;
                }
                if (block instanceof ToggleMorph) {
                    x = x + 20;
                }
            });
        }
        else {
            this.arrangeIcons();
        }
        this.refresh();
    };

    this.corral.arrangeIcons = function () {
        var x = this.frame.left(),
            y = this.frame.top(),
            max = this.frame.right(),
            start = this.frame.left();

        this.frame.contents.children.forEach(function (icon) {
            var w = icon.width();

            if (x + w > max) {
                x = start;
                y += icon.height(); // they're all the same
            }
            icon.setPosition(new Point(x, y));
            x += w;
        });
        this.frame.contents.adjustBounds();
    };

    this.corral.addSprite = function (sprite) {
        this.frame.contents.add(new SpriteIconMorph(sprite));
        this.fixLayout();
    };

    this.corral.refresh = function () {
        if (this.stageIcon) {
            this.stageIcon.refresh();
        }
        if (myself.currentSpriteTab != 'events' && myself.currentSpriteTab != 'instructions') {
            this.frame.contents.children.forEach(function (icon) {
                icon.refresh();
            });
        }
    };

    this.corral.reactToDropOf = function (morph) {
        if (morph instanceof BlockMorph || morph instanceof CommentMorph) {
            if (myself.world().hand.grabOrigin) {
                morph.slideBackTo(myself.world().hand.grabOrigin);
            }
            else {
                morph.destroy();
            }
        }
        else {
            var idx = 1,
                pos = morph.position();
            morph.destroy();
            this.frame.contents.children.forEach(function (icon) {
                if (pos.gt(icon.position()) || pos.y > icon.bottom()) {
                    idx += 1;
                }
            });
            if (morph instanceof SpriteIconMorph) {
                myself.sprites.add(morph.object, idx);
            }
            myself.createCorral();
            myself.fixLayout();
        }
    };

};

IDE_Morph.prototype.createInstructions = function (x, y) {
    var instructionsDiv,
        myself = this;
    if (document.getElementById('instructionsDiv') == null) {
        instructionsDiv = document.createElement('div');
        instructionsDiv.style.visibility = 'hidden';
        instructionsDiv.id = 'instructionsDiv';
        instructionsDiv.style.overflow = 'scroll';
        document.body.appendChild(instructionsDiv);
        instructionsDiv.style.position = "absolute";
        instructionsDiv.style.left = x + "px";
        instructionsDiv.style.top = y + "px";
        instructionsDiv.style.width = "420px";
        instructionsDiv.style.height = "300px";
        instructionsDiv.style.zIndex = "2";
        instructionsDiv.style.backgroundColor = '#FFFFFF';
        instructionsDiv.style.padding = '10px';
        instructionsDiv.innerHTML = this.instructions;
        instructionsDiv.oncontextmenu = function () {
            return false;
        }
        instructionsDiv.onmousedown = function () {
            return false;
        }
    }

}


// IDE_Morph layout

IDE_Morph.prototype.fixLayout = function (situation) {
    // situation is a string, i.e.
    // 'selectSprite' or 'refreshPalette' or 'tabEditor'
    var padding = this.padding;

    Morph.prototype.trackChanges = false;

    if (situation !== 'refreshPalette') {
        // controlBar
        this.controlBar.setPosition(this.logo.topRight());
        this.controlBar.setWidth(this.right() - this.controlBar.left());
        this.controlBar.fixLayout();

        // categories
        this.categories.setLeft(this.logo.left());
        this.categories.setTop(this.logo.bottom());
    }

    // palette
    this.palette.setLeft(this.logo.left());
    this.palette.setTop(this.categories.bottom());
    this.palette.setHeight(this.bottom() - this.palette.top());

    if (situation !== 'refreshPalette') {
        // stage
        if (this.isAppMode) {
        	// the last number is the height of the instructions + its padding
            this.stage.setScale(Math.floor(Math.min(
                    (this.width() - padding * 2) / this.stage.dimensions.x,
                    (this.height() - this.controlBar.height() * 2 - padding * 2 - 50)
                    / this.stage.dimensions.y
            ) * 10) / 10);
            this.stage.setCenter(this.center());
        } else {
            //            this.stage.setScale(this.isSmallStage ? 0.5 : 1);
            this.stage.setScale(this.isSmallStage ? this.stageRatio : 1);
            this.stage.setTop(this.logo.bottom() + padding);
            this.stage.setRight(this.right());
        }

        // spriteBar
        this.spriteBar.setPosition(this.logo.bottomRight().add(padding));
        this.spriteBar.setExtent(new Point(
            Math.max(0, this.stage.left() - padding - this.spriteBar.left()),
                this.categories.bottom() - this.spriteBar.top() - padding
        ));
        this.spriteBar.fixLayout();

        // spriteEditor
        if (this.spriteEditor.isVisible) {
            this.spriteEditor.setPosition(this.spriteBar.bottomLeft());
            this.spriteEditor.setExtent(new Point(
                this.spriteBar.width(),
                    this.bottom() - this.spriteEditor.top()
            ));
        }

        // corralBar
        this.corralBar.setLeft(this.stage.left());
        this.corralBar.setTop(this.stage.bottom() + padding);
        this.corralBar.setWidth(this.stage.width());

        // corral
        if (!contains(['selectSprite', 'tabEditor'], situation)) {
            this.corral.setPosition(this.corralBar.bottomLeft());
            this.corral.setWidth(this.stage.width());
            this.corral.setHeight(this.bottom() - this.corral.top());
            this.corral.fixLayout();
        }
    }

    Morph.prototype.trackChanges = true;
    this.changed();
};

IDE_Morph.prototype.setProjectName = function (string) {
    if (!(this.projectName === string)) {
        this.projectName = string.replace(/['"]/g, ''); // filter quotation marks
        this.hasChangedMedia = true;
        this.controlBar.updateLabel();
    }
};

IDE_Morph.prototype.setProjectId = function (string) {
    this.projectId = string;
    location.hash = '';
};

// IDE_Morph resizing

IDE_Morph.prototype.setExtent = function (point) {
    var padding = new Point(430, 110),
        minExt,
        ext;

    // determine the minimum dimensions making sense for the current mode
    if (this.isAppMode) {
        minExt = StageMorph.prototype.dimensions.add(
                this.controlBar.height() + 10
        );
    } else {
        /* // auto-switches to small stage mode, commented out b/c I don't like it
         if (point.x < 910) {
         this.isSmallStage = true;
         this.stageRatio = 0.5;
         }
         */
        minExt = this.isSmallStage ?
            padding.add(StageMorph.prototype.dimensions.divideBy(2))
            : padding.add(StageMorph.prototype.dimensions);
        /*
         minExt = this.isSmallStage ?
         new Point(700, 350) : new Point(910, 490);
         */
    }
    ext = point.max(minExt);
    IDE_Morph.uber.setExtent.call(this, ext);
    this.fixLayout();
};

// IDE_Morph events

IDE_Morph.prototype.reactToWorldResize = function (rect) {
    if (this.isAutoFill) {
        this.setPosition(rect.origin);
        this.setExtent(rect.extent());
    }
    if (this.filePicker) {
        document.body.removeChild(this.filePicker);
        this.filePicker = null;
    }
};

IDE_Morph.prototype.setCostumeFromImage = function (aCanvas, name) {
    var costume = new Costume(
        aCanvas,
        name ? name.split('.')[0] : '' // up to period
    );

    if (costume.isTainted()) {
        this.inform(
            'Unable to import this image',
                'The picture you wish to import has been\n' +
                'tainted by a restrictive cross-origin policy\n' +
                'making it unusable for costumes in Snap!. \n\n' +
                'Try downloading this picture first to your\n' +
                'computer, and import it from there.'
        );
        return;
    }

    this.currentSprite.addCostume(costume);
    this.currentSprite.wearCostume(costume);
    this.hasChangedMedia = true;
};

IDE_Morph.prototype.droppedImage = function (aCanvas, name, importType, method) {
    var sprite = this.currentSprite,
        name = sprite.devName ? sprite.devName : sprite.name,
        type = sprite instanceof StageMorph ? 'Stage' : 'Sprite';
    if(!this.currentSprite.isLocked || this.developer) {
        if (!this.developer && StageMorph.prototype.inPaletteBlocks['tab-costumes'] == false) {
            return null;
        }
        var costume = new Costume(
            aCanvas,
            name ? name.split('.')[0] : '' // up to period
        );

        if (costume.isTainted()) {
            this.inform(
                'Unable to import this image',
                    'The picture you wish to import has been\n' +
                    'tainted by a restrictive cross-origin policy\n' +
                    'making it unusable for costumes in Snap!. \n\n' +
                    'Try downloading this picture first to your\n' +
                    'computer, and import it from there.'
            );
            return;
        }

        if (this.currentSprite.isLocked) {
            costume.locked = true;
        }
        this.currentSprite.addCostume(costume);
        this.currentSprite.wearCostume(costume);
        if(costume.name != 'toggleGrid') {

            var logObj = {action: importType + 'Import', method: method};

            if (importType == 'costume'){
                logObj.type = type;
                logObj.spriteID = sprite.devName ? sprite.devName : sprite.name;
                logObj.name = costume.name;
            }
            else if(importType == 'sprite'){
                logObj.name = sprite.name;
            }
            this.updateLog(logObj);
            this.unsavedChanges = true;
        }
        this.hasChangedMedia = true;

        if(name != 'toggleGrid.png') {
            this.spriteBar.tabBar.tabTo('costumes');
        }

    }
    else {
        this.showMessage('This sprite is locked and importing costumes is disabled.', 5);
    }
};

IDE_Morph.prototype.droppedSVG = function (anImage, name) {
    var costume = new SVG_Costume(anImage, name.split('.')[0]);
    this.currentSprite.addCostume(costume);
    this.currentSprite.wearCostume(costume);
    this.spriteBar.tabBar.tabTo('costumes');
    this.hasChangedMedia = true;
    this.showMessage(
        'SVG costumes are\nnot yet fully supported\nin every browser',
        2
    );
};

IDE_Morph.prototype.droppedAudio = function (anAudio, name) {
    this.currentSprite.addSound(anAudio, name.split('.')[0]); // up to period
    this.spriteBar.tabBar.tabTo('sounds');
    this.hasChangedMedia = true;
};

IDE_Morph.prototype.setAudioSrc = function(audio, src) {
    audio.src = src;
};

IDE_Morph.prototype.setImageSrc = function(image, src) {
    var patt = /^(data:image|http(s)?:\/\/octopi[-\w]*\.herokuapp\.com)/;
    if (!(src && src.length > 0  && patt.test(src))) {
        image.crossOrigin = "Anonymous";
    }
    image.src = src;
};

IDE_Morph.prototype.removeXMLInfo = function(aString) {
    //Regex breakdown:
    //^<\?xml - string that starts with "<?xml"
    //((?!\?>).)* - any number of characters so long as none of them are '?>'
    //\?>\s+ - after "<?xml" + any number of characters, match "?>" followed by any number of white space (including 0)
    return aString.replace(/^<\?xml((?!\?>).)*\?>\s+/,'');
};

IDE_Morph.prototype.droppedText = function (aString, name, options) {
    aString = this.removeXMLInfo(aString);
    var lbl = name ? name.split('.')[0] : '';
    if (aString.indexOf('<project') === 0) {
        return this.openProjectString(aString);
    }
    if (aString.indexOf('<snapdata') === 0) {
        return this.openCloudDataString(aString, options);
    }
    if (aString.indexOf('<blocks') === 0) {
        return this.openBlocksString(aString, lbl, true);
    }
    if (aString.indexOf('<sprites') === 0) {
        return this.openSpritesString(aString);
    }
    if (aString.indexOf('<media') === 0) {
        return this.openMediaString(aString);
    }
};

IDE_Morph.prototype.droppedBinary = function (anArrayBuffer, name) {
    // dynamically load ypr->Snap!
    var ypr = document.getElementById('ypr'),
        myself = this,
        suffix = name.substring(name.length - 3);

    if (suffix.toLowerCase() !== 'ypr') {
        return;
    }

    function loadYPR(buffer, lbl) {
        var reader = new sb.Reader(),
            pname = lbl.split('.')[0]; // up to period
        reader.onload = function (info) {
            myself.droppedText(new sb.XMLWriter().write(pname, info));
        };
        reader.readYPR(new Uint8Array(buffer));
    }

    if (!ypr) {
        ypr = document.createElement('script');
        ypr.id = 'ypr';
        ypr.onload = function () {
            loadYPR(anArrayBuffer, name);
        };
        document.head.appendChild(ypr);
        ypr.src = 'ypr.js';
    } else {
        loadYPR(anArrayBuffer, name);
    }
};

// IDE_Morph helper function to change button color based on button actions
IDE_Morph.prototype.changeButtonColor = function (buttonAction) {

    if (buttonAction == "getReady") {
        this.controlBar.goButton.labelColor = new Color(0, 200, 0);
    }
    else if (buttonAction == "go") {
        this.controlBar.goButton.labelColor = new Color(125, 125, 125);
        //this.controlBar.getReadyButton.labelColor = new Color (125, 125, 125);
        //this.controlBar.getReadyButton.drawNew();
        //this.controlBar.getReadyButton.fixLayout();
    }
    else if (buttonAction == "stopAllScripts" || buttonAction == "fileChange") {
        this.controlBar.goButton.labelColor = new Color(125, 125, 125);
        //this.controlBar.getReadyButton.labelColor = new Color(84, 255, 159);
        //this.controlBar.getReadyButton.drawNew();
        //this.controlBar.getReadyButton.fixLayout();
    }
    this.controlBar.goButton.drawNew();
    this.controlBar.goButton.fixLayout();
};


// IDE_Morph button actions

IDE_Morph.prototype.refreshPalette = function (shouldIgnorePosition) {
    var oldTop = this.palette.contents.top();

    this.createPalette();
    this.fixLayout('refreshPalette');
    if (!shouldIgnorePosition) {
        this.palette.contents.setTop(oldTop);
    }
};

IDE_Morph.prototype.addComment = function () {
    if (this.currentTab === 'costumes' || this.currentTab === 'sounds') {
        this.spriteBar.tabBar.tabTo('scripts');
    }
    new CommentMorph().pickUp(this.world());
};

IDE_Morph.prototype.go = function () { //click for goButton
    this.updateLog({action: 'buttonClick', button: 'go'});
    this.unsavedChanges = true;
    if (this.world().currentKey === 16 && this.allowTurbo == true) { // shiftClicked
        this.toggleFastTracking();
    } else {
        if (this.currentState == 1) {
            this.changeButtonColor('go');
            this.runScripts('flag');
            this.currentState = 2;
        }
    }
};

IDE_Morph.prototype.getReady = function () { // Click for getReadyButton
    this.updateLog({action: 'buttonClick', button: 'getReady'});
    this.unsavedChanges = true;
    this.stage.fireStopAllEvent();
    this.currentState = 0;
    if (this.currentState == 0) {
        this.changeButtonColor('getReady');
        this.runScripts('ready');
        this.currentState = 1;
    }
    else if (this.currentState == 1) {
        this.runScripts('ready');
    }
};

IDE_Morph.prototype.toggleFastTracking = function () {
    if (this.stage.isFastTracked) {
        this.stopFastTracking();
    } else {
        this.startFastTracking();
    }
};

IDE_Morph.prototype.toggleVariableFrameRate = function () {
    if (StageMorph.prototype.frameRate) {
        StageMorph.prototype.frameRate = 0;
        this.stage.fps = 0;
    } else {
        StageMorph.prototype.frameRate = 30;
        this.stage.fps = 30;
    }
};

IDE_Morph.prototype.startFastTracking = function () {
    this.stage.isFastTracked = true;
    this.stage.fps = 0;
    this.controlBar.goButton.labelString = new SymbolMorph('flash', 14);
    this.controlBar.goButton.drawNew();
    this.controlBar.goButton.fixLayout();
};

IDE_Morph.prototype.stopFastTracking = function () {
    this.stage.isFastTracked = false;
    this.stage.fps = this.stage.frameRate;
    this.controlBar.goButton.labelString = new SymbolMorph('flag', 14);
    this.controlBar.goButton.drawNew();
    this.controlBar.goButton.fixLayout();
};

IDE_Morph.prototype.runScripts = function (clickedButton) {
    if (clickedButton == 'flag') {
        this.stage.fireReadyEvent();
    }
    else if (clickedButton == 'ready') {
        this.stage.fireGreenFlagEvent();
    }
};

IDE_Morph.prototype.togglePauseResume = function () {
    if (this.stage.threads.isPaused()) {
        this.updateLog({action: 'buttonClick', button: 'togglePauseResume', toState: 'Resume'});
        this.stage.threads.resumeAll(this.stage);
    } else {
        this.updateLog({action: 'buttonClick', button: 'togglePauseResume', toState: 'Pause'});
        this.stage.threads.pauseAll(this.stage);
    }
    this.unsavedChanges = true;
    this.controlBar.pauseButton.refresh();
};

IDE_Morph.prototype.isPaused = function () {
    if (!this.stage) {
        return false;
    }
    return this.stage.threads.isPaused();
};

IDE_Morph.prototype.stopAllScripts = function () {
    this.updateLog({action: 'buttonClick', button: 'stop'});
    this.unsavedChanges = true;
    if (this.currentState != 0) {
        this.changeButtonColor('stopAllScripts');
        this.currentState = 0;
    }
    this.stage.fireStopAllEvent();
};

IDE_Morph.prototype.selectSprite = function (sprite) {
    if (this.currentSprite.startingScriptsDialogMorph) {
        this.currentSprite.startingScriptsDialogMorph.destroy();
        this.currentSprite.startingScriptsDialogMorph = undefined;
    }
    if (sprite.isInert == true && !this.developer && sprite.name != 'toggleGrid') {// this is how we show the grid
        this.currentSprite = detect(
            this.stage.children,
            function (morph) {
                return (morph instanceof(SpriteMorph) && !(morph.isInert));
            }
        ) || this.stage;
    }
    else {
        this.currentSprite = sprite;
    }
    if (!this.demoMode && !this.isAppMode) {
        this.createCategories();
        this.createPalette();
        this.createSpriteBar();
        this.createSpriteEditor();
        this.corral.refresh();
        this.fixLayout('selectSprite');
        this.currentSprite.scripts.fixMultiArgs();

        if (!(this.currentSprite instanceof StageMorph)) {
            this.currentSprite.updateSize();
            this.currentSprite.updatePosition();
        }
    }
};

// IDE_Morph skins

IDE_Morph.prototype.defaultDesign = function () {
    this.setDefaultDesign();
    this.refreshIDE();
    this.removeSetting('design');
};

IDE_Morph.prototype.refreshIDE = function () {
    var projectData;

    if (Process.prototype.isCatchingErrors) {
        try {
            projectData = this.serializer.serialize(this.stage);
        } catch (err) {
            this.showMessage('Serialization failed: ' + err);
        }
    } else {
        projectData = this.serializer.serialize(this.stage);
    }
    SpriteMorph.prototype.initBlocks();
    this.buildPanes();
    this.fixLayout();
    if (this.loadNewProject) {
        this.newProject();
    } else {
        this.openProjectString(projectData);
    }
    //SpriteMorph.prototype.updateSize();
};

// IDE_Morph settings persistance

IDE_Morph.prototype.applySavedSettings = function () {
    var design = this.getSetting('design'),
        zoom = this.getSetting('zoom'),
        language = this.getSetting('language'),
        click = this.getSetting('click'),
        longform = this.getSetting('longform'),
        plainprototype = this.getSetting('plainprototype');

    /*
     // design
     if (design === 'flat') {
     this.setFlatDesign();
     } else {
     this.setDefaultDesign();
     }
     */

    // blocks zoom
    if (zoom) {
        SyntaxElementMorph.prototype.setScale(zoom);
        CommentMorph.prototype.refreshScale();
        SpriteMorph.prototype.initBlocks();
    }

    // language
    if (language && language !== 'en') {
        this.userLanguage = language;
    } else {
        this.userLanguage = null;
    }

    //  click
    if (click && !BlockMorph.prototype.snapSound) {
        BlockMorph.prototype.toggleSnapSound();
    }

    // long form
    if (longform) {
        InputSlotDialogMorph.prototype.isLaunchingExpanded = true;
    }

    // plain prototype labels
    if (plainprototype) {
        BlockLabelPlaceHolderMorph.prototype.plainLabel = true;
    }
};

IDE_Morph.prototype.saveSetting = function (key, value) {
    if (localStorage) {
        localStorage['-snap-setting-' + key] = value;
    }
};

IDE_Morph.prototype.getSetting = function (key) {
    if (localStorage) {
        return localStorage['-snap-setting-' + key];
    }
    return null;
};

IDE_Morph.prototype.removeSetting = function (key) {
    if (localStorage) {
        delete localStorage['-snap-setting-' + key];
    }
};

IDE_Morph.prototype.nextTask = function () {
    this.exitMessage = "go to the next task";
    /*
     var responseObj;

     $.ajax{url: window.location.href,
     success: function(response, err){responseObj = response;},
     dataType: 'json'});
     */
    if (IDE_Morph.prototype.nextTaskPath != '' && IDE_Morph.prototype.nextTaskPath != null) {
        window.location.assign(IDE_Morph.prototype.nextTaskPath)
    }
};

IDE_Morph.prototype.prevTask = function () {
    this.exitMessage = "go to the previous task";
    if (IDE_Morph.prototype.prevTaskPath != '' && IDE_Morph.prototype.prevTaskPath != null) {
        window.location.assign(IDE_Morph.prototype.prevTaskPath)
    }
};

IDE_Morph.prototype.exitOut = function () {
    this.exitMessage = "exit La Playa";
    if (IDE_Morph.prototype.returnPath != '' && IDE_Morph.prototype.returnPath != null) {
        window.location.assign(IDE_Morph.prototype.returnPath)
    }
};

IDE_Morph.prototype.saveTask = function () {
    var project,
        xml = this.serializer.serialize(this.stage),
        myself = this,
        colors = [
            this.groupColor,
            this.frameColor.darker(50),
            this.frameColor.darker(50)
        ];
    this.updateLog({action: 'buttonClick', button: 'saveTask'});
    //TODO: Get rid of this after testing
    //this.log = [];
    //this.unsavedChanges = false;

    var callback = function (err, result) {
        project = result;
        if (myself.analysisProcessor) {
            var results = myself.analysisProcessor(project);
            myself.saveProjectToCloud(myself.projectName);
            if (results['completed'] == true) {
                myself.stage.fireCompletedEvent();
                myself.makePop('<br><br><center><font style ="font-size:48px" color = "green"> Congratulations! You have completed this task!</font></center>');
            }
            else if (results['html']) {
                myself.makePop('<br><br>' + results['html']);
            }
            else {
                myself.makePop("<br><br>Your project has been saved! This project does not contain feedback.");
            }
        }
        else {
            myself.saveProjectToCloud(myself.projectName);
            myself.makePop(null);
        }
        myself.results = results;
    };
    octopi_xml2js(xml, callback);

    if(this.saveClicked == undefined  && IDE_Morph.prototype.nextTaskPath != null
        && IDE_Morph.prototype.nextTaskPath != '')
    {
        var nextTaskButton = this.controlBar.nextTaskButton;

        nextTaskButton.labelString = new SymbolMorph('arrowRight', 14);
        nextTaskButton.action = function () {
                myself.confirm(
                    'Are you sure you want to leave this task and go to the next task?',
                    'Next Task',
                    function() {
                    	myself.nextTask();
                    }
                );
        };
        nextTaskButton.color = colors[0];
        nextTaskButton.highlightColor = colors[1];
        nextTaskButton.pressColor = colors[2];
        nextTaskButton.hint = 'Next Task';
        nextTaskButton.labelColor = this.buttonLabelColor;
        nextTaskButton.drawNew();
        nextTaskButton.fixLayout();
        this.saveClicked = true;
    }
};

IDE_Morph.prototype.makePop = function (str) {
    var myself = this;
    var closeButton =
        '<div style ="position:absolute; right:40px">' +
        '<button style="position: fixed;" onclick="hideDiv(results)">&#10006</button>' +
        '</div>';
    if (str == null) {
        str = "<br><br>Your project has been saved! This project does not contain feedback.";
    }

    var checkDiv = document.getElementById('results');
    if (checkDiv == null) {
        var div = document.createElement('div');
        div.id = 'results';
        div.style.position = "absolute";
        div.style.backgroundColor = "white";
        document.body.appendChild(div);
        div.style.left = "80px";
        div.style.top = "80px";
        div.style.zIndex = "1000";
        if (myself.isSmallStage) {
            div.style.right = "300px";
        }
        else {
            div.style.right = "500px";
        }
        div.style.height = "75%";
        div.style.overflow = "scroll";
        div.style.paddingLeft = "10px";
        div.innerHTML = closeButton + (str || '');
        div.oncontextmenu = function () {
            return false;
        };
        document.body.appendChild(div);
    }
    else {
        if (checkDiv.style.visibility == "visible") {
            checkDiv.innerHTML = closeButton + (str || '');
        }
        else {
            checkDiv.style.visibility = "visible";
            checkDiv.style.overflow = 'scroll';
            checkDiv.innerHTML = closeButton + (str || '');
        }
    }
};

function hideDiv(div) {
    var div = document.getElementById('results');
    div.style.visibility = 'hidden';
    div.style.overflow = 'hidden';
}

document.documentElement.style.overflow = "hidden";

// IDE_Morph sprite list access
IDE_Morph.prototype.addTurtleSprite = function () {
    this.addNewSprite();
    this.updateLog({action:'spriteImport', method:'turtle', name: this.currentSprite.name});
    this.unsavedChanges = true;
};

IDE_Morph.prototype.addNewSprite = function (name) {
    var sprite = new SpriteMorph(this.globalVariables),
        rnd = Process.prototype.reportRandom;
    if (this.currentSpriteTab != 'Sprites' && name != 'toggleGrid') {
        this.corralBar.tabBar.tabTo('Sprites');
    }
    this.stage.add(sprite);
    if (name) {
        sprite.setName(name);
    }
    else {
        sprite.setName("Sprite");
    }
    sprite.setCenter(this.stage.center());

    if(name != 'toggleGrid') {
        // randomize sprite properties
        sprite.setHue(rnd.call(this, 0, 100));
        sprite.setBrightness(rnd.call(this, 50, 100));
        sprite.setXPosition(rnd.call(this, 20, 440));
        sprite.setYPosition(rnd.call(this, 20, 320));
    }

    this.sprites.add(sprite);
    if (!(name == 'toggleGrid')) {
        this.corral.addSprite(sprite);
        this.selectSprite(sprite);
    }
    if(name == 'toggleGrid'){
        sprite.isInert = true;
    }
};

IDE_Morph.prototype.paintNewSprite = function () {
    var sprite = new SpriteMorph(this.globalVariables),
        cos = new Costume(),
        myself = this;
    if (this.currentSpriteTab != 'Sprites') {
        this.corralBar.tabBar.tabTo('Sprites');
    }
    sprite.setCenter(this.stage.center());
    this.stage.add(sprite);
    sprite.setName("Sprite");

    this.sprites.add(sprite);
    this.corral.addSprite(sprite);
    this.selectSprite(sprite);

    cos.edit(
        this.world(),
        this,
        true,
        function () { //on cancel
            myself.removeSprite(sprite);
            myself.updateLog({action: 'cancelWindow', window: 'paintSprite'});
        },
        function () { //on submit
            sprite.addCostume(cos);
            sprite.wearCostume(cos);
            myself.updateLog({action:'spriteImport', method:'paint', name: sprite.name});
            this.unsavedChanges = true;
        }
    );

};

IDE_Morph.prototype.pickSpriteLibrary = function () {
    var myself = this;
    new ProjectDialogMorph(myself, 'sprites').popUp();
};

IDE_Morph.prototype.duplicateSprite = function (sprite) {
    var duplicate = sprite.fullCopy();

    if (!(this.developer)) {
        duplicate.devName = undefined;
    }
    duplicate.setPosition(this.world().hand.position());
    this.stage.add(duplicate);
    duplicate.setName(sprite.name);

    duplicate.keepWithin(this.stage);
    this.sprites.add(duplicate);
    this.corral.addSprite(duplicate);
    this.selectSprite(duplicate);
};

IDE_Morph.prototype.removeSprite = function (sprite) {
    myself = this;
    var idx = this.sprites.asArray().indexOf(sprite) + 1;

    sprite.destroy();
    this.stage.watchers().forEach(function (watcher) {
        if (watcher.object() === sprite) {
            watcher.destroy();
        }
    });

    if (idx < 1) {
        return;
    }
    if (!this.currentSprite || this.currentSprite == sprite) {
        this.currentSprite = detect(
            this.stage.children,
            function (morph) {
                return (morph instanceof SpriteMorph && (!morph.isInert || myself.developer));
            } // fix for dev mode
        ) || this.stage;
    }
        this.sprites.remove(this.sprites.asArray().indexOf(sprite) + 1);
        if (!this.isAppMode) {
            this.createCorral();
            this.fixLayout();
            this.selectSprite(this.currentSprite);
        }
};

// IDE_Morph menus

IDE_Morph.prototype.userMenu = function () {
    var menu = new MenuMorph(this);
    //menu.addItem('help', 'nop');
    return menu;
};

IDE_Morph.prototype.snapMenu = function () {
    /*
     var menu,
     world = this.world();

     menu = new MenuMorph(this);


     menu.addItem(
     'Reference manual',
     function () {
     window.open('help/SnapManual.pdf', 'SnapReferenceManual');
     }
     );
     menu.addItem(
     'Snap! website',
     function () {
     window.open('http://snap.berkeley.edu/', 'SnapWebsite');
     }
     );
     menu.addItem(
     'Download source',
     function () {
     window.open(
     'http://snap.berkeley.edu/snapsource/snap.zip',
     'SnapSource'
     );
     }
     );
     if (world.isDevMode) {
     menu.addLine();
     menu.addItem(
     'Switch back to user mode',
     'switchToUserMode',
     'disable deep-Morphic\ncontext menus'
     + '\nand show user-friendly ones',
     new Color(0, 100, 0)
     );
     } else if (world.currentKey === 16) { // shift-click
     menu.addLine();
     menu.addItem(
     'Switch to dev mode',
     'switchToDevMode',
     'enable Morphic\ncontext menus\nand inspectors,'
     + '\nnot user-friendly!',
     new Color(100, 0, 0)
     );
     }
     menu.popup(world, this.logo.bottomLeft());
     */
};

IDE_Morph.prototype.cloudMenu = function () {
    var menu,
        myself = this,
        world = this.world(),
        pos = this.controlBar.cloudButton.bottomLeft(),
        shiftClicked = (world.currentKey === 16);

    menu = new MenuMorph(this);

    SnapCloud.getMenuItems(shiftClicked).forEach(function (pair) {
        if (pair) {
            menu.addItem.apply(menu, pair);
        } else {
            menu.addLine();
        }
    });
};

IDE_Morph.prototype.settingsMenu = function () {
    var menu,
        myself = this,
        stage = this.stage,
        world = this.world(),
        myself = this,
        pos = this.controlBar.settingsButton.bottomLeft(),
        shiftClicked = (world.currentKey === 16);

    function addPreference(label, toggle, test, onHint, offHint, hide) {
        var on = '\u2611 ',
            off = '\u2610 ';
        if (!hide || shiftClicked) {
            menu.addItem(
                    (test ? on : off) + localize(label),
                toggle,
                test ? onHint : offHint,
                hide ? new Color(100, 0, 0) : null
            );
        }
    }

    menu = new MenuMorph(this);
    /*
     menu.addItem('Language...', 'languageMenu');
     menu.addItem(
     'Zoom blocks...',
     'userSetBlocksScale'
     );
     menu.addItem(
     'Stage size...',
     'userSetStageSize'
     );*/
    if (myself.developer) {
        menu.addItem(
            'Student View',
            function () {
                myself.developer = !myself.developer;
                this.refreshIDE();
            }
        );
    }
    else {
        menu.addItem(
            'Developer View',
            function () {
                myself.developer = !myself.developer;
                this.refreshIDE();
            }
        );
    }

    if (this.developer) {
        menu.addLine();
        addPreference(
            'Allow importing sprites',
            'toggleSpriteImporting',
            myself.importableSprites,
            'uncheck to disallow students to import sprites',
            'check to allow students to import sprites'
        );
        addPreference(
            'HatBlocks with thumbnails',
            'toggleHasHatThumbnails',
            myself.hasHatThumbnails,
            'Events Tab View will have thumbnails of\n' +
                'the sprite each HatBlock belongs to',
            'Events Tab View will have sprites separated\n' +
                'by white lines with the standard HatBlock'
        );
        addPreference(
            'Blurred shadows',
            'toggleBlurredShadows',
            useBlurredShadows,
            'uncheck to use solid drop\nshadows and highlights',
            'check to use blurred drop\nshadows and highlights',
            true
        );
        addPreference(
            'Dynamic input labels',
            'toggleDynamicInputLabels',
            SyntaxElementMorph.prototype.dynamicInputLabels,
            'uncheck to disable dynamic\nlabels for variadic inputs',
            'check to enable dynamic\nlabels for variadic inputs',
            true
        );
        addPreference(
            'Prefer empty slot drops',
            'togglePreferEmptySlotDrops',
            ScriptsMorph.prototype.isPreferringEmptySlots,
            'uncheck to allow dropped\nreporters to kick out others',
            'settings menu prefer empty slots hint',
            true
        );
        addPreference(
            'Long form input dialog',
            'toggleLongFormInputDialog',
            InputSlotDialogMorph.prototype.isLaunchingExpanded,
            'uncheck to use the input\ndialog in short form',
            'check to always show slot\ntypes in the input dialog'
        );
        addPreference(
            'Plain prototype labels',
            'togglePlainPrototypeLabels',
            BlockLabelPlaceHolderMorph.prototype.plainLabel,
            'uncheck to always show (+) symbols\nin block prototype labels',
            'check to hide (+) symbols\nin block prototype labels'
        );
        addPreference(
            'Virtual keyboard',
            'toggleVirtualKeyboard',
            MorphicPreferences.useVirtualKeyboard,
            'uncheck to disable\nvirtual keyboard support\nfor mobile devices',
            'check to enable\nvirtual keyboard support\nfor mobile devices',
            true
        );
        addPreference(
            'Input sliders',
            'toggleInputSliders',
            MorphicPreferences.useSliderForInput,
            'uncheck to disable\ninput sliders for\nentry fields',
            'check to enable\ninput sliders for\nentry fields'
        );
        if (MorphicPreferences.useSliderForInput) {
            addPreference(
                'Execute on slider change',
                'toggleSliderExecute',
                InputSlotMorph.prototype.executeOnSliderEdit,
                'uncheck to supress\nrunning scripts\nwhen moving the slider',
                'check to run\nthe edited script\nwhen moving the slider'
            );
        }
        addPreference(
            'Clicking sound',
            function () {
                BlockMorph.prototype.toggleSnapSound();
                if (BlockMorph.prototype.snapSound) {
                    myself.saveSetting('click', true);
                } else {
                    myself.removeSetting('click');
                }
            },
            BlockMorph.prototype.snapSound,
            'uncheck to turn\nblock clicking\nsound off',
            'check to turn\nblock clicking\nsound on'
        );
        addPreference(
            'Animations',
            function () {
                myself.isAnimating = !myself.isAnimating;
            },
            myself.isAnimating,
            'uncheck to disable\nIDE animations',
            'check to enable\nIDE animations',
            true
        );
        addPreference(
            'Turbo mode',
            'toggleFastTracking',
            this.stage.isFastTracked,
            'uncheck to run scripts\nat normal speed',
            'check to prioritize\nscript execution'
        );
        addPreference(
            'Rasterize SVGs',
            function () {
                MorphicPreferences.rasterizeSVGs = !MorphicPreferences.rasterizeSVGs;
            },
            MorphicPreferences.rasterizeSVGs,
            'uncheck for smooth\nscaling of vector costumes',
            'check to rasterize\nSVGs on import',
            true
        );
        /*
         addPreference(
         'Flat design',
         function () {
         if (MorphicPreferences.isFlat) {
         return myself.defaultDesign();
         }
         myself.flatDesign();
         },
         MorphicPreferences.isFlat,
         'uncheck for default\nGUI design',
         'check for alternative\nGUI design',
         false
         );
         */
        addPreference(
            'Sprite Nesting',
            function () {
                SpriteMorph.prototype.enableNesting = !SpriteMorph.prototype.enableNesting;
            },
            SpriteMorph.prototype.enableNesting,
            'uncheck to disable\nsprite composition',
            'check to enable\nsprite composition',
            true
        );
        menu.addLine(); // everything below this line is stored in the project
        addPreference(
            'Thread safe scripts',
            function () {
                stage.isThreadSafe = !stage.isThreadSafe;
            },
            this.stage.isThreadSafe,
            'uncheck to allow\nscript reentrance',
            'check to disallow\nscript reentrance'
        );
        addPreference(
            'Prefer smooth animations',
            'toggleVariableFrameRate',
            StageMorph.prototype.frameRate,
            'uncheck for greater speed\nat variable frame rates',
            'check for smooth, predictable\nanimations across computers'
        );
        addPreference(
            'Flat line ends',
            function () {
                SpriteMorph.prototype.useFlatLineEnds = !SpriteMorph.prototype.useFlatLineEnds;
            },
            SpriteMorph.prototype.useFlatLineEnds,
            'uncheck for round ends of lines',
            'check for flat ends of lines'
        );
        addPreference(
            'Codification support',
            function () {
                StageMorph.prototype.enableCodeMapping = !StageMorph.prototype.enableCodeMapping;
                myself.currentSprite.blocksCache.variables = null;
                myself.currentSprite.paletteCache.variables = null;
                myself.refreshPalette();
            },
            StageMorph.prototype.enableCodeMapping,
            'uncheck to disable\nblock to text mapping features',
            'check for block\nto text mapping features',
            false
        );
    }
    menu.addLine();
    menu.addItem('About...', 'aboutSnap');
    menu.popup(world, pos);
};

IDE_Morph.prototype.projectMenu = function () {
    var menu,
        myself = this,
        world = this.world(),
        pos = this.controlBar.projectButton.bottomLeft(),
        graphicsName = this.currentSprite instanceof SpriteMorph ?
            'Costumes' : 'Backgrounds',
        shiftClicked = (world.currentKey === 16);

    myself.updateLog({action:'buttonClick', button:'projectMenu'});
    menu = new MenuMorph(this);
    menu.addItem('Project notes...', 'editProjectNotes');
    menu.addItem('Report a problem', 'reportBug');

    if (this.developer || this.sandbox) {
        menu.addLine();
        menu.addItem(
            'New',
            function () {
                myself.confirm(
                    'Replace the current project with a new one?',
                    'New Project',
                    (myself.sandbox) ?
                        function () {
                            myself.buildWithParams();
                        }
                        :
                        function () {
                            myself.newProject();
                        }
                );
            }
        );
        menu.addItem('Open...', 'openProjectsBrowser');
        menu.addItem(
            'Save',
            function () {
                if (myself.source === 'examples') {
                    myself.source = 'local'; // cannot save to examples
                }
                if (myself.projectName) {
                    if (myself.source === 'local') { // as well as 'examples'
                        myself.saveProject(myself.projectName);
                    } else if (myself.projectId) { // 'cloud'
                        myself.saveProjectToCloud(myself.projectName);
                    } else {
                        myself.saveProjectsBrowser();
                    }
                } else {
                    myself.saveProjectsBrowser();
                }
            }
        );
        if (shiftClicked) {
            menu.addItem(
                'Save to disk',
                'saveProjectToDisk',
                'experimental - store this project\nin your downloads folder',
                new Color(100, 0, 0)
            );
        }
        menu.addItem('Save As...', 'saveProjectsBrowser');
        menu.addItem('Rename File', 'fileRename');
    }
    menu.addLine();
    menu.addItem(
        'Import...',
        function () {
            var inp = document.createElement('input');
            myself.updateLog({action:'menuOption', option:'Import...'});
            if (myself.filePicker) {
                document.body.removeChild(myself.filePicker);
                myself.filePicker = null;
            }
            inp.type = 'file';
            inp.style.color = "transparent";
            inp.style.backgroundColor = "transparent";
            inp.style.border = "none";
            inp.style.outline = "none";
            inp.style.position = "absolute";
            inp.style.top = "0px";
            inp.style.left = "0px";
            inp.style.width = "0px";
            inp.style.height = "0px";
            inp.addEventListener(
                "change",
                function () {
                    document.body.removeChild(inp);
                    myself.filePicker = null;
                    world.hand.processDrop(inp.files);
                },
                false
            );
            document.body.appendChild(inp);
            myself.filePicker = inp;
            inp.click();
        },
        'file menu import hint' // looks up the actual text in the translator
    );

    var exportString, logString;
    if(shiftClicked){
       logString = 'exportProjectPlain';
       exportString = 'Export project as plain text...';
    }
    else {
        logString = 'exportProject';
        exportString = 'Export project...';
    }

    menu.addItem(
        exportString,
        function () {
            myself.updateLog({action: "menuOption", option: exportString});
            if (myself.projectName) {
                myself.exportProject(myself.projectName, shiftClicked);
            } else {
                myself.prompt('Export Project As...', function (name) {
                    myself.exportProject(name);
                }, null, 'exportProject');
            }
        },
        'show project data as XML\nin a new browser window',
        shiftClicked ? new Color(100, 0, 0) : null
    );

    if (this.developer) {
        if (shiftClicked) {
            menu.addItem(
                'export project media only...',
                function () {
                    if (myself.projectName) {
                        myself.exportProjectMedia(myself.projectName);
                    } else {
                        myself.prompt('Export Project As...', function (name) {
                            myself.exportProjectMedia(name);
                        }, null, 'exportProject');
                    }
                },
                null,
                this.hasChangedMedia ? new Color(100, 0, 0) : new Color(0, 100, 0)
            );
            menu.addItem(
                'export project without media...',
                function () {
                    if (myself.projectName) {
                        myself.exportProjectNoMedia(myself.projectName);
                    } else {
                        myself.prompt('Export Project As...', function (name) {
                            myself.exportProjectNoMedia(name);
                        }, null, 'exportProject');
                    }
                },
                null,
                new Color(100, 0, 0)
            );
            menu.addItem(
                'export project as cloud data...',
                function () {
                    if (myself.projectName) {
                        myself.exportProjectAsCloudData(myself.projectName);
                    } else {
                        myself.prompt('Export Project As...', function (name) {
                            myself.exportProjectAsCloudData(name);
                        }, null, 'exportProject');
                    }
                },
                null,
                new Color(100, 0, 0)
            );
        }
        menu.addItem(
            'Export blocks...',
            function () {
                myself.exportGlobalBlocks();
            },
            'show global custom block definitions as XML\nin a new browser window'
        );
        menu.addLine();
    }

    if (this.developer) {
        menu.addItem(
            'Import tools',
            function () {
                myself.droppedText(
                    myself.getURL(
                        'http://snap.berkeley.edu/snapsource/tools.xml'
                    ),
                    'tools'
                );
            },
            'load the official library of\npowerful blocks'
        );
        menu.addItem(
            'Libraries...',
            function () {
                // read a list of libraries from an external file,
                var libMenu = new MenuMorph(this, 'Import library'),
                    libUrl = 'http://snap.berkeley.edu/snapsource/libraries/' +
                        'LIBRARIES';

                function loadLib(name) {
                    var url = 'http://snap.berkeley.edu/snapsource/libraries/'
                        + name
                        + '.xml';
                    myself.droppedText(myself.getURL(url), name);
                }

                myself.getURL(libUrl).split('\n').forEach(function (line) {
                    if (line.length > 0) {
                        libMenu.addItem(
                            line.substring(line.indexOf('\t') + 1),
                            function () {
                                loadLib(
                                    line.substring(0, line.indexOf('\t'))
                                );
                            }
                        );
                    }
                });

                libMenu.popup(world, pos);
            },
            'Select categories of additional blocks to add to this project.'
        );
    }
    menu.popup(world, pos);
};

IDE_Morph.prototype.getCostumesList = function (dirname) {
    var dir,
        costumes = [];

    dir = this.getURL(dirname);
    costumes = JSON.parse(dir);

    costumes.sort(function (x, y) {
        return x.name < y.name ? -1 : 1;
    });
    return costumes;
};

IDE_Morph.prototype.tabMenu = function (point) {
    var myself = this;
    var menu = new MenuMorph(this);
    if (StageMorph.prototype.inPaletteBlocks['tab-' + myself.currentTab]) {
        menu.addItem(
            'Hide this tab',
            function () {
                myself.spriteBar.tabBar.children.forEach(function (child) {
                    if (child instanceof TabMorph) {
                        if (child.labelString.toLowerCase() == myself.currentTab) {
                            StageMorph.prototype.inPaletteBlocks['tab-' + myself.currentTab] = false;
                            child.labelColor = new Color(200, 0, 0);
                            child.fixLayout();
                            myself.spriteBar.refresh();
                            myself.spriteBar.fixLayout();
                        }
                    }
                });
            });
    }
    else {
        menu.addItem(
            'Show this tab',
            function () {
                myself.spriteBar.tabBar.children.forEach(function (child) {
                    if (child instanceof TabMorph) {
                        if (child.labelString.toLowerCase() == myself.currentTab) {
                            StageMorph.prototype.inPaletteBlocks['tab-' + myself.currentTab] = true;
                            child.labelColor = myself.buttonLabelColor;
                            //myself.spriteEditor.fixLayout();/
                            child.fixLayout();
                        }
                    }
                });
            });
    }
    menu.popup(this.world(), point);
};

// IDE_Morph menu actions

IDE_Morph.prototype.aboutSnap = function () {
    var dlg, aboutTxt, noticeTxt, creditsTxt, versions = '', translations,
        module, btn1, btn2, btn3, btn4, licenseBtn, translatorsBtn,
        world = this.world();

    aboutTxt = 'LaPlaya\n\n'
        //+ 'Copyright \u24B8 2014 Charlotte Hill and '

        + 'LaPlaya is developed by the University of California, Santa Barbara.\n'

        + 'The design of LaPlaya is built on top of Snap! from the University of\n'
        + 'California, Berkeley.\n\n'

        + 'For more information on Snap!, see \n'
        + 'http://snap.berkeley.edu';

    creditsTxt = localize('Development Staff')
        + '\n\nHilary Dwyer, Charlotte Hill, Ashley Iveland'
        + '\nJohan Henkens, James Cheng-yuan Hong, Sharon Levy'
        + '\nTimothy Martinez, Iris-Eleni Moridis, Logan Ortega'
        + '\nKenyon Prater, Jenny So, John Thomason, Rick Waltman';

    for (module in modules) {
        if (Object.prototype.hasOwnProperty.call(modules, module)) {
            versions += ('\n' + module + ' (' +
                modules[module] + ')');
        }
    }
    if (versions !== '') {
        versions = localize('current module versions:') + ' \n\n' +
            'morphic (' + morphicVersion + ')' +
            versions;
    }
    translations = localize('Translations') + '\n' + SnapTranslator.credits();

    dlg = new DialogBoxMorph();
    dlg.inform('About LaPlaya', aboutTxt, world);
    btn1 = dlg.buttons.children[0];
    /*
    translatorsBtn = dlg.addButton(
        function () {
            dlg.body.text = translations;
            dlg.body.drawNew();
            btn1.show();
            btn2.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.drawNew();
            dlg.setCenter(world.center());
        },
        'Translators...'
    );*/
    btn2 = dlg.addButton(
        function () {
            dlg.body.text = aboutTxt;
            dlg.body.drawNew();
            btn1.show();
            btn2.hide();
            btn4.show();
            dlg.fixLayout();
            dlg.drawNew();
            dlg.setCenter(world.center());
        },
        'Back...'
    );
    btn2.hide();
    /*
    licenseBtn = dlg.addButton(
        function () {
            dlg.body.text = noticeTxt;
            dlg.body.drawNew();
            btn1.show();
            btn2.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.drawNew();
            dlg.setCenter(world.center());
        },
        'License...'
    );
    btn3 = dlg.addButton(
        function () {
            dlg.body.text = versions;
            dlg.body.drawNew();
            btn1.show();
            btn2.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.drawNew();
            dlg.setCenter(world.center());
        },
        'Modules...'
    );*/
    btn4 = dlg.addButton(
        function () {
            dlg.body.text = creditsTxt;
            dlg.body.drawNew();
            btn1.show();
            btn2.show();
            btn4.hide();
            dlg.fixLayout();
            dlg.drawNew();
            dlg.setCenter(world.center());
        },
        'Credits...'
    );
    dlg.fixLayout();
    dlg.drawNew();
};

IDE_Morph.prototype.editProjectNotes = function () {
    var dialog = new DialogBoxMorph().withKey('projectNotes'),
        frame = new ScrollFrameMorph(),
        text = new TextMorph(this.projectNotes || ''),
        ok = dialog.ok,
        myself = this,
        size = 250,
        world = this.world();

    frame.padding = 6;
    frame.setWidth(size);
    frame.acceptsDrops = false;
    frame.contents.acceptsDrops = false;

    text.setWidth(size - frame.padding * 2);
    text.setPosition(frame.topLeft().add(frame.padding));
    text.enableSelecting();
    text.isEditable = true;

    frame.setHeight(size);
    frame.fixLayout = nop;
    frame.edge = InputFieldMorph.prototype.edge;
    frame.fontSize = InputFieldMorph.prototype.fontSize;
    frame.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    frame.contrast = InputFieldMorph.prototype.contrast;
    frame.drawNew = InputFieldMorph.prototype.drawNew;
    frame.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    frame.addContents(text);
    text.drawNew();

    dialog.ok = function () {
        var logObj = {action:'menuOption', option:'projectNotes'};

        if(myself.projectNotes != text.text){
            logObj.oldNotes = myself.projectNotes;
            logObj.newNotes = text.text;
            myself.unsavedChanges = true;
            myself.projectNotes = text.text;
        }
        ok.call(this);
        myself.updateLog(logObj);
    };

    dialog.justDropped = function () {
        text.edit();
    };

    dialog.labelString = 'Project Notes';
    dialog.createLabel();
    dialog.addBody(frame);
    frame.drawNew();
    dialog.addButton('ok', 'OK');
    dialog.addButton(
        function() {
            dialog.cancel();
            myself.updateLog({action:'cancelWindow', window:'projectNotes'});
        },
        'Cancel'
    );
    dialog.fixLayout();
    dialog.drawNew();
    dialog.popUp(world);
    dialog.setCenter(world.center());
    text.edit();
};

IDE_Morph.prototype.reportBug = function () {
    var dialog = new DialogBoxMorph().withKey('reportBug'),
        frame = new ScrollFrameMorph(),
        text = new TextMorph(''),
        ok = dialog.ok,
        myself = this,
        size = 250,
        world = this.world(),
        feedback = false,
        task = false,
        other = false,
        feedbackToggle,
        taskToggle,
        otherToggle,
        togglePos = new Point(10, 0),
        myself = this;

    frame.padding = 6;
    frame.setWidth(size);
    frame.acceptsDrops = false;
    frame.contents.acceptsDrops = false;
    frame.setHeight(size);
    frame.fixLayout = nop;
    frame.edge = InputFieldMorph.prototype.edge;
    frame.fontSize = InputFieldMorph.prototype.fontSize;
    frame.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    frame.contrast = InputFieldMorph.prototype.contrast;
    frame.drawNew = InputFieldMorph.prototype.drawNew;
    frame.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

	feedbackToggle = new ToggleMorph(
        'checkbox',
        null,
        function () {
            feedback = !feedback;
        },
        localize('The feedback I got was wrong'),
        function () {
            return feedback;
        }
    );
    taskToggle = new ToggleMorph(
        'checkbox',
        null,
        function () {
            task = !task;
        },
        localize('This project didn\'t work correctly'),
        function () {
            return task;
        }
    );
    otherToggle = new ToggleMorph(
        'checkbox',
        null,
        function () {
            other = !other;
        },
        localize('Other'),
        function () {
            return other;
        }
    );

    var options = [[feedbackToggle,, 'There was a problem with the feedback'],
					[taskToggle, 'There was a problem with this project'],
					[otherToggle, 'There was a problem with something else']];

	for (var i = 0; i < options.length; i++) {
		toggle = options[i][0];
        toggle.hint = options[i][1];
    	toggle.label.isBold = false;
    	toggle.label.setColor(this.buttonLabelColor);
    	toggle.color = this.tabColors[2];
    	toggle.highlightColor = this.tabColors[0];
		toggle.pressColor = this.tabColors[1];
    	toggle.tick.shadowOffset = new Point(); // new Point(-1, -1)
    	toggle.tick.shadowColor = new Color(); // black
    	toggle.tick.color = this.buttonLabelColor;
    	toggle.tick.isBold = false;
    	toggle.setPosition(new Point(togglePos.x, togglePos.y + frame.padding));
   		frame.addContents(toggle);
   		toggle.tick.drawNew();
    	toggle.drawNew();
    	togglePos = toggle.bottomLeft();
	}

	var prompt = new TextMorph("Thanks for your feedback! If you\'d like to add more details, you can write them below. Click the OK button to send this message to our support team!",
			14,
			null, // style
            false, // bold
            null, // italic
            null, // alignment
            null, // width
            null, // font name
            new Point(1, 1), // shadow offset
            new Color(255, 255, 255) // shadowColor
		);

	prompt.setWidth(size - frame.padding * 2);
    prompt.setPosition(new Point(togglePos.x, togglePos.y + frame.padding));
	frame.addContents(prompt);
	prompt.drawNew();

    text.setWidth(size - frame.padding * 2);
    text.setPosition(new Point(prompt.bottomLeft().x, prompt.bottomLeft().y + frame.padding));
    text.enableSelecting();
    text.isEditable = true;

    frame.addContents(text);
    text.drawNew();

    dialog.ok = function () {
        var logObj = {action:'menuOption', option:'reportBug'}; // TO DO: log
        data = {'feedback': feedback, 'task': task, 'other': other, 'details': text.text}
        snapCloud.saveFeedback(myself,
        		JSON.stringify(data),
        		myself.showMessage('Your feedback has been sent!'),
        		myself.cloudError());
        ok.call(this);
        myself.updateLog(logObj);
    };

    dialog.justDropped = function () {
        text.edit();
    };

    dialog.labelString = 'Report a Problem';
    dialog.createLabel();
    dialog.addBody(frame);
    frame.drawNew();
    dialog.addButton('ok', 'OK');
    dialog.addButton(
        function() {
            dialog.cancel();
            myself.updateLog({action:'cancelWindow', window:'reportBug'});
        },
        'Cancel'
    );
    dialog.fixLayout();
    dialog.drawNew();
    dialog.popUp(world);
    dialog.setCenter(world.center());
    text.edit();
};

IDE_Morph.prototype.newProject = function () {
    this.source = SnapCloud.username ? 'cloud' : 'local';
    if (this.stage) {
        this.stage.destroy();
    }
    if (location.hash.substr(0, 6) !== '#lang:') {
        location.hash = '';
    }
    this.globalVariables = new VariableFrame();
    this.currentSprite = new SpriteMorph(this.globalVariables);
    this.sprites = new List([this.currentSprite]);
    // set costume
    var myself = this;
    if (this.currentSprite.costumes.length() == 0) {
        var url = IDE_Morph.prototype.root_path + 'Costumes/octopi.png';
        var img = new Image();
        img.onload = function () {
            var canvas = newCanvas(new Point(img.width, img.height));
            canvas.getContext('2d').drawImage(img, 0, 0);
            myself.setCostumeFromImage(canvas, name);
        };
        IDE_Morph.prototype.setImageSrc(img, url);
    }
    StageMorph.prototype.dimensions = new Point(480, 360);
    StageMorph.prototype.hiddenPrimitives = {};
    StageMorph.prototype.inPaletteBlocks = {};
    StageMorph.prototype.codeMappings = {};
    StageMorph.prototype.codeHeaders = {};
    StageMorph.prototype.enableCodeMapping = false;
    SpriteMorph.prototype.useFlatLineEnds = false;
    this.setProjectName('');
    this.setProjectId('');
    this.projectNotes = '';
    this.createStage();
    this.add(this.stage);
    if (this.developer) {
        this.currentSprite.devName = ("Sprite");
    }
    this.createCorral();
    this.selectSprite(this.stage.children[0]);
    this.fixLayout();
};

IDE_Morph.prototype.saveProject = function (name) {
    var myself = this;
    this.nextSteps([
        function () {
            myself.showMessage('Saving...');
        },
        function () {
            myself.rawSaveProject(name);
        }
    ]);
};

IDE_Morph.prototype.rawSaveProject = function (name) {
    var str;
    if (name) {
        this.setProjectName(name);
        if (Process.prototype.isCatchingErrors) {
            try {
                localStorage['-snap-project-' + name]
                    = str = this.serializer.serialize(this.stage);
                //location.hash = '#open:' + str;
                this.showMessage('Saved!', 1);
            } catch (err) {
                this.showMessage('Save failed: ' + err);
            }
        } else {
            localStorage['-snap-project-' + name]
                = str = this.serializer.serialize(this.stage);
            //location.hash = '#open:' + str;
            this.showMessage('Saved!', 1);
        }
    }
};

IDE_Morph.prototype.saveProjectToDisk = function () {
    var data,
        link = document.createElement('a');

    if (Process.prototype.isCatchingErrors) {
        try {
            data = this.serializer.serialize(this.stage);
            link.setAttribute('href', 'data:text/xml,' + data);
            link.setAttribute('download', this.projectName + '.xml');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            this.showMessage('Saving failed: ' + err);
        }
    } else {
        data = this.serializer.serialize(this.stage);
        link.setAttribute('href', 'data:text/xml,' + data);
        link.setAttribute('download', this.projectName + '.xml');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

IDE_Morph.prototype.exportProject = function (name, plain) {
    var menu, str;
    if (name) {
        this.setProjectName(name);
        /* commented out original code
         if (Process.prototype.isCatchingErrors) {
         try {
         menu = this.showMessage('Exporting');
         str = encodeURIComponent(
         this.serializer.serialize(this.stage)
         );
         location.hash = '#open:' + str;
         window.open('data:text/'
         + (plain ? 'plain,' + str : 'xml,' + str));
         menu.destroy();
         this.showMessage('Exported!', 1);
         } catch (err) {
         this.showMessage('Export failed: ' + err);
         }
         } else {
         menu = this.showMessage('Exporting');
         str = encodeURIComponent(
         this.serializer.serialize(this.stage)
         );
         location.hash = '#open:' + str;
         window.open('data:text/'
         + (plain ? 'plain,' + str : 'xml,' + str));
         menu.destroy();
         this.showMessage('Exported!', 1);
         }/*/


        str = this.serializer.serialize(this.stage);
        var textFileAsBlob = new Blob([str], { type: 'Application/xml' });
        saveAs(textFileAsBlob, name + '.xml');
    }
};


function destroyClickedElement(event) {
    //for Firefox
    document.body.removeChild(event.target);
}


IDE_Morph.prototype.exportGlobalBlocks = function () {
    if (this.stage.globalBlocks.length > 0) {
        new BlockExportDialogMorph(
            this.serializer,
            this.stage.globalBlocks
        ).popUp(this.world());
    } else {
        this.inform(
            'Export blocks',
                'this project doesn\'t have any\n'
                + 'custom global blocks yet'
        );
    }
};

IDE_Morph.prototype.exportSprite = function (sprite) {
    var str = this.serializer.serialize(sprite);
    window.open('data:text/xml,<sprites app="'
        + this.serializer.app
        + '" version="'
        + this.serializer.version
        + '">'
        + str
        + '</sprites>');
};

IDE_Morph.prototype.openProjectString = function (str) {
    var msg,
        myself = this;
    this.nextSteps([
        function () {
            msg = myself.showMessage('Opening project...');
        },
        function () {
            myself.rawOpenProjectString(str);
        },
        function () {
            msg.destroy();
            myself.currentState = 0;
            myself.changeButtonColor('fileChange');
        },
        function () {
            if (myself.instructions != null) {
                myself.corralBar.tabBar.tabTo('instructions');
            }
        },
        function () {
            myself.sprites.asArray().forEach(function (sprite) {
                sprite.updateScriptNames('Sprite', sprite.name);
            });
        }
    ]);
    if (this.demoMode) {
        this.palette.destroy();
        this.spriteBar.destroy();
        this.corral.destroy();
    }
};

IDE_Morph.prototype.rawOpenProjectString = function (str) {
    if (!this.demoMode) {
        this.spriteBar.tabBar.tabTo('scripts');
        if (this.instructions == null) {
            this.corralBar.tabBar.tabTo('Sprites');
        }
        else {
            this.corralBar.tabBar.tabTo('instructions');
        }
    }
    else {
        this.toggleAppMode(this.demoMode); //true
    }
    StageMorph.prototype.hiddenPrimitives = {};
    StageMorph.prototype.inPaletteBlocks = {};
    StageMorph.prototype.codeMappings = {};
    StageMorph.prototype.codeHeaders = {};
    StageMorph.prototype.enableCodeMapping = false;
    if (Process.prototype.isCatchingErrors) {
        try {
            this.serializer.openProject(this.serializer.load(str), this);
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        this.serializer.openProject(this.serializer.load(str), this);
    }
    this.stopFastTracking();
};

IDE_Morph.prototype.openCloudDataString = function (str, options) {
    var existingMessage = undefined;
    var callback = undefined;
    if (typeof options !== 'undefined') {
        var existingMessage = options.existingMessage;
        var callback = options.callback;
    }
    callback = typeof callback === 'function' ? callback : function () {
    };
    var myself = this;
    if (typeof existingMessage != 'undefined') {
        msg = existingMessage;
    }
    var msg,
        myself = this;
    this.nextSteps([
        function () {
            if (!msg) {
                msg = myself.showMessage('Opening project...');
            }
        },
        function () {
            myself.rawOpenCloudDataString(str);
        },
        function () {
            msg.destroy();
        },
        callback
    ]);
};

IDE_Morph.prototype.rawOpenCloudDataString = function (str) {
    var model;
    if (this.demoMode) {
        this.toggleAppMode(true);
        //Insert button formatting here
    }
    StageMorph.prototype.hiddenPrimitives = {};
    StageMorph.prototype.inPaletteBlocks = {};
    StageMorph.prototype.codeMappings = {};
    StageMorph.prototype.codeHeaders = {};
    StageMorph.prototype.enableCodeMapping = false;
    if (Process.prototype.isCatchingErrors) {
        try {
            model = this.serializer.parse(str);
            this.serializer.loadMediaModel(model.childNamed('media'));
            this.serializer.openProject(
                this.serializer.loadProjectModel(model.childNamed('project')),
                this
            );
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        model = this.serializer.parse(str);
        this.serializer.loadMediaModel(model.childNamed('media'));
        this.serializer.openProject(
            this.serializer.loadProjectModel(model.childNamed('project')),
            this
        );
    }
    this.stopFastTracking();
};

IDE_Morph.prototype.openBlocksString = function (str, name, silently) {
    var msg,
        myself = this;
    this.nextSteps([
        function () {
            msg = myself.showMessage('Opening blocks...');
        },
        function () {
            myself.rawOpenBlocksString(str, name, silently);
        },
        function () {
            msg.destroy();
        }
    ]);
};

IDE_Morph.prototype.rawOpenBlocksString = function (str, name, silently) {
    // name is optional (string), so is silently (bool)
    var blocks,
        myself = this;
    if (Process.prototype.isCatchingErrors) {
        try {
            blocks = this.serializer.loadBlocks(str, myself.stage);
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        blocks = this.serializer.loadBlocks(str, myself.stage);
    }
    if (silently) {
        blocks.forEach(function (def) {
            def.receiver = myself.stage;
            myself.stage.globalBlocks.push(def);
            myself.stage.replaceDoubleDefinitionsFor(def);
        });
        this.flushPaletteCache();
        this.refreshPalette();
        this.showMessage(
                'Imported Blocks Module' + (name ? ': ' + name : '') + '.',
            2
        );
    } else {
        new BlockImportDialogMorph(blocks, this.stage, name).popUp();
    }
};

IDE_Morph.prototype.openSpritesString = function (str) {
    var msg,
        myself = this;
    this.nextSteps([
        function () {
            msg = myself.showMessage('Opening sprite...');
        },
        function () {
            myself.rawOpenSpritesString(str);
        },
        function () {
            msg.destroy();
        }
    ]);
};

IDE_Morph.prototype.rawOpenSpritesString = function (str) {
    if (Process.prototype.isCatchingErrors) {
        try {
            this.serializer.loadSprites(str, this);
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        this.serializer.loadSprites(str, this);
    }
};

IDE_Morph.prototype.openMediaString = function (str) {
    if (Process.prototype.isCatchingErrors) {
        try {
            this.serializer.loadMedia(str);
        } catch (err) {
            this.showMessage('Load failed: ' + err);
        }
    } else {
        this.serializer.loadMedia(str);
    }
    this.showMessage('Imported Media Module.', 2);
};

IDE_Morph.prototype.openProject = function (name) {
    var str;
    if (name) {
        this.setProjectName(name);
        str = localStorage['-snap-project-' + name];
        this.openProjectString(str);
        //location.hash = '#open:' + str;
    }
    if (this.instructions != null) {
        this.corralBar.tabBar.tabTo('instructions');
    }
};

IDE_Morph.prototype.switchToUserMode = function () {
    var world = this.world();

    world.isDevMode = false;
    Process.prototype.isCatchingErrors = true;
    this.controlBar.updateLabel();
    this.isAutoFill = true;
    this.isDraggable = false;
    this.reactToWorldResize(world.bounds.copy());
    this.siblings().forEach(function (morph) {
        if (morph instanceof DialogBoxMorph) {
            world.add(morph); // bring to front
        } else {
            morph.destroy();
        }
    });
    this.flushBlocksCache();
    this.refreshPalette();
    // prevent non-DialogBoxMorphs from being dropped
    // onto the World in user-mode
    world.reactToDropOf = function (morph) {
        if (!(morph instanceof DialogBoxMorph)) {
            world.hand.grab(morph);
        }
    };
    this.showMessage('entering user mode', 1);

};

IDE_Morph.prototype.switchToDevMode = function () {
    var world = this.world();

    world.isDevMode = true;
    Process.prototype.isCatchingErrors = false;
    this.controlBar.updateLabel();
    this.isAutoFill = false;
    this.isDraggable = true;
    this.setExtent(world.extent().subtract(100));
    this.setPosition(world.position().add(20));
    this.flushBlocksCache();
    this.refreshPalette();
    // enable non-DialogBoxMorphs to be dropped
    // onto the World in dev-mode
    delete world.reactToDropOf;
    this.showMessage(
            'entering development mode.\n\n'
            + 'error catching is turned off,\n'
            + 'use the browser\'s web console\n'
            + 'to see error messages.'
    );
};

IDE_Morph.prototype.flushBlocksCache = function (category) {
    // if no category is specified, the whole cache gets flushed
    if (category) {
        this.stage.blocksCache[category] = null;
        this.stage.children.forEach(function (m) {
            if (m instanceof SpriteMorph) {
                m.blocksCache[category] = null;
            }
        });
    } else {
        this.stage.blocksCache = {};
        this.stage.children.forEach(function (m) {
            if (m instanceof SpriteMorph) {
                m.blocksCache = {};
            }
        });
    }
    this.flushPaletteCache(category);
};

IDE_Morph.prototype.flushPaletteCache = function (category) {
    // if no category is specified, the whole cache gets flushed
    if (category) {
        this.stage.paletteCache[category] = null;
        this.stage.children.forEach(function (m) {
            if (m instanceof SpriteMorph) {
                m.paletteCache[category] = null;
            }
        });
    } else {
        this.stage.paletteCache = {};
        this.stage.children.forEach(function (m) {
            if (m instanceof SpriteMorph) {
                m.paletteCache = {};
            }
        });
    }
};

IDE_Morph.prototype.toggleDynamicInputLabels = function () {
    var projectData;
    SyntaxElementMorph.prototype.dynamicInputLabels = !SyntaxElementMorph.prototype.dynamicInputLabels;
    if (Process.prototype.isCatchingErrors) {
        try {
            projectData = this.serializer.serialize(this.stage);
        } catch (err) {
            this.showMessage('Serialization failed: ' + err);
        }
    } else {
        projectData = this.serializer.serialize(this.stage);
    }
    SpriteMorph.prototype.initBlocks();
    this.spriteBar.tabBar.tabTo('scripts');
    this.createCategories();
    this.createCorralBar();
    this.openProjectString(projectData);
};

IDE_Morph.prototype.toggleBlurredShadows = function () {
    window.useBlurredShadows = !useBlurredShadows;
};

IDE_Morph.prototype.toggleLongFormInputDialog = function () {
    InputSlotDialogMorph.prototype.isLaunchingExpanded = !InputSlotDialogMorph.prototype.isLaunchingExpanded;
    if (InputSlotDialogMorph.prototype.isLaunchingExpanded) {
        this.saveSetting('longform', true);
    } else {
        this.removeSetting('longform');
    }
};

IDE_Morph.prototype.toggleSpriteImporting = function () {
    this.importableSprites = !this.importableSprites;
    this.createCorralBar();
    this.fixLayout();
};

IDE_Morph.prototype.toggleHasHatThumbnails = function () {
    this.hasHatThumbnails = !this.hasHatThumbnails;
    this.lastEventsHat.mouseClickLeft();
};

IDE_Morph.prototype.togglePlainPrototypeLabels = function () {
    BlockLabelPlaceHolderMorph.prototype.plainLabel = !BlockLabelPlaceHolderMorph.prototype.plainLabel;
    if (BlockLabelPlaceHolderMorph.prototype.plainLabel) {
        this.saveSetting('plainprototype', true);
    } else {
        this.removeSetting('plainprototype');
    }
};

IDE_Morph.prototype.togglePreferEmptySlotDrops = function () {
    ScriptsMorph.prototype.isPreferringEmptySlots = !ScriptsMorph.prototype.isPreferringEmptySlots;
};

IDE_Morph.prototype.toggleVirtualKeyboard = function () {
    MorphicPreferences.useVirtualKeyboard = !MorphicPreferences.useVirtualKeyboard;
};

IDE_Morph.prototype.toggleInputSliders = function () {
    MorphicPreferences.useSliderForInput = !MorphicPreferences.useSliderForInput;
};

IDE_Morph.prototype.toggleSliderExecute = function () {
    InputSlotMorph.prototype.executeOnSliderEdit = !InputSlotMorph.prototype.executeOnSliderEdit;
};

IDE_Morph.prototype.toggleGridLines = function () {
    var myself = this;
    this.hasGrid = !this.hasGrid;

    if(this.hasGrid){
        //Import Grid Line Sprite and send it to front
        var file = "toggleGrid.png",
            name = "toggleGrid",
            url = IDE_Morph.prototype.root_path + file,
            img = new Image(),
            selectedSprite = this.currentSprite;

       //myself.addNewSprite(name);


        //myself.createCorral();
        //myself.fixLayout();

        img.onload = function () {
            var canvas = newCanvas(new Point(img.width, img.height));
            canvas.getContext('2d').drawImage(img, 0, 0);
            var grid = new SpriteMorph(this.globalVariables);
            grid.name = 'toggleGrid';
            var cos = new Costume(canvas);
            grid.isDraggable = false;
            grid.contextMenu = null;
            grid.addCostume(cos);
            grid.isInert = true;
            myself.sprites.add(grid);
            grid.parent = myself.stage;
            grid.wearCostume(cos);
            myself.stage.add(grid);
            myself.selectSprite(grid);
            myself.selectSprite(selectedSprite);
            selectedSprite.comeToFront();
        };
        IDE_Morph.prototype.setImageSrc(img, url);
        this.controlBar.gridLinesButton.hint = 'Remove Grid Lines';
        this.updateLog({action: 'buttonClick', button: 'toggleGridLines', toState: 'on'});
    }
    else {
        //Get the index of the sprite with name 'toggleGrid'
        var gridIndex = arrayObjectIndexOf(this.sprites.contents, "toggleGrid", "name");
        if(gridIndex != -1) {
            this.removeSprite(myself.sprites.contents[gridIndex]);
        }
        this.controlBar.gridLinesButton.hint = 'Add Grid Lines';
        this.updateLog({action: 'buttonClick', button: 'toggleGridLines', toState: 'off'});
    }
};

//returns the index in the array where the search term matches the object property
function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
};

IDE_Morph.prototype.toggleAppMode = function (appMode) {
    var world = this.world(),
        elements = [
            this.logo,
            this.controlBar.projectButton,
            this.controlBar.settingsButton,
            this.controlBar.stageSizeButton,
            this.corral,
            this.corralBar,
            this.spriteEditor,
            this.spriteBar,
            this.palette,
            this.categories
        ],
        myself = this;

    this.isAppMode = isNil(appMode) ? !this.isAppMode : appMode;
    this.updateLog({action:'buttonClick', button:'toggleAppMode', toState:((myself.isAppMode) ? 'on' : 'off')});

    Morph.prototype.trackChanges = false;
    if (this.isAppMode) {
        this.setColor(this.appModeColor);
        this.controlBar.setColor(this.color);
        this.controlBar.appModeButton.refresh();
        elements.forEach(function (e) {
            if (typeof(e) != 'undefined') {
                e.hide();
            }
        });
        world.children.forEach(function (morph) {
            if (morph instanceof DialogBoxMorph) {
                morph.hide();
            }
        });
    } else {
        this.setColor(this.backgroundColor);
        this.controlBar.setColor(this.frameColor);
        elements.forEach(function (e) {
            if(e) {
                e.show();
            }
        });
        this.stage.setScale(1);
        // show all hidden dialogs
        world.children.forEach(function (morph) {
            if (morph instanceof DialogBoxMorph) {
                morph.show();
            }
        });
        // prevent scrollbars from showing when morph appears
        world.allChildren().filter(function (c) {
            return c instanceof ScrollFrameMorph;
        }).forEach(function (s) {
            s.adjustScrollBars();
        });
    }
    if (this.isAppMode) //if changing to fullscreen, destroy corral
    {
        this.controlBar.appModeButton.hint = 'Normal Screen';
        this.corral.destroy();
    }
    else //if changing to normal screen, create corral
    {
        this.controlBar.appModeButton.hint = 'Full Screen';
        this.createCorral();
    }
    this.setExtent(this.world().extent()); // resume trackChanges
};

IDE_Morph.prototype.toggleStageSize = function (isSmall) {
    var myself = this,
        world = this.world();

    function zoomIn() {
        myself.stageRatio = 1;
        myself.step = function () {
            myself.stageRatio -= (myself.stageRatio - 0.5) / 2;
            myself.setExtent(world.extent());
            if (myself.stageRatio < 0.6) {
                myself.isSmallStage = true;
                myself.stageRatio = 0.5;
                myself.setExtent(world.extent());
                myself.controlBar.stageSizeButton.refresh();
                delete myself.step;
            }
        };
        myself.updateLog({action:'buttonClick', button:'toggleStageSize', toState:'small'});
    }

    function zoomOut() {
        myself.isSmallStage = true;
        myself.stageRatio = 0.5;
        myself.step = function () {
            myself.stageRatio += (1 - myself.stageRatio) / 2;
            myself.setExtent(world.extent());
            if (myself.stageRatio > 0.9) {
                myself.isSmallStage = false;
                myself.setExtent(world.extent());
                myself.controlBar.stageSizeButton.refresh();
                delete myself.step;
            }
        };
        myself.updateLog({action:'buttonClick', button:'toggleStageSize', toState:'normal'});

    }

    this.isSmallStage = isNil(isSmall) ? !this.isSmallStage : isSmall;
    var instructionsDiv = document.getElementById('instructionsDiv');
    var resultsDiv = document.getElementById('results');
    if (instructionsDiv != null) {
        if (this.isSmallStage) {
            this.controlBar.stageSizeButton.hint = 'Normal Stage';
            instructionsDiv.style.width = "10%";
            instructionsDiv.style.height = "400px";
            if (resultsDiv != null) {
                resultsDiv.style.right = "300px";
            }
        }
        else {
            this.controlBar.stageSizeButton.hint = 'Small Stage';
            instructionsDiv.style.width = "420px";
            instructionsDiv.style.height = "300px";
            if (resultsDiv != null) {
                resultsDiv.style.right = "530px";
            }
        }
    }
    myself.createCorralBar();

    if (this.isAnimating) {
        if (this.isSmallStage) {
            zoomIn();
        } else {
            zoomOut();
        }
    } else {
        if (this.isSmallStage) {
            this.stageRatio = 0.5;
        }
        this.setExtent(world.extent());
    }
};

IDE_Morph.prototype.openProjectsBrowser = function () {

    new ProjectDialogMorph(this, 'open').popUp();
};

IDE_Morph.prototype.saveProjectsBrowser = function () {
    if (this.source === 'examples') {
        this.source = 'local'; // cannot save to examples
    }
    new ProjectDialogMorph(this, 'save').popUp();
};

IDE_Morph.prototype.setFileName = function (string) {
    if (string != '' && typeof string != 'undefined') {
        this.projectName = string;
        this.controlBar.updateLabel();

        if (this.source === 'examples') {
            this.source = 'local'; // cannot save to examples
        }
        if (this.projectName) {
            if (this.source === 'local') { // as well as 'examples'
                this.saveProject(this.projectName);
            } else if (this.projectId) { // 'cloud'
                this.saveProjectToCloud(this.projectName);
            } else {
                this.saveProjectsBrowser();
            }
        } else {
            this.saveProjectsBrowser();
        }
    }
};

IDE_Morph.prototype.fileRename = function () {
    var myself = this;
    new DialogBoxMorph(
        myself,
        myself.setFileName,
        myself
    ).prompt(
        "Set File Name",
        myself.projectName,
        world
    );
};

// IDE_Morph localization

IDE_Morph.prototype.languageMenu = function () {
    var menu = new MenuMorph(this),
        world = this.world(),
        pos = this.controlBar.settingsButton.bottomLeft(),
        myself = this;
    SnapTranslator.languages().forEach(function (lang) {
        menu.addItem(
                (SnapTranslator.language === lang ? '\u2713 ' : '    ') +
                SnapTranslator.languageName(lang),
            function () {
                myself.setLanguage(lang);
            }
        );
    });
    menu.popup(world, pos);
};

IDE_Morph.prototype.setLanguage = function (lang, callback) {
    var translation = document.getElementById('language'),
        src = 'lang-' + lang + '.js',
        myself = this;
    SnapTranslator.unload();
    if (translation) {
        document.head.removeChild(translation);
    }
    if (lang === 'en') {
        return this.reflectLanguage('en', callback);
    }
    translation = document.createElement('script');
    translation.id = 'language';
    translation.onload = function () {
        myself.reflectLanguage(lang, callback);
    };
    document.head.appendChild(translation);
    translation.src = src;
};

IDE_Morph.prototype.reflectLanguage = function (lang, callback) {
    var projectData;
    SnapTranslator.language = lang;
    if (!this.loadNewProject) {
        if (Process.prototype.isCatchingErrors) {
            try {
                projectData = this.serializer.serialize(this.stage);
            } catch (err) {
                this.showMessage('Serialization failed: ' + err);
            }
        } else {
            projectData = this.serializer.serialize(this.stage);
        }
    }
    SpriteMorph.prototype.initBlocks();
    this.spriteBar.tabBar.tabTo('scripts');
    this.createCategories();
    this.createCorralBar();
    this.fixLayout();
    if (this.loadNewProject) {
        this.newProject();
    } else {
        this.openProjectString(projectData);
    }
    this.saveSetting('language', lang);
    if (callback) {
        callback.call(this);
    }
};

// IDE_Morph blocks scaling

IDE_Morph.prototype.userSetBlocksScale = function () {
    var myself = this,
        scrpt,
        blck,
        shield,
        sample,
        action;

    scrpt = new CommandBlockMorph();
    scrpt.color = SpriteMorph.prototype.blockColor.motion;
    scrpt.setSpec(localize('build'));
    blck = new CommandBlockMorph();
    blck.color = SpriteMorph.prototype.blockColor.sound;
    blck.setSpec(localize('your own'));
    scrpt.nextBlock(blck);
    blck = new CommandBlockMorph();
    blck.color = SpriteMorph.prototype.blockColor.operators;
    blck.setSpec(localize('blocks'));
    scrpt.bottomBlock().nextBlock(blck);
    /*
     blck = SpriteMorph.prototype.blockForSelector('doForever');
     blck.inputs()[0].nestedBlock(scrpt);
     */

    sample = new FrameMorph();
    sample.acceptsDrops = false;
    sample.texture = this.scriptsPaneTexture;
    sample.setExtent(new Point(250, 180));
    scrpt.setPosition(sample.position().add(10));
    sample.add(scrpt);

    shield = new Morph();
    shield.alpha = 0;
    shield.setExtent(sample.extent());
    shield.setPosition(sample.position());
    sample.add(shield);

    action = function (num) {
        /*
         var c;
         blck.setScale(num);
         blck.drawNew();
         blck.setSpec(blck.blockSpec);
         c = blck.inputs()[0];
         c.setScale(num);
         c.nestedBlock(scrpt);
         */
        scrpt.blockSequence().forEach(function (block) {
            block.setScale(num);
            block.drawNew();
            block.setSpec(block.blockSpec);
        });
    };

    new DialogBoxMorph(
        null,
        function (num) {
            myself.setBlocksScale(num);
        }
    ).withKey('zoomBlocks').prompt(
        'Zoom blocks',
        SyntaxElementMorph.prototype.scale.toString(),
        this.world(),
        sample, // pic
        {
            'normal (1x)': 1,
            'demo (1.2x)': 1.2,
            'presentation (1.4x)': 1.4,
            'big (2x)': 2
            /*'huge (4x)' : 4,
             'giant (8x)' : 8,
             'monstrous (10x)' : 10*/
        },
        false, // read only?
        true, // numeric
        1, // slider min
        2, // slider max
        action // slider action
    );
};

IDE_Morph.prototype.setBlocksScale = function (num) {
    var projectData;
    if (Process.prototype.isCatchingErrors) {
        try {
            projectData = this.serializer.serialize(this.stage);
        } catch (err) {
            this.showMessage('Serialization failed: ' + err);
        }
    } else {
        projectData = this.serializer.serialize(this.stage);
    }
    SyntaxElementMorph.prototype.setScale(num);
    CommentMorph.prototype.refreshScale();
    SpriteMorph.prototype.initBlocks();
    this.spriteBar.tabBar.tabTo('scripts');
    this.createCategories();
    this.createCorralBar();
    this.fixLayout();
    this.openProjectString(projectData);
    this.saveSetting('zoom', num);
};

// IDE_Morph stage size manipulation

IDE_Morph.prototype.userSetStageSize = function () {
    new DialogBoxMorph(
        this,
        this.setStageExtent,
        this
    ).promptVector(
        "Stage size",
        StageMorph.prototype.dimensions,
        new Point(480, 360),
        'Stage width',
        'Stage height',
        this.world(),
        null, // pic
        null // msg
    );
};

IDE_Morph.prototype.setStageExtent = function (aPoint) {
    var myself = this,
        world = this.world(),
        ext = aPoint.max(new Point(480, 180));

    function zoom() {
        myself.step = function () {
            var delta = ext.subtract(
                StageMorph.prototype.dimensions
            ).divideBy(2);
            if (delta.abs().lt(new Point(5, 5))) {
                StageMorph.prototype.dimensions = ext;
                delete myself.step;
            } else {
                StageMorph.prototype.dimensions =
                    StageMorph.prototype.dimensions.add(delta);
            }
            myself.stage.setExtent(StageMorph.prototype.dimensions);
            myself.stage.clearPenTrails();
            myself.fixLayout();
            this.setExtent(world.extent());
        };
    }

    this.stageRatio = 1;
    this.isSmallStage = false;
    this.controlBar.stageSizeButton.refresh();
    this.setExtent(world.extent());
    if (this.isAnimating) {
        zoom();
    } else {
        StageMorph.prototype.dimensions = ext;
        this.stage.setExtent(StageMorph.prototype.dimensions);
        this.stage.clearPenTrails();
        this.fixLayout();
        this.setExtent(world.extent());
    }
};

// IDE_Morph cloud interface

IDE_Morph.prototype.initializeCloud = function () {
    var myself = this,
        world = this.world();
    new DialogBoxMorph(
        null,
        function (user) {
            var pwh = hex_sha512(user.password),
                str;
            SnapCloud.login(
                user.username,
                pwh,
                function () {
                    if (user.choice) {
                        str = SnapCloud.encodeDict(
                            {
                                username: user.username,
                                password: pwh
                            }
                        );
                        localStorage['-snap-user'] = str;
                    }
                    myself.source = 'cloud';
                    myself.showMessage('now connected.', 2);
                },
                myself.cloudError()
            );
        }
    ).withKey('cloudlogin').promptCredentials(
        'Sign in',
        'login',
        null,
        null,
        null,
        null,
        'stay signed in on this computer\nuntil logging out',
        world,
        myself.cloudIcon(),
        myself.cloudMsg
    );
};


IDE_Morph.prototype.saveProjectToCloud = function (name) {
    var myself = this;
    if (name) {
        this.showMessage('Saving project\nto the cloud...');
        this.setProjectName(name);
        SnapCloud.saveProject(
            this,
            function (data) {
                myself.showMessage('saved.', 2);

                //wipes the log after a successful save
                myself.unsavedChanges = false;
                myself.log.data = [];
                myself.log.parentHash = myself.logHash;
                myself.log.logHash = generateUUID();
            },
            this.cloudError()
        );
    }
};

IDE_Morph.prototype.exportProjectMedia = function (name) {
    var menu, media;
    this.serializer.isCollectingMedia = true;
    if (name) {
        this.setProjectName(name);
        if (Process.prototype.isCatchingErrors) {
            try {
                menu = this.showMessage('Exporting');
                encodeURIComponent(
                    this.serializer.serialize(this.stage)
                );
                media = this.serializer.mediaXML(name);
                var blob = new Blob([media], {type: 'Application/xml'});
                saveAs(blob, name + '.xml');
                menu.destroy();
                this.showMessage('Exported!', 1);
            } catch (err) {
                this.serializer.isCollectingMedia = false;
                this.showMessage('Export failed: ' + err);
            }
        } else {
            menu = this.showMessage('Exporting');
            encodeURIComponent(
                this.serializer.serialize(this.stage)
            );
            media = this.serializer.mediaXML(name);
            var blob = new Blob([media], { type: 'Application/xml' });
            saveAs(blob, 'Untitled' + '.xml');
            menu.destroy();
            this.showMessage('Exported!', 1);
        }
    }
    this.serializer.isCollectingMedia = false;
    this.serializer.flushMedia();
    // this.hasChangedMedia = false;
};

IDE_Morph.prototype.exportProjectNoMedia = function (name) {
    var menu, str;
    this.serializer.isCollectingMedia = true;
    if (name) {
        this.setProjectName(name);
        if (Process.prototype.isCatchingErrors) {
            try {
                menu = this.showMessage('Exporting');
                str = this.serializer.serialize(this.stage);
                var blob = new Blob([str], {type: 'Application/xml'});
                saveAs(blob, name + '.xml');
                menu.destroy();
                this.showMessage('Exported!', 1);
            } catch (err) {
                this.serializer.isCollectingMedia = false;
                this.showMessage('Export failed: ' + err);
            }
        } else {
            menu = this.showMessage('Exporting');
            str = this.serializer.serialize(this.stage);
            var blob = new Blob([str], { type: 'Application/xml' });
            saveAs(blob, 'Untitled' + '.xml');
            menu.destroy();
            this.showMessage('Exported!', 1);
        }
    }
    this.serializer.isCollectingMedia = false;
    this.serializer.flushMedia();
};

IDE_Morph.prototype.exportProjectAsCloudData = function (name) {
    var menu, str, media, dta;
    this.serializer.isCollectingMedia = true;
    if (name) {
        this.setProjectName(name);
        if (Process.prototype.isCatchingErrors) {
            try {
                menu = this.showMessage('Exporting');
                str = this.serializer.serialize(this.stage);
                media = this.serializer.mediaXML(name);
                dta = '<snapdata>'
                    + str
                    + media
                    + '</snapdata>';
                var blob = new Blob([dta], { type: 'Application/xml' });
                saveAs(blob, name + '.xml');
                menu.destroy();
                this.showMessage('Exported!', 1);
            } catch (err) {
                this.serializer.isCollectingMedia = false;
                this.showMessage('Export failed: ' + err);
            }
        } else {
            menu = this.showMessage('Exporting');
            str = this.serializer.serialize(this.stage);
            media = this.serializer.mediaXML(name);
            dta = '<snapdata>'
                + str
                + media
                + '</snapdata>';
            var blob = new Blob([dta], { type: 'Application/xml' });
            saveAs(blob, 'Untitled' + '.xml');
            menu.destroy();
            this.showMessage('Exported!', 1);
        }
    }
    this.serializer.isCollectingMedia = false;
    this.serializer.flushMedia();
    // this.hasChangedMedia = false;
};

IDE_Morph.prototype.cloudAcknowledge = function () {
    var myself = this;
    return function (responseText, url) {
        nop(responseText);
        new DialogBoxMorph().inform(
            'Cloud Connection',
                'Successfully connected to:\n'
                + 'http://'
                + url,
            myself.world(),
            myself.cloudIcon(null, new Color(0, 180, 0))
        );
    };
};

IDE_Morph.prototype.cloudResponse = function () {
    var myself = this;
    return function (responseText, url) {
        var response = responseText;
        if (response.length > 50) {
            response = response.substring(0, 50) + '...';
        }
        new DialogBoxMorph().inform(
            'Snap!Cloud',
                'http://'
                + url + ':\n\n'
                + 'responds:\n'
                + response,
            myself.world(),
            myself.cloudIcon(null, new Color(0, 180, 0))
        );
    };
};

IDE_Morph.prototype.cloudError = function () {
    var myself = this;

    function getURL(url) {
        try {
            var request = new XMLHttpRequest();
            request.open('GET', url, false);
            request.send();
            if (request.status === 200) {
                return request.responseText;
            }
            return null;
        } catch (err) {
            return null;
        }
    }

    return function (responseText, url) {
        // first, try to find out an explanation for the error
        // and notify the user about it,
        // if none is found, show an error dialog box
        var response = responseText,
            explanation = getURL('http://snap.berkeley.edu/cloudmsg.txt');
        if (myself.shield) {
            myself.shield.destroy();
            myself.shield = null;
        }
        if (explanation) {
            myself.showMessage(explanation);
            return;
        }
        if (response.length > 50) {
            response = response.substring(0, 50) + '...';
        }
        new DialogBoxMorph().inform(
            'Snap!Cloud',
                (url ? url + '\n' : '')
                + response,
            myself.world(),
            myself.cloudIcon(null, new Color(180, 0, 0))
        );
    };
};

IDE_Morph.prototype.cloudIcon = function (height, color) {
    var clr = color || DialogBoxMorph.prototype.titleBarColor,
        isFlat = MorphicPreferences.isFlat,
        icon = new SymbolMorph(
            isFlat ? 'cloud' : 'cloudGradient',
                height || 50,
            clr,
            isFlat ? null : new Point(-1, -1),
            clr.darker(50)
        );
    if (!isFlat) {
        icon.addShadow(new Point(1, 1), 1, clr.lighter(95));
    }
    return icon;
};

IDE_Morph.prototype.setCloudURL = function () {
    new DialogBoxMorph(
        null,
        function (url) {
            SnapCloud.url = url;
        }
    ).withKey('cloudURL').prompt(
        'Cloud URL',
        SnapCloud.url,
        this.world(),
        null,
        {
            'Snap!Cloud': 'https://snapcloud.miosoft.com/miocon/app/' +
                'login?_app=SnapCloud',
            'local network lab': '192.168.2.107:8087/miocon/app/login?_app=SnapCloud',
            'local network office': '192.168.186.146:8087/miocon/app/login?_app=SnapCloud',
            'localhost dev': 'localhost/miocon/app/login?_app=SnapCloud'
        }
    );
};

// IDE_Morph synchronous Http data fetching

IDE_Morph.prototype.getURL = function (url) {
    var request = new XMLHttpRequest(),
        myself = this;
    try {
        request.open('GET', IDE_Morph.prototype.root_path + url, false);
        request.send();
        if (request.status === 200) {
            return request.responseText;
        }
        throw new Error('unable to retrieve ' + url);
    } catch (err) {
        myself.showMessage(err);
        return;
    }
};

// IDE_Morph user dialog shortcuts

IDE_Morph.prototype.showMessage = function (message, secs) {
    var m = new MenuMorph(null, message),
        intervalHandle;
    m.popUpCenteredInWorld(this.world());
    if (secs) {
        intervalHandle = setInterval(function () {
            m.destroy();
            clearInterval(intervalHandle);
        }, secs * 1000);
    }
    return m;
};

IDE_Morph.prototype.inform = function (title, message) {
    new DialogBoxMorph().inform(
        title,
        localize(message),
        this.world()
    );
};

IDE_Morph.prototype.confirm = function (message, title, action) {
    new DialogBoxMorph(null, action).askYesNo(
        title,
        localize(message),
        this.world()
    );
};

IDE_Morph.prototype.prompt = function (message, callback, choices, key) {
    (new DialogBoxMorph(null, callback)).withKey(key).prompt(
        message,
        '',
        this.world(),
        null,
        choices
    );
};

/*
 // SelectDialogMorph ////////////////////////////////////////////////////

 // SelectDialogMorph inherits from ProjectDialogMorph:

 SelectDialogMorph.prototype = new ProjectDialogMorph();
 SelectDialogMorph.prototype.constructor = SelectDialogMorph;
 SelectDialogMorph.uber = ProjectDialogMorph.prototype;

 // SelectDialogMorph instance creation:

 function SelectDialogMorph(ide, label) {
 this.init(ide, label);
 }

 SelectDialogMorph.prototype.init = function (ide, label) {

 ProjectDialogMorph.uber.init.call( ide, label );

 this.labelString = this.task === 'costumes' ? 'Select Costume' : 'Select Sound';
 this.createLabel();
 }
 */

// ProjectDialogMorph ////////////////////////////////////////////////////

// ProjectDialogMorph inherits from DialogBoxMorph:

ProjectDialogMorph.prototype = new DialogBoxMorph();
ProjectDialogMorph.prototype.constructor = ProjectDialogMorph;
ProjectDialogMorph.uber = DialogBoxMorph.prototype;

// ProjectDialogMorph instance creation:

function ProjectDialogMorph(ide, label) {
    this.init(ide, label);
}

ProjectDialogMorph.prototype.init = function (ide, task) {
    var myself = this;

    // additional properties:
    this.ide = ide;
    this.task = task || 'open'; // String describing what do do (open, save, costumes, sounds)
    this.source = ide.source || 'local'; // or 'cloud' or 'examples'
    this.projectList = []; // [{name: , thumb: , notes:}]

    this.handle = null;
    this.srcBar = null;
    this.nameField = null;
    this.listField = null;
    this.preview = null;
    this.notesText = null;
    this.notesField = null;
    this.deleteButton = null;
    this.shareButton = null;
    this.unshareButton = null;

    // initialize inherited properties:
    ProjectDialogMorph.uber.init.call(
        this,
        this, // target
        null, // function
        null // environment
    );

    // override inherited properites:
    switch (this.task) {
        case 'save':
            this.labelString = 'Save Project';
            break;
        case 'open':
            this.labelString = 'Open Project';
            break;
        case 'costumes':
            this.labelString = 'Select a Costume';
            break;
        case 'sprites':
            this.labelString = 'Select a Sprite';
            break;
        case 'backgrounds':
            this.labelString = 'Select a Background';
            break;
        case 'sounds':
            this.labelString = 'Select a Sound';
            break;
        default:
            break;
    }
    this.createLabel();
    this.key = 'project' + task;

    // build contents
    this.buildContents();
    this.onNextStep = function () { // yield to show "updating" message
        if (this.task == 'save' || this.task == 'open') {
            myself.setSource(myself.source);
        }
        else if (this.task == 'costumes' || this.task == 'sprites') { //initialize to 1st button
            myself.setSource('people');
        }
        else if (this.task == 'backgrounds') { //initialize to 1st button
            myself.setSource('indoors');
        }
        else { //sounds
            myself.setSource('sounds');
        }
    };
};

ProjectDialogMorph.prototype.buildContents = function () {
    var thumbnail, notification;

    this.addBody(new Morph());
    this.body.color = this.color;

    this.srcBar = new AlignmentMorph('column', this.padding / 2);

    if (this.ide.cloudMsg) {
        notification = new TextMorph(
            this.ide.cloudMsg,
            10,
            null, // style
            false, // bold
            null, // italic
            null, // alignment
            null, // width
            null, // font name
            new Point(1, 1), // shadow offset
            new Color(255, 255, 255) // shadowColor
        );
        notification.refresh = nop;
        this.srcBar.add(notification);
    }

    if (this.task == 'open' || this.task == 'save') {

        this.addSourceButton('cloud', localize('Cloud'), 'cloud');
        this.addSourceButton('local', localize('Browser'), 'storage');
        if (this.task === 'open') {
            this.addSourceButton('examples', localize('Examples'), 'poster');
        }
    }
    else if (this.task == 'costumes' || this.task == 'sprites') {
        this.addSourceButton('people', localize('People'), 'person');
        this.addSourceButton('animals', localize('Animals'), 'cat');
        this.addSourceButton('fantasy', localize('Fantasy'), 'stars');
        this.addSourceButton('transportation', localize('Transportation'), 'steeringWheel');
    }
    else if (this.task == 'backgrounds') {
        this.addSourceButton('indoors', localize('Indoors'), 'lamp');
        this.addSourceButton('outdoors', localize('Outdoors'), 'landscape');
        this.addSourceButton('other', localize('Other'), 'treasureChest');
    }
    else if (this.task == 'sounds') {
        this.addSourceButton('sounds', localize('Sounds'), 'note');
    }
    this.srcBar.fixLayout();
    this.body.add(this.srcBar);

    if (this.task === 'save') {
        this.nameField = new InputFieldMorph(this.ide.projectName);
        this.body.add(this.nameField);
    }

    this.listField = new ListMorph([]);
    this.fixListFieldItemColors();
    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.drawNew = InputFieldMorph.prototype.drawNew;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.body.add(this.listField);

    this.preview = new Morph();
    this.preview.fixLayout = nop;
    this.preview.edge = InputFieldMorph.prototype.edge;
    this.preview.fontSize = InputFieldMorph.prototype.fontSize;
    this.preview.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.preview.contrast = InputFieldMorph.prototype.contrast;
    this.preview.drawNew = function () {
        InputFieldMorph.prototype.drawNew.call(this);
        if (this.texture) {
            this.drawTexture(this.texture);
        }
    };
    this.preview.drawCachedTexture = function () {
        var context = this.image.getContext('2d');
        context.drawImage(this.cachedTexture, this.edge, this.edge);
        this.changed();
    };
    this.preview.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;
    this.preview.setExtent(this.ide.serializer.thumbnailSize.add(this.preview.edge * 2));


    this.body.add(this.preview);
    this.preview.drawNew();
    if (this.task === 'save') {
        thumbnail = this.ide.stage.thumbnail(
            SnapSerializer.prototype.thumbnailSize
        );
        this.preview.texture = null;
        this.preview.cachedTexture = thumbnail;
        this.preview.drawCachedTexture();
    }

    if (this.task != 'costumes' && this.task != 'sprites' && this.task != 'backgrounds') {
        this.notesField = new ScrollFrameMorph();
        this.notesField.fixLayout = nop;

        this.notesField.edge = InputFieldMorph.prototype.edge;
        this.notesField.fontSize = InputFieldMorph.prototype.fontSize;
        this.notesField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
        this.notesField.contrast = InputFieldMorph.prototype.contrast;
        this.notesField.drawNew = InputFieldMorph.prototype.drawNew;
        this.notesField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

        this.notesField.acceptsDrops = false;
        this.notesField.contents.acceptsDrops = false;

        if (this.task === 'open') {
            this.notesText = new TextMorph('');
        } else { // 'save'
            this.notesText = new TextMorph(this.ide.projectNotes);
            this.notesText.isEditable = true;
            this.notesText.enableSelecting();
        }

        this.notesField.isTextLineWrapping = true;
        this.notesField.padding = 3;
        this.notesField.setContents(this.notesText);
        this.notesField.setWidth(this.preview.width());

        this.body.add(this.notesField);
    }

    if (this.task === 'open') {
        this.addButton('openProject', 'Open');
        this.action = 'openProject';
    } else if (this.task == 'save') {
        this.addButton('saveProject', 'Save');
        this.action = 'saveProject';
    }
    else if (this.task == 'costumes') {
        this.addButton('importCostume', 'OK');
        this.action = 'importCostume';
    }
    else if (this.task == 'sprites') {
        this.addButton('importSprite', 'OK');
        this.action = 'importSprite';
    }
    else if (this.task == 'backgrounds') {
        this.addButton('importCostume', 'OK');
        this.action = 'importCostume';
    }
    else if (this.task == 'sounds') {
        this.addButton('importSound', 'OK');
        this.action = 'importSound';
        this.addButton('previewSound', 'Preview');
    }
    this.shareButton = this.addButton('shareProject', 'Share');
    this.unshareButton = this.addButton('unshareProject', 'Unshare');
    this.shareButton.hide();
    this.unshareButton.hide();
    this.deleteButton = this.addButton('deleteProject', 'Delete');
    this.addButton(
        function() {
            this.cancel();
            this.ide.updateLog({action:'cancelWindow', window: ((this.task == 'open' || this.task == 'save') ?
                this.task + 'Project' : this.task + 'Library')});
        },
        'Cancel');

    if (notification) {
        this.setExtent(new Point(455, 335).add(notification.extent()));
    } else {
        this.setExtent(new Point(455, 335));
    }
    this.fixLayout();

};

ProjectDialogMorph.prototype.popUp = function (wrrld) {
    var world = wrrld || this.ide.world();
    if (world) {
        ProjectDialogMorph.uber.popUp.call(this, world);
        this.handle = new HandleMorph(
            this,
            350,
            300,
            this.corner,
            this.corner
        );
    }
};

// ProjectDialogMorph source buttons

ProjectDialogMorph.prototype.addSourceButton = function (source, label, symbol) {
    var myself = this,
        lbl1 = new StringMorph(
            label,
            10,
            null,
            true,
            null,
            null,
            new Point(1, 1),
            new Color(255, 255, 255)
        ),
        lbl2 = new StringMorph(
            label,
            10,
            null,
            true,
            null,
            null,
            new Point(-1, -1),
            this.titleBarColor.darker(50),
            new Color(255, 255, 255)
        ),
        l1 = new Morph(),
        l2 = new Morph(),
        button;

    lbl1.add(new SymbolMorph(
        symbol,
        24,
        this.titleBarColor.darker(20),
        new Point(1, 1),
        this.titleBarColor.darker(50)
    ));
    lbl1.children[0].setCenter(lbl1.center());
    lbl1.children[0].setBottom(lbl1.top() - this.padding / 2);

    l1.image = lbl1.fullImage();
    l1.bounds = lbl1.fullBounds();

    lbl2.add(new SymbolMorph(
        symbol,
        24,
        new Color(255, 255, 255),
        new Point(-1, -1),
        this.titleBarColor.darker(50)
    ));
    lbl2.children[0].setCenter(lbl2.center());
    lbl2.children[0].setBottom(lbl2.top() - this.padding / 2);

    l2.image = lbl2.fullImage();
    l2.bounds = lbl2.fullBounds();

    button = new ToggleButtonMorph(
        null, //colors,
        myself, // the ProjectDialog is the target
        function () { // action
            myself.setSource(source);
        },
        [l1, l2],
        function () {  // query
            return myself.source === source;
        }
    );

    button.corner = this.buttonCorner;
    button.edge = this.buttonEdge;
    button.outline = this.buttonOutline;
    button.outlineColor = this.buttonOutlineColor;
    button.outlineGradient = this.buttonOutlineGradient;
    button.labelMinExtent = new Point(60, 0);
    button.padding = this.buttonPadding;
    button.contrast = this.buttonContrast;
    button.pressColor = this.titleBarColor.darker(20);

    button.drawNew();
    button.fixLayout();
    button.refresh();
    this.srcBar.add(button);
};

// ProjectDialogMorph list field control

ProjectDialogMorph.prototype.fixListFieldItemColors = function () {
    // remember to always fixLayout() afterwards for the changes
    // to take effect
    var myself = this;
    this.listField.contents.children[0].alpha = 0;
    this.listField.contents.children[0].children.forEach(function (item) {
        item.pressColor = myself.titleBarColor.darker(20);
        item.color = new Color(0, 0, 0, 0);
        item.noticesTransparentClick = true;
    });
};

/**
 * Convert an image
 * to a base64 string
 * @param  {String}   url
 * @param  {Function} callback
 * @param  {String}   [outputFormat=image/png]
 */
ProjectDialogMorph.prototype.convertImgToBase64 = function (url, callback) {
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image,
        myself = this;

    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        var dataURL;

        canvas.height = img.height;
        canvas.width = img.width;
        if (myself.task == 'backgrounds') {
            ctx.drawImage(img, 0, 0, 160, 120);
        }
        else {
            ctx.drawImage(img, 0, 0);
        }
        dataURL = canvas.toDataURL();
        callback.call(this, dataURL);
        canvas = null;
    };
    img.src = url;
};

ProjectDialogMorph.prototype.setCostumeList = function (category) {
    var finalCostumeList = [],
        path = this.task == 'backgrounds' ? 'Backgrounds' : 'Costumes',
        tempList = IDE_Morph.prototype.getCostumesList(path);

    tempList.forEach(function (item) {
        if (item.category == category) {
            n = {
                name: item.name,
                file: item.file
            };
            finalCostumeList.push(n);
        }
    });
    this.projectList = finalCostumeList;
};

ProjectDialogMorph.prototype.setSource = function (source) {
    var myself = this,
        msg,
        path;

    this.source = source; //this.task === 'save' ? 'local' : source;
    this.srcBar.children.forEach(function (button) {
        button.refresh();
    });

    switch (this.source) {
        //Costumes & Sprites
        case 'people':
            this.setCostumeList(this.source);
            path = 'Costumes/';
            break;
        case 'animals':
            this.setCostumeList(this.source);
            path = 'Costumes/';
            break;
        case 'fantasy':
            this.setCostumeList(this.source);
            path = 'Costumes/';
            break;
        case 'transportation':
            this.setCostumeList(this.source);
            path = 'Costumes/';
            break;
        //Sounds
        case 'sounds':
            this.projectList = IDE_Morph.prototype.getCostumesList('Sounds');
            break;
        //Backgrounds
        case 'indoors':
            this.setCostumeList(this.source);
            this.listField.selected = this.projectList[0];
            path = 'Backgrounds/';
            break;
        case 'outdoors':
            this.setCostumeList(this.source);
            path = 'Backgrounds/';
            break;
        case 'other':
            this.setCostumeList(this.source);
            path = 'Backgrounds/';
            break;
        //File Loading & Saving
        case 'cloud':
            msg = myself.ide.showMessage('Updating\nproject list...');
            this.projectList = [];
            SnapCloud.getProjectList(
                function (projectList) {
                    myself.installCloudProjectList(projectList);
                    msg.destroy();
                },
                function (err, lbl) {
                    msg.destroy();
                    myself.ide.cloudError().call(null, err, lbl);
                }
            );
            return;
        case 'examples':
            this.projectList = this.getExamplesProjectList();
            break;
        case 'local':
            this.projectList = this.getLocalProjectList();
            break;
        default:
            break;
    }

    this.listField.destroy();
    this.listField = new ListMorph(
        this.projectList,
            this.projectList.length > 0 ?
            function (element) {
                return element.name;
            } : null,
        null,
        function () {
            myself.ok();
        }
    );

    this.fixListFieldItemColors();
    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.drawNew = InputFieldMorph.prototype.drawNew;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    if (this.source === 'local') {
        this.listField.action = function (item) {
            var src, xml;

            if (item === undefined) {
                return;
            }
            if (myself.nameField) {
                myself.nameField.setContents(item.name || '');
            }
            if (myself.task === 'open') {

                src = localStorage['-snap-project-' + item.name];
                xml = myself.ide.serializer.parse(src);

                myself.notesText.text = xml.childNamed('notes').contents
                    || '';
                myself.notesText.drawNew();
                myself.notesField.contents.adjustBounds();
                myself.preview.texture = xml.childNamed('thumbnail').contents
                    || null;
                myself.preview.cachedTexture = null;
                myself.preview.drawNew();
            }
            myself.edit();
        };
    } else if (this.source == 'examples') { // 'examples', 'cloud' is initialized elsewhere
        this.listField.action = function (item) {
            var src, xml;
            if (item === undefined) {
                return;
            }
            if (myself.nameField) {
                myself.nameField.setContents(item.name || '');
            }
            src = myself.ide.getURL(
                    'http://snap.berkeley.edu/snapsource/Examples/' +
                    item.name + '.xml'
            );

            xml = myself.ide.serializer.parse(src);
            myself.notesText.text = xml.childNamed('notes').contents
                || '';
            myself.notesText.drawNew();
            myself.notesField.contents.adjustBounds();
            myself.preview.texture = xml.childNamed('thumbnail').contents
                || null;
            myself.preview.cachedTexture = null;
            myself.preview.drawNew();
            myself.edit();
        };
    } else if (this.source != 'cloud' && this.source != 'sounds') //every other case
    {
        this.listField.action = function (item) {
            if (item === undefined) {
                return;
            }

            myself.convertImgToBase64(IDE_Morph.prototype.root_path + path + item.file,
                function (base64Img) {
                    myself.preview.texture = base64Img || null;
                    myself.preview.cachedTexture = null;
                    myself.preview.drawNew();
                }
            );
        };
    }

    this.body.add(this.listField);
    this.shareButton.hide();
    this.unshareButton.hide();
    if (this.source === 'local') {
        this.deleteButton.show();
    } else { // examples
        this.deleteButton.hide();
    }
    this.buttons.fixLayout();
    this.fixLayout();
    if (this.task === 'open') {
        this.clearDetails();
    }

    //Sets the preview texture to the 1st item in the list
    var firstItem = this.listField.listContents.children[0];
    this.listField.select(firstItem.action, this.listField.listContents);
    //Sets the selected item in the list to the 1st item
    firstItem.image = firstItem.pressImage;
};

ProjectDialogMorph.prototype.getLocalProjectList = function () {
    var stored, name, dta,
        projects = [];
    for (stored in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, stored)
            && stored.substr(0, 14) === '-snap-project-') {
            name = stored.substr(14);
            dta = {
                name: name,
                thumb: null,
                notes: null
            };
            projects.push(dta);
        }
    }
    projects.sort(function (x, y) {
        return x.name < y.name ? -1 : 1;
    });
    return projects;
};

ProjectDialogMorph.prototype.getExamplesProjectList = function () {
    var dir,
        projects = [];

    dir = this.ide.getURL('http://snap.berkeley.edu/snapsource/Examples/');
    dir.split('\n').forEach(
        function (line) {
            var startIdx = line.search(new RegExp('href=".*xml"')),
                endIdx,
                name,
                dta;
            if (startIdx > 0) {
                endIdx = line.search(new RegExp('.xml'));
                name = line.substring(startIdx + 6, endIdx);
                dta = {
                    name: name,
                    thumb: null,
                    notes: null
                };
                projects.push(dta);
            }
        }
    );
    projects.sort(function (x, y) {
        return x.name < y.name ? -1 : 1;
    });
    return projects;
};

ProjectDialogMorph.prototype.installCloudProjectList = function (pl) {
    var myself = this;
    this.projectList = pl || [];
    this.projectList.sort(function (x, y) {
        return x.ProjectName < y.ProjectName ? -1 : 1;
    });

    this.listField.destroy();
    this.listField = new ListMorph(
        this.projectList,
            this.projectList.length > 0 ?
            Cloud.getDisplayName
            : null,
        [ // format: display shared project names bold
            [
                'bold',
                function (proj) {
                    return proj.Public === 'true';
                }
            ]
        ],
        function () {
            myself.ok();
        }
    );
    this.fixListFieldItemColors();
    this.listField.fixLayout = nop;
    this.listField.edge = InputFieldMorph.prototype.edge;
    this.listField.fontSize = InputFieldMorph.prototype.fontSize;
    this.listField.typeInPadding = InputFieldMorph.prototype.typeInPadding;
    this.listField.contrast = InputFieldMorph.prototype.contrast;
    this.listField.drawNew = InputFieldMorph.prototype.drawNew;
    this.listField.drawRectBorder = InputFieldMorph.prototype.drawRectBorder;

    this.listField.action = function (item) {
        if (item === undefined) {
            return;
        }
        if (myself.nameField) {
            myself.nameField.setContents(item.ProjectName || '');
        }
        if (myself.task === 'open') {
            myself.notesText.text = item.Notes || '';
            myself.notesText.drawNew();
            myself.notesField.contents.adjustBounds();
            myself.preview.texture = item.Thumbnail || null;
            myself.preview.cachedTexture = null;
            myself.preview.drawNew();
        }
        if (myself.task === 'save') {

        }
        if (item.Public === 'true') {
            myself.shareButton.hide();
            myself.unshareButton.show();
        } else {
            myself.unshareButton.hide();
            myself.shareButton.show();
        }
        myself.buttons.fixLayout();
        myself.fixLayout();
        myself.edit();
    };
    this.body.add(this.listField);
    this.shareButton.show();
    this.unshareButton.hide();
    this.deleteButton.show();
    this.buttons.fixLayout();
    this.fixLayout();
    if (this.task === 'open') {
        this.clearDetails();
    }
};

ProjectDialogMorph.prototype.clearDetails = function () {
    this.notesText.text = '';
    this.notesText.drawNew();
    this.notesField.contents.adjustBounds();
    this.preview.texture = null;
    this.preview.cachedTexture = null;
    this.preview.drawNew();
};

ProjectDialogMorph.prototype.openProject = function () {
    var proj = this.listField.selected,
        src;
    if (!proj) {
        return;
    }
    this.ide.source = this.source;
    if (this.source === 'cloud') {
        this.openCloudProject(proj);
    } else if (this.source === 'examples') {
        src = this.ide.getURL(
                'http://snap.berkeley.edu/snapsource/Examples/' +
                proj.name + '.xml'
        );
        this.ide.openProjectString(src);
        this.destroy();
    } else { // 'local'
        this.ide.openProject(proj.name);
        this.destroy();
    }
};

ProjectDialogMorph.prototype.openCloudProject = function (project) {
    var myself = this;
    myself.ide.nextSteps([
        function () {
            myself.ide.showMessage('Fetching project\nfrom octopi-cloud...');
        },
        function () {
            myself.rawOpenCloudProject(project);
        }
    ]);
};

ProjectDialogMorph.prototype.rawOpenCloudProject = function (proj) {
    var myself = this;
    SnapCloud.rawOpenProject(proj, myself.ide, function () {
        myself.pushState(proj.file_id);
    });
    this.destroy();
};

ProjectDialogMorph.prototype.importCostume = function () {
    var file = this.listField.selected.file,
        name = this.listField.selected.name,
        ide = this.parent.children[0],
        path = this.task == 'backgrounds' ? 'Backgrounds' : 'Costumes',
        url = IDE_Morph.prototype.root_path + path + '/' + file,
        img = new Image();

    img.onload = function () {
        var canvas = newCanvas(new Point(img.width, img.height));
        canvas.getContext('2d').drawImage(img, 0, 0);
        ide.droppedImage(canvas, file, 'costume', 'library');
    };
    IDE_Morph.prototype.setImageSrc(img, url);

    this.destroy();
};

ProjectDialogMorph.prototype.importSprite = function () {
    var file = this.listField.selected.file,
        name = this.listField.selected.name,
        ide = this.parent.children[0],
        url = IDE_Morph.prototype.root_path + 'Costumes/' + file,
        img = new Image();

    ide.addNewSprite(name);
    img.onload = function () {
        var canvas = newCanvas(new Point(img.width, img.height));
        canvas.getContext('2d').drawImage(img, 0, 0);
        ide.droppedImage(canvas, file, 'sprite', 'library');
    };
    IDE_Morph.prototype.setImageSrc(img, url);
    this.destroy();
};

ProjectDialogMorph.prototype.importSound = function () {
    var file = this.listField.selected.file,
        ide = this.parent.children[0],
        url = IDE_Morph.prototype.root_path + 'Sounds/' + file,
        audio = new Audio();

    IDE_Morph.prototype.setAudioSrc(audio, url);
    audio.load();
    ide.droppedAudio(audio, file);
    this.destroy();
    ide.updateLog({action:'soundImport', method: 'library', file: file,
        spriteID: ide.currentSprite.devName ? ide.currentSprite.devName : ide.currentSprite.name});
};

ProjectDialogMorph.prototype.previewSound = function () {
    var file = this.listField.selected.file,
     ide = this.parent.children[0],
     url = IDE_Morph.prototype.root_path + 'Sounds/' + file,
     audio = new Audio();
    IDE_Morph.prototype.setAudioSrc(audio, url);
    audio.load();
    audio.play();
}

ProjectDialogMorph.prototype.saveProject = function () {
    var name = this.nameField.contents().text.text,
        file_id = null,
        notes = this.notesText.text,
        myself = this;

    if (file_id === null && this.nameField.contents().hasBeenEdited) {
        file_id = '';
    }
    if (file_id === null && this.listField.selected) {
        file_id = this.listField.selected.file_id;
    }

    this.ide.projectNotes = notes || this.ide.projectNotes;
    if (name) {
        if (this.source === 'cloud') {
            if (detect(
                this.projectList,
                function (item) {
                    return item.file_id === file_id;
                }
            )) {
                this.ide.confirm(
                        localize(
                            'Are you sure you want to replace'
                        ) + '\n"' + name + " (" + file_id + ')"?',
                    'Replace Project',
                    function () {
                        myself.ide.hasChangedMedia = true;
                        myself.ide.setProjectName(name);
                        myself.ide.setProjectId(file_id);
                        myself.saveCloudProject();
                    }
                );
            } else {
                myself.ide.hasChangedMedia = true;
                this.ide.setProjectName(name);
                myself.ide.setProjectId(file_id);
                myself.saveCloudProject();
            }
        } else { // 'local'
            if (detect(
                this.projectList,
                function (item) {
                    return item.name === name;
                }
            )) {
                this.ide.confirm(
                        localize(
                            'Are you sure you want to replace'
                        ) + '\n"' + name + '"?',
                    'Replace Project',
                    function () {
                        myself.ide.setProjectName(name);
                        myself.ide.source = 'local';
                        myself.ide.saveProject(name);
                        myself.destroy();
                    }
                );
            } else {
                this.ide.setProjectName(name);
                myself.ide.source = 'local';
                this.ide.saveProject(name);
                this.destroy();
            }
        }
    }
};

ProjectDialogMorph.prototype.pushState = function (fileID) {
    window.history.pushState('', '', this.ide.pushStateBase + fileID);
};

ProjectDialogMorph.prototype.saveCloudProject = function () {
    var myself = this;
    this.ide.showMessage('Saving project\nto the cloud...');
    SnapCloud.saveProject(
        this.ide,
        function (response, url) {
            myself.ide.source = 'cloud';
            myself.ide.showMessage('saved.', 2);
            if (typeof response != 'undefined' && typeof response.file_id != 'undefined') {
                myself.pushState(response.file_id);
            }
        },
        this.ide.cloudError()
    );
    this.destroy();
};

ProjectDialogMorph.prototype.deleteProject = function () {
    var myself = this,
        proj,
        idx,
        name;

    if (this.source === 'cloud') {
        proj = this.listField.selected;
        SnapCloud.deleteProject(proj, myself)
    } else { // 'local, examples'
        if (this.listField.selected) {
            name = this.listField.selected.name;
            this.ide.confirm(
                    localize(
                        'Are you sure you want to delete'
                    ) + '\n"' + name + '"?',
                'Delete Project',
                function () {
                    delete localStorage['-snap-project-' + name];
                    myself.setSource(myself.source); // refresh list
                }
            );
        }
    }
};

ProjectDialogMorph.prototype.shareProject = function () {
    var myself = this,
        proj = this.listField.selected,
        entry = this.listField.active;
    SnapCloud.shareProject(proj, myself, entry);
};

ProjectDialogMorph.prototype.unshareProject = function () {
    var myself = this,
        proj = this.listField.selected,
        entry = this.listField.active;
    SnapCloud.unshareProject(proj, myself, entry);
};

ProjectDialogMorph.prototype.edit = function () {
    if (this.nameField) {
        this.nameField.edit();
    }
};

// ProjectDialogMorph layout

ProjectDialogMorph.prototype.fixLayout = function () {
    var th = fontHeight(this.titleFontSize) + this.titlePadding * 2,
        thin = this.padding / 2,
        oldFlag = Morph.prototype.trackChanges;

    Morph.prototype.trackChanges = false;

    if (this.buttons && (this.buttons.children.length > 0)) {
        this.buttons.fixLayout();
    }

    if (this.body) {
        this.body.setPosition(this.position().add(new Point(
            this.padding,
                th + this.padding
        )));
        this.body.setExtent(new Point(
                this.width() - this.padding * 2,
                this.height() - this.padding * 3 - th - this.buttons.height()
        ));
        this.srcBar.setPosition(this.body.position());
        if (this.nameField) {
            this.nameField.setWidth(
                    this.body.width() - this.srcBar.width() - this.padding * 6
            );
            this.nameField.setLeft(this.srcBar.right() + this.padding * 3);
            this.nameField.setTop(this.srcBar.top());
            this.nameField.drawNew();
        }

        this.listField.setLeft(this.srcBar.right() + this.padding);
        this.listField.setWidth(
                this.body.width()
                - this.srcBar.width()
                - this.preview.width()
                - this.padding
                - thin
        );
        this.listField.contents.children[0].adjustWidths();

        if (this.nameField) {
            this.listField.setTop(this.nameField.bottom() + this.padding);
            this.listField.setHeight(
                    this.body.height() - this.nameField.height() - this.padding
            );
        } else {
            this.listField.setTop(this.body.top());
            this.listField.setHeight(this.body.height());
        }

        this.preview.setRight(this.body.right());
        if (this.nameField) {
            this.preview.setTop(this.nameField.bottom() + this.padding);
        } else {
            this.preview.setTop(this.body.top());
        }
        if (this.task != 'costumes' && this.task != 'sprites' && this.task != 'backgrounds') {
            this.notesField.setTop(this.preview.bottom() + thin);
            this.notesField.setLeft(this.preview.left());
            this.notesField.setHeight(
                    this.body.bottom() - this.preview.bottom() - thin
            );
        }
        else if (this.task != 'backgrounds') {
            this.preview.setHeight(this.body.bottom() - this.body.top());
        }
    }

    if (this.label) {
        this.label.setCenter(this.center());
        this.label.setTop(this.top() + (th - this.label.height()) / 2);
    }

    if (this.buttons && (this.buttons.children.length > 0)) {
        this.buttons.setCenter(this.center());
        this.buttons.setBottom(this.bottom() - this.padding);
    }

    Morph.prototype.trackChanges = oldFlag;
    this.changed();
};

// SpriteIconMorph ////////////////////////////////////////////////////

/*
 I am a selectable element in the Sprite corral, keeping a self-updating
 thumbnail of the sprite I'm respresenting, and a self-updating label
 of the sprite's name (in case it is changed elsewhere)
 */

// SpriteIconMorph inherits from ToggleButtonMorph (Widgets)

SpriteIconMorph.prototype = new ToggleButtonMorph();
SpriteIconMorph.prototype.constructor = SpriteIconMorph;
SpriteIconMorph.uber = ToggleButtonMorph.prototype;

// SpriteIconMorph settings

SpriteIconMorph.prototype.thumbSize = new Point(40, 40);
SpriteIconMorph.prototype.labelShadowOffset = null;
SpriteIconMorph.prototype.labelShadowColor = null;
SpriteIconMorph.prototype.labelColor = new Color(255, 255, 255);
SpriteIconMorph.prototype.fontSize = 9;

// SpriteIconMorph instance creation:

function SpriteIconMorph(aSprite, aTemplate) {
    this.init(aSprite, aTemplate);
}

SpriteIconMorph.prototype.init = function (aSprite, aTemplate) {
    var colors, action, query, myself = this;

    if (!aTemplate) {
        colors = [
            IDE_Morph.prototype.groupColor,
            IDE_Morph.prototype.frameColor,
            IDE_Morph.prototype.frameColor
        ];

    }

    action = function () {
        // make my sprite the current one
        var ide = myself.parentThatIsA(IDE_Morph),
            lastSprite = ide.currentSprite;

        if (ide) {
            ide.selectSprite(myself.object);
            if(lastSprite != ide.currentSprite)
            {
                ide.updateLog({action: 'spriteSelect',
                    spriteID: ide.currentSprite.devName ? ide.currentSprite.devName : ide.currentSprite.name});
            }
        }
    };

    query = function () {
        // answer true if my sprite is the current one
        var ide = myself.parentThatIsA(IDE_Morph);

        if (ide) {
            return ide.currentSprite === myself.object;
        }
        return false;
    };

    // additional properties:
    this.object = aSprite || new SpriteMorph(); // mandatory, actually
    this.version = this.object.version;
    this.thumbnail = null;
    this.rotationButton = null; // synchronous rotation of nested sprites

    // initialize inherited properties:
    SpriteIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        this.object.name, // label string
        query, // predicate/selector
        null, // environment
        null, // hint
        aTemplate // optional, for cached background images
    );

    // override defaults and build additional components
    this.isDraggable = true;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
    this.fps = 1;

};

SpriteIconMorph.prototype.createThumbnail = function () {
    if (this.thumbnail) {
        this.thumbnail.destroy();
    }

    this.thumbnail = new Morph();
    this.thumbnail.setExtent(this.thumbSize);
    if (this.object instanceof SpriteMorph) { // support nested sprites
        this.thumbnail.image = this.object.fullThumbnail(this.thumbSize);
        this.createRotationButton();
    } else {
        this.thumbnail.image = this.object.thumbnail(this.thumbSize);
    }
    if (this.object.isLocked) {
        ctx = this.thumbnail.image.getContext('2d');
        var x = this.center().x + 20;
        var y = this.center().y + 25;
        ctx.fillStyle = "#FFE600"
        ctx.scale(.5, .5);
        ctx.fillRect(x, y, 20, 20);
        ctx.beginPath();
        ctx.arc(x + 10, y, 10, Math.PI, 0);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + 10, y, 7, Math.PI, 0);
        ctx.fillStyle = "#000000"
        ctx.fill();
    }
    this.add(this.thumbnail);
};

SpriteIconMorph.prototype.createLabel = function () {
    var txt, displayName;
    if ((this.object instanceof SpriteMorph) || this.object instanceof StageMorph) {
        displayName = this.object.name;
    }
    else {
        displayName = this.object.name;
    }
    if (this.label) {
        this.label.destroy();
    }
    txt = new StringMorph(
        displayName,
        this.fontSize,
        this.fontStyle,
        true,
        false,
        false,
        this.labelShadowOffset,
        this.labelShadowColor,
        this.labelColor
    );

    this.label = new FrameMorph();
    this.label.acceptsDrops = false;
    this.label.alpha = 0;
    this.label.setExtent(txt.extent());
    txt.setPosition(this.label.position());
    this.label.add(txt);
    this.add(this.label);
};

SpriteIconMorph.prototype.createRotationButton = function () {
    var myself = this,
        sprite = myself.object.devName ? myself.object.devName : myself.object.name,
        ide = myself.object.parentThatIsA(IDE_Morph),
        logObj = {},
        anchor, button, rotate;


    if (this.rotationButton) {
        this.rotationButton.destroy();
        this.rotationButton = null;
    }
    if (!this.object.anchor) {
        return;
    }
    else {
        anchor = myself.object.anchor.devName ? myself.object.anchor.devName : myself.object.anchor.name;
    }

    var setHint = function () { // dynamically change hint when toggled
        if (!button) {
            if (!myself.object.rotatesWithAnchor) {
                rotate = sprite + ' doesn\'t rotate';
            }
            else {
                rotate = sprite + ' rotates';
            }
        }
        else {
            if (!myself.object.rotatesWithAnchor) {
                button.hint = sprite + ' doesn\'t rotate';
                logObj = {action: 'spriteLink', linkedSpriteID: sprite,
                    anchorSpriteID: anchor, change: button.hint};
            }
            else {
                button.hint = sprite + ' rotates';
                logObj = {action: 'spriteLink', linkedSpriteID: sprite,
                    anchorSpriteID: anchor, change: button.hint};
            }
            ide.updateLog(logObj);
            ide.unsavedChanges = true;
        }
    };
    setHint(); // set hint 'rotate' for creation

    button = new ToggleButtonMorph(
        null, // colors
        null, // target
        function () {
            myself.object.rotatesWithAnchor = !myself.object.rotatesWithAnchor;
            setHint(); // toggle hint when button pressed
        },
        [
            '\u2192',
            '\u21BB'
        ],
        function () {  // query
            return myself.object.rotatesWithAnchor;
        },
        null, // environment
        rotate // hint on creation
    );

    button.corner = 8;
    button.labelMinExtent = new Point(11, 11);
    button.padding = 0;
    button.pressColor = button.color;
    button.drawNew();
    button.fixLayout();
    button.refresh();
    button.changed();
    this.rotationButton = button;
    this.add(this.rotationButton);
};

// SpriteIconMorph stepping

SpriteIconMorph.prototype.step = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    if (this.version !== this.object.version) {
        //this.createThumbnail();
        //this.createLabel();
        //this.fixLayout();
        //this.version = this.object.version;
        //this.refresh();
        if (!ide.demoMode) {
            ide.createCorral();
            ide.fixLayout();
            ide.corral.refresh();
        }

    }
};

// SpriteIconMorph layout

SpriteIconMorph.prototype.fixLayout = function () {
    if (!this.thumbnail || !this.label) {
        return null;
    }

    this.setWidth(
            this.thumbnail.width()
            + this.outline * 2
            + this.edge * 2
            + this.padding * 2
    );

    this.setHeight(
            this.thumbnail.height()
            + this.outline * 2
            + this.edge * 2
            + this.padding * 3
            + this.label.height()
    );

    this.thumbnail.setCenter(this.center());
    this.thumbnail.setTop(
            this.top() + this.outline + this.edge + this.padding
    );

    if (this.rotationButton) {
        this.rotationButton.setTop(this.top());
        this.rotationButton.setRight(this.right());
    }

    this.label.setWidth(
        Math.min(
            this.label.children[0].width(), // the actual text
            this.thumbnail.width()
        )
    );
    this.label.setCenter(this.center());
    this.label.setTop(
            this.thumbnail.bottom() + this.padding
    );
};

// SpriteIconMorph menu

SpriteIconMorph.prototype.userMenu = function () {
    var ide = this.parentThatIsA(IDE_Morph),
        logObj = {};

    if (this.object.isInert == true && !this.parentThatIsA(IDE_Morph).developer) {
        return null;
    }
    if (this.object.isLocked == true && !this.parentThatIsA(IDE_Morph).developer) {
        return null;
    }
    var menu = new MenuMorph(this),
        myself = this;
    if (this.object instanceof StageMorph) {
        menu.addItem(
            'pic...',
            function () {
                window.open(myself.object.fullImageClassic().toDataURL());
                logObj = {action: 'stageIconMenuClick', menuOption: 'pic...'};
                ide.updateLog(logObj);
            },
            'open a new window\nwith a picture of the stage'
        );
        return menu;
    }
    if (!(this.object instanceof SpriteMorph)) {
        return null;
    }
    //menu.addItem("show", 'showSpriteOnStage');
    if (this.parentThatIsA(IDE_Morph).developer) {
        if (this.object.isLocked == false) {
            menu.addItem("lock",
            function () {
                myself.object.lock();
                this.parentThatIsA(IDE_Morph).selectSprite(this.parentThatIsA(IDE_Morph).currentSprite);
            },
            'lock this sprite for student view');
        }
        else {
            menu.addItem("unlock",
            function () {
                myself.object.unlock();
                this.parentThatIsA(IDE_Morph).selectSprite(this.parentThatIsA(IDE_Morph).currentSprite);
            },
            'unlock this sprite for student view');
        }
        menu.addLine();
    }

    if (this.object.isResettable) {
        menu.addItem("restore",
            function () {
                this.restoreSprite();
                var name = this.object.devName ? this.object.devName : this.object.name;
                logObj = {action: 'spriteIconMenuClick', menuOption: 'restore',
                    spriteID: name};
                ide.updateLog(logObj);
                ide.unsavedChanges = true;
            },
            'recover the original script\nstate of this sprite');
    }
    menu.addItem("duplicate",
        function () {
            this.duplicateSprite();
            ide.updateLog({action: 'spriteIconMenuClick', menuOption: 'duplicate',
                spriteID: this.object.devName ? this.object.devName : this.object.name});
            ide.unsavedChanges = true;
        },
        'make a copy of this sprite');
    if ((this.object.devName == undefined) || this.object.parentThatIsA(IDE_Morph).developer) {
        menu.addItem("delete",
            function () {
                ide.updateLog({action: 'spriteIconMenuClick', menuOption: 'delete', name: this.object.name});
                this.removeSprite();
                ide.unsavedChanges = true;
            },
            'remove this sprite permanently');
    }
    menu.addLine();
    if (this.object.anchor) {
        var sprite = this.object.devName ? this.object.devName : this.object.name,
            anchor = this.object.anchor.devName ? this.object.anchor.devName : this.object.anchor.name;
        menu.addItem(
            localize('detach from') + ' ' + anchor,
            function () {
                myself.object.detachFromAnchor();
                logObj = {action: 'spriteLink', linkedSpriteID: sprite,
                    anchorSpriteID: anchor, change: 'detach'};
                ide.updateLog(logObj);
                ide.unsavedChanges = true;
            },
            'remove the link between\n'
                + this.object.name + ' and ' + anchor
        );
    }
    if (this.object.parts.length) {
        var parts = [];
        this.object.parts.forEach(function (part) {
            parts.push(part.name);
        });
        parts = parts.toString().replace(/,/g,", ");
        menu.addItem(
            'detach all parts',
            function () {
                myself.object.detachAllParts();
                logObj = {action: 'spriteLink', linkedSpriteIDs: parts,
                    anchorSpriteID: this.object.name, change: 'detachAll'};
                ide.updateLog(logObj);
                ide.unsavedChanges = true;
            },
            'remove\n' +
                parts + '\n' +
                'from ' + this.object.name

        );
    }
    menu.addItem("export...",
        function () {
            this.exportSprite();
            var name = this.object.devName ? this.object.devName : this.object.name;
            logObj = {action: 'spriteIconMenuClick', menuOption: 'export',
            spriteID: name};
            ide.updateLog(logObj);
        },
        'show sprite data as XML\nin a new browser window');

    return menu;
};

SpriteIconMorph.prototype.restoreSprite = function () {
    this.object.restore();
}

SpriteIconMorph.prototype.duplicateSprite = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    if (ide) {
        ide.duplicateSprite(this.object);
    }
};

SpriteIconMorph.prototype.removeSprite = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    if (ide) {
        this.object.remove();
    }
};

SpriteIconMorph.prototype.exportSprite = function () {
    this.object.exportSprite();
};

SpriteIconMorph.prototype.showSpriteOnStage = function () {
    this.object.showOnStage();
};

// SpriteIconMorph drawing

SpriteIconMorph.prototype.createBackgrounds = function () {
//    only draw the edges if I am selected
    var context,
        ext = this.extent();

    if (this.template) { // take the backgrounds images from the template
        this.image = this.template.image;
        this.normalImage = this.template.normalImage;
        this.highlightImage = this.template.highlightImage;
        this.pressImage = this.template.pressImage;
        return null;
    }

    this.normalImage = newCanvas(ext);
    context = this.normalImage.getContext('2d');
    this.drawBackground(context, this.color);

    this.highlightImage = newCanvas(ext);
    context = this.highlightImage.getContext('2d');
    this.drawBackground(context, this.highlightColor);

    this.pressImage = newCanvas(ext);
    context = this.pressImage.getContext('2d');
    this.drawOutline(context);
    this.drawBackground(context, this.pressColor);
    this.drawEdges(
        context,
        this.pressColor,
        this.pressColor.lighter(this.contrast),
        this.pressColor.darker(this.contrast)
    );

    this.image = this.normalImage;
};

// SpriteIconMorph drag & drop

SpriteIconMorph.prototype.prepareToBeGrabbed = function () {
    var ide = this.parentThatIsA(IDE_Morph),
        idx;
    this.mouseClickLeft(); // select me
    if (ide) {
        idx = ide.sprites.asArray().indexOf(this.object);
        ide.sprites.remove(idx + 1);
        ide.createCorral();
        ide.fixLayout();
    }
};

SpriteIconMorph.prototype.wantsDropOf = function (morph) {
    // allow scripts & media to be copied from one sprite to another
    // by drag & drop
    if (this.object.isLocked && !this.parentThatIsA(IDE_Morph).developer) {
        return null;
    }
    return morph instanceof BlockMorph
        || (morph instanceof CostumeIconMorph)
        || (morph instanceof SoundIconMorph);
};

SpriteIconMorph.prototype.reactToDropOf = function (morph, hand) {
    var ide = this.parentThatIsA(IDE_Morph),
        name = morph.parent.labelString,
        sprite = this.object,
        logObj = {};

    if (morph instanceof BlockMorph) {
        if (morph.isFrozen == false || ide.developer) {
            morph.isCopy = true; // toggle true for the non-original blocks
            this.copyStack(morph); // duplicate the block with isCopy marked true
            morph.justDuplicated = true; // flag instance of duplication
            var originID = morph.scriptID; // save old script ID
            ++sprite.scriptCount; // update script count of destination sprite
            this.scriptID = sprite.scriptCount; // assign duplicated script appropriate ID for new sprite

            logObj = {action: 'scriptChange', spriteID: name,
                originSpriteID: ide.currentSprite.devName ? ide.currentSprite.devName : ide.currentSprite.name,
                scriptID: morph.scriptID, originScriptID: originID, scriptContents: morph.scriptToString(),
                change: 'dragDuplicate'};
        }
    }
    else if (morph instanceof CostumeIconMorph) {
        this.copyCostume(morph.object);
        logObj = {action: 'spriteChange', spriteID: sprite.name, originSpriteID: ide.currentSprite.name,
            change: 'dragCostumeDuplicate'};
    }
    else if (morph instanceof SoundIconMorph) {
        this.copySound(morph.object);
        logObj = {action: 'spriteChange', spriteID: sprite.name, originSpriteID: ide.currentSprite.name,
            change: 'dragSoundDuplicate'};
    }
    ide.updateLog(logObj);
    ide.unsavedChanges = true;
    this.world().add(morph);
    morph.slideBackTo(hand.grabOrigin);
};

SpriteIconMorph.prototype.copyStack = function (block) {
    if (block.visibleScript == true) {
        var dup = block.fullCopy(),
            y = Math.max(this.object.scripts.children.map(function (stack) {
                return stack.fullBounds().bottom();
            }).concat([this.object.scripts.top()]));

        dup.setPosition(new Point(this.object.scripts.left() + 20, y + 20));
        this.object.scripts.add(dup);
        dup.allComments().forEach(function (comment) {
            comment.align(dup);
        });
        this.object.scripts.adjustBounds();
    }
    else {
        var dup = block.fullCopy(),
            y = Math.max(this.object.hiddenscripts.children.map(function (stack) {
                return stack.fullBounds().bottom();
            }).concat([this.object.hiddenscripts.top()]));

        dup.setPosition(new Point(this.object.hiddenscripts.left() + 20, y + 20));
        this.object.hiddenscripts.add(dup);
        dup.allComments().forEach(function (comment) {
            comment.align(dup);
        });
        this.object.hiddenscripts.adjustBounds();
    }

    // delete all custom blocks pointing to local definitions
    // under construction...
    dup.allChildren().forEach(function (morph) {
        if (morph.definition && !morph.definition.isGlobal) {
            morph.deleteBlock();
        }
    });
    if (dup.selector == 'receiveClick') {
        dup.setSpec('when ' + this.object.name + ' clicked');
    }
    if (dup.selector == ('receiveMessage')) {
        dup.setSpec('when ' + this.object.name + ' receives %msgHat');
    }
};

SpriteIconMorph.prototype.copyCostume = function (costume) {
    var dup = costume.copy();
    this.object.addCostume(dup);
    this.object.wearCostume(dup);
};

SpriteIconMorph.prototype.copySound = function (sound) {
    var dup = sound.copy();
    this.object.addSound(dup.audio, dup.name);
};

// CostumeIconMorph ////////////////////////////////////////////////////

/*
 I am a selectable element in the SpriteEditor's "Costumes" tab, keeping
 a self-updating thumbnail of the costume I'm representing and a
 self-updating label of the costume's name (in case it is changed
 elsewhere)
 */

// CostumeIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

CostumeIconMorph.prototype = new ToggleButtonMorph();
CostumeIconMorph.prototype.constructor = CostumeIconMorph;
CostumeIconMorph.uber = ToggleButtonMorph.prototype;

// CostumeIconMorph settings

CostumeIconMorph.prototype.thumbSize = new Point(80, 60);
CostumeIconMorph.prototype.labelShadowOffset = null;
CostumeIconMorph.prototype.labelShadowColor = null;
CostumeIconMorph.prototype.labelColor = new Color(255, 255, 255);
CostumeIconMorph.prototype.fontSize = 9;

// CostumeIconMorph instance creation:

function CostumeIconMorph(aCostume, aTemplate) {
    this.init(aCostume, aTemplate);
}

CostumeIconMorph.prototype.init = function (aCostume, aTemplate) {
    var colors, action, query, myself = this;

    if (!aTemplate) {
        colors = [
            IDE_Morph.prototype.groupColor.darker(15),
            PushButtonMorph.prototype.color,
            PushButtonMorph.prototype.color
        ];
    }

    action = function () {
        // make my costume the current one
        var ide = myself.parentThatIsA(IDE_Morph),
            wardrobe = myself.parentThatIsA(WardrobeMorph),
            lastCostume = ide.currentSprite.costume;

        if (ide) {
            ide.currentSprite.wearCostume(myself.object);
        }
        if (wardrobe) {
            wardrobe.updateSelection();
            wardrobe.updateList();
        }
        if (myself.object != lastCostume) {
            ide.updateLog({action: 'costumeSelect', name: ide.currentSprite.costume.name,
                spriteID: ide.currentSprite.devName ? ide.currentSprite.devName : ide.currentSprite.name});
        }
    };

    query = function () {
        // answer true if my costume is the current one
        var ide = myself.parentThatIsA(IDE_Morph);

        if (ide) {
            return ide.currentSprite.costume === myself.object;
        }
        return false;
    };

    // additional properties:
    this.object = aCostume || new Costume(); // mandatory, actually
    this.version = this.object.version;
    this.thumbnail = null;

    // initialize inherited properties:
    CostumeIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        this.object.name, // label string
        query, // predicate/selector
        null, // environment
        null, // hint
        aTemplate // optional, for cached background images
    );

    // override defaults and build additional components
    this.isDraggable = true;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
    this.fps = 1;
};

CostumeIconMorph.prototype.createThumbnail
    = SpriteIconMorph.prototype.createThumbnail;

CostumeIconMorph.prototype.createLabel
    = SpriteIconMorph.prototype.createLabel;

// CostumeIconMorph stepping

CostumeIconMorph.prototype.step
    = SpriteIconMorph.prototype.step;

// CostumeIconMorph layout

CostumeIconMorph.prototype.fixLayout
    = SpriteIconMorph.prototype.fixLayout;


// CostumeIconMorph menu

CostumeIconMorph.prototype.userMenu = function () {
    var menu = new MenuMorph(this);
    if (!(this.object instanceof Costume)) {
        return null;
    }
    if (this.object.status == true) {
        menu.addItem("edit", "editCostume");
        if (this.world().currentKey === 16) { // shift clicked
            menu.addItem(
                'edit rotation point only...',
                'editRotationPointOnly',
                null,
                new Color(100, 0, 0)
            );
        }
        menu.addItem("rename", "renameCostume");
        menu.addLine();
    }
    return menu;
};

CostumeIconMorph.prototype.editCostume = function () {
    var ide = this.parentThatIsA(IDE_Morph),
        myself = this;
    if (this.object instanceof SVG_Costume) {
        this.object.editRotationPointOnly(this.world());
    } else {
        this.object.edit(
            this.world(),
            this.parentThatIsA(IDE_Morph),
            undefined,
            function() {ide.updateLog({action:'cancelWindow', window: 'editCostume'});},
            function() {ide.updateLog({action:'costumeEdit', costumeID: myself.object.name});}
        );
    }
};

CostumeIconMorph.prototype.editRotationPointOnly = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    this.object.editRotationPointOnly(this.world());
    ide.hasChangedMedia = true;
};

CostumeIconMorph.prototype.renameCostume = function () {
    var costume = this.object,
        ide = this.parentThatIsA(IDE_Morph);
    new DialogBoxMorph(
        null,
        function (answer) {
            if (answer && (answer !== costume.name)) {
                ide.updateLog({action:'renameCostume', name: answer, originName: costume.name});
                costume.name = ide.currentSprite.getNextCostumeName(answer);
                costume.version = Date.now();
                ide.hasChangedMedia = true;
                ide.unsavedChanges = true;
                ide.createSpriteEditor();
                ide.fixLayout();
            }
        }
    ).prompt(
        'rename costume',
        costume.name,
        this.world()
    );

};

CostumeIconMorph.prototype.duplicateCostume = function () {
    var wardrobe = this.parentThatIsA(WardrobeMorph),
        ide = this.parentThatIsA(IDE_Morph),
        newcos = this.object.copy();
    newcos.name = ide.currentSprite.getNextCostumeName(this.object.name);
    //split = newcos.name.split(" ");
    //if (split[split.length - 1] === "copy") {
    //  newcos.name += " 2";
    //} else if (isNaN(split[split.length - 1])) {
    //  newcos.name = newcos.name + " copy";
    //} else {
    //  split[split.length - 1] = Number(split[split.length - 1]) + 1;
    //newcos.name = split.join(" ");
    //}

    wardrobe.sprite.addCostume(newcos);
    wardrobe.updateList();
    if (ide) {
        ide.currentSprite.wearCostume(newcos);
        ide.unsavedChanges = true;
    }
};

/* This function uses the fact that buttons only appear for the currently selected costume for an
 easy way to delete the costume. Since the delete button will only show up for the currently worn costume,
 the costume to delete will always be the costume that is worn. If the behavior of those buttons are changed,
 this function will need to be rewritten.
 */
CostumeIconMorph.prototype.removeCostume = function () {
    var wardrobe = this.parentThatIsA(WardrobeMorph),
        costumeIndex = wardrobe.sprite.getCostumeIdx(),
        costumes = (wardrobe.sprite.costumes.asArray()),
        ide = this.parentThatIsA(IDE_Morph);

    wardrobe.removeCostumeAt(costumeIndex);
    ide.unsavedChanges = true;

    // If the last costume is deleted, wear no costume (turtle arrow)
    if (costumes.length == 0) {
        wardrobe.sprite.wearCostume(null);
    }
    else {
        if (costumes[costumeIndex-1] != undefined) {
            wardrobe.sprite.wearCostume(costumes[costumeIndex - 1]);
        }
        else {
            wardrobe.sprite.wearCostume(costumes[costumeIndex - 2]);
        }
    }
    wardrobe.updateSelection();
    wardrobe.updateList();
};

CostumeIconMorph.prototype.exportCostume = function () {
    if (this.object instanceof SVG_Costume) {
        window.open(this.object.contents.src);
    } else { // rastered Costume
        window.open(this.object.contents.toDataURL());
    }
};

// CostumeIconMorph drawing

CostumeIconMorph.prototype.createBackgrounds
    = SpriteIconMorph.prototype.createBackgrounds;

// CostumeIconMorph drag & drop

CostumeIconMorph.prototype.prepareToBeGrabbed = function () {
    this.mouseClickLeft(); // select me
    this.removeCostume();
};

// TurtleIconMorph ////////////////////////////////////////////////////

/*
 I am a selectable element in the SpriteEditor's "Costumes" tab, keeping
 a thumbnail of the sprite's or stage's default "Turtle" costume.
 */

// TurtleIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

TurtleIconMorph.prototype = new ToggleButtonMorph();
TurtleIconMorph.prototype.constructor = TurtleIconMorph;
TurtleIconMorph.uber = ToggleButtonMorph.prototype;

// TurtleIconMorph settings

TurtleIconMorph.prototype.thumbSize = new Point(80, 60);
TurtleIconMorph.prototype.labelShadowOffset = null;
TurtleIconMorph.prototype.labelShadowColor = null;
TurtleIconMorph.prototype.labelColor = new Color(255, 255, 255);
TurtleIconMorph.prototype.fontSize = 9;

// TurtleIconMorph instance creation:

function TurtleIconMorph(aSpriteOrStage, aTemplate) {
    this.init(aSpriteOrStage, aTemplate);
}

TurtleIconMorph.prototype.init = function (aSpriteOrStage, aTemplate) {
    var colors, action, query, myself = this;

    if (!aTemplate) {
        colors = [
            IDE_Morph.prototype.groupColor,
            IDE_Morph.prototype.frameColor,
            IDE_Morph.prototype.frameColor
        ];

    }

    action = function () {
        // make my costume the current one
        var ide = myself.parentThatIsA(IDE_Morph),
            wardrobe = myself.parentThatIsA(WardrobeMorph);

        if (ide) {
            ide.currentSprite.wearCostume(null);
        }
        if (wardrobe) {
            wardrobe.updateSelection();
        }
    };

    query = function () {
        // answer true if my costume is the current one
        var ide = myself.parentThatIsA(IDE_Morph);

        if (ide) {
            return ide.currentSprite.costume === null;
        }
        return false;
    };

    // additional properties:
    this.object = aSpriteOrStage; // mandatory, actually
    this.version = this.object.version;
    this.thumbnail = null;

    // initialize inherited properties:
    TurtleIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        'default', // label string
        query, // predicate/selector
        null, // environment
        null, // hint
        aTemplate // optional, for cached background images
    );

    // override defaults and build additional components
    this.isDraggable = false;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
};

TurtleIconMorph.prototype.createThumbnail = function () {
    var isFlat = MorphicPreferences.isFlat;

    if (this.thumbnail) {
        this.thumbnail.destroy();
    }
    if (this.object instanceof SpriteMorph) {
        this.thumbnail = new SymbolMorph(
            'turtle',
            this.thumbSize.y,
            this.labelColor,
            isFlat ? null : new Point(-1, -1),
            new Color(0, 0, 0)
        );
    } else {
        this.thumbnail = new SymbolMorph(
            'stage',
            this.thumbSize.y,
            this.labelColor,
            isFlat ? null : new Point(-1, -1),
            new Color(0, 0, 0)
        );
    }
    this.add(this.thumbnail);
};

TurtleIconMorph.prototype.createLabel = function () {
    var txt;

    if (this.label) {
        this.label.destroy();
    }
    txt = new StringMorph(
        localize(
                this.object instanceof SpriteMorph ? 'Turtle' : 'Empty'
        ),
        this.fontSize,
        this.fontStyle,
        true,
        false,
        false,
        this.labelShadowOffset,
        this.labelShadowColor,
        this.labelColor
    );

    this.label = new FrameMorph();
    this.label.acceptsDrops = false;
    this.label.alpha = 0;
    this.label.setExtent(txt.extent());
    txt.setPosition(this.label.position());
    this.label.add(txt);
    this.add(this.label);
};

// TurtleIconMorph layout

TurtleIconMorph.prototype.fixLayout
    = SpriteIconMorph.prototype.fixLayout;

// TurtleIconMorph drawing

TurtleIconMorph.prototype.createBackgrounds
    = SpriteIconMorph.prototype.createBackgrounds;

// TurtleIconMorph user menu

TurtleIconMorph.prototype.userMenu = function () {
    var myself = this,
        menu = new MenuMorph(this, 'pen'),
        on = '\u25CF',
        off = '\u25CB';
    if (this.object instanceof StageMorph) {
        return null;
    }
    menu.addItem(
            (this.object.penPoint === 'tip' ? on : off) + ' ' + localize('tip'),
        function () {
            myself.object.penPoint = 'tip';
            myself.object.changed();
            myself.object.drawNew();
            myself.object.changed();
        }
    );
    menu.addItem(
            (this.object.penPoint === 'middle' ? on : off) + ' ' + localize(
            'middle'
        ),
        function () {
            myself.object.penPoint = 'middle';
            myself.object.changed();
            myself.object.drawNew();
            myself.object.changed();
        }
    );
    return menu;
};

// WardrobeMorph ///////////////////////////////////////////////////////

// I am a watcher on a sprite's costume list

// WardrobeMorph inherits from ScrollFrameMorph

WardrobeMorph.prototype = new ScrollFrameMorph();
WardrobeMorph.prototype.constructor = WardrobeMorph;
WardrobeMorph.uber = ScrollFrameMorph.prototype;

// WardrobeMorph settings

// ... to follow ...

// WardrobeMorph instance creation:

function WardrobeMorph(aSprite, sliderColor) {
    this.init(aSprite, sliderColor);
}

WardrobeMorph.prototype.init = function (aSprite, sliderColor) {
    // additional properties
    this.sprite = aSprite || new SpriteMorph();
    this.costumesVersion = null;
    this.spriteVersion = null;

    // initialize inherited properties
    WardrobeMorph.uber.init.call(this, null, null, sliderColor);

    // configure inherited properties
    this.fps = 2;
    this.updateList();
};

// Wardrobe updating

WardrobeMorph.prototype.updateList = function () {
    var myself = this,
        x = this.left() + 5,
        y = this.top() + 5,
        padding = 4,
        oldFlag = Morph.prototype.trackChanges,
        oldPos = this.contents.position(),
        icon,
        template,
        txt,
        paintbutton,
        importButton,
        ide = this.parentThatIsA(IDE_Morph);

    this.changed();
    oldFlag = Morph.prototype.trackChanges;
    Morph.prototype.trackChanges = false;

    this.contents.destroy();
    this.contents = new FrameMorph(this);
    this.contents.acceptsDrops = false;
    this.contents.reactToDropOf = function (icon) {
        myself.reactToDropOf(icon);
    };
    this.addBack(this.contents);

    if (this instanceof WardrobeMorph) {
        var ide = this.sprite.parentThatIsA(IDE_Morph);
    }
    else {
        var ide = this.parentThatIsA(IDE_Morph);
    }

    if(ide && (!ide.currentSprite.isLocked || ide.developer)) {
        if (ide && ide.currentSprite instanceof StageMorph) {
            txt = new TextMorph(localize('Add a new background'));
        }
        else {
            txt = new TextMorph(localize('Add a new costume'));
        }
        txt.setPosition(new Point(x, y));
        this.addContents(txt);
        y = txt.bottom() + 7 * padding;
        txt.fontSize = 14;
        txt.setColor(SpriteMorph.prototype.paletteTextColor);

        paintbutton = new PushButtonMorph(
            this,
            "paintNew",
            new SymbolMorph("brush", 15)
        );
        paintbutton.padding = 0;
        paintbutton.corner = 12;
        paintbutton.color = IDE_Morph.prototype.frameColor;
        paintbutton.highlightColor = IDE_Morph.prototype.frameColor.darker(50);
        paintbutton.pressColor = paintbutton.highlightColor;
        paintbutton.labelMinExtent = new Point(36, 18);
        paintbutton.labelShadowOffset = new Point(-1, -1);
        paintbutton.labelShadowColor = paintbutton.highlightColor;
        paintbutton.labelColor = TurtleIconMorph.prototype.labelColor;
        paintbutton.contrast = this.buttonContrast;
        paintbutton.drawNew();
        if (this.sprite instanceof StageMorph) {
            paintbutton.hint = "Paint a new background";
        }
        else {
            paintbutton.hint = "Paint a new costume";
        }
        paintbutton.setPosition(new Point(x, y));
        paintbutton.fixLayout();
        paintbutton.setCenter(txt.center());
        paintbutton.setLeft(txt.right() + padding * 4);

        this.addContents(paintbutton);

        //opens import costume DialogMorph
        if (ide && !(ide.currentSprite instanceof StageMorph)) {
            importButton = new PushButtonMorph(
                this,
                "importNewCostume",
                new SymbolMorph("shirt", 15)
            );
            importButton.padding = 0;
            importButton.corner = 12;
            importButton.color = IDE_Morph.prototype.frameColor;
            importButton.highlightColor = IDE_Morph.prototype.frameColor.darker(50);
            importButton.pressColor = importButton.highlightColor;
            importButton.labelMinExtent = new Point(36, 18);
            importButton.labelShadowOffset = new Point(-1, -1);
            importButton.labelShadowColor = importButton.highlightColor;
            importButton.labelColor = TurtleIconMorph.prototype.labelColor;
            importButton.contrast = this.buttonContrast;
            importButton.drawNew();
            importButton.hint = "Choose a costume from library";
            importButton.setPosition(new Point(x, y));
            importButton.fixLayout();
            importButton.setCenter(txt.center());
            importButton.setLeft(paintbutton.right() + padding);

            this.addContents(importButton);
        }

        //opens import background DialogMorph
        if (ide && (ide.currentSprite instanceof StageMorph)) {
            importButton = new PushButtonMorph(
                this,
                "importNewBackground",
                new SymbolMorph("landscape", 15)
            );
            importButton.padding = 0;
            importButton.corner = 12;
            importButton.color = IDE_Morph.prototype.frameColor;
            importButton.highlightColor = IDE_Morph.prototype.frameColor.darker(50);
            importButton.pressColor = importButton.highlightColor;
            importButton.labelMinExtent = new Point(36, 18);
            importButton.labelShadowOffset = new Point(-1, -1);
            importButton.labelShadowColor = importButton.highlightColor;
            importButton.labelColor = TurtleIconMorph.prototype.labelColor;
            importButton.contrast = this.buttonContrast;
            importButton.drawNew();
            importButton.hint = "Choose a background from library";
            importButton.setPosition(new Point(x, y));
            importButton.fixLayout();
            importButton.setCenter(txt.center());
            importButton.setLeft(paintbutton.right() + padding);

            this.addContents(importButton);
        }
    }

    var costumesArray = this.sprite.costumes.asArray(),
        sprite,
        logObj = {};

    if (ide && ide.currentSprite) {
        sprite = ide.currentSprite;
    }
    costumesArray.forEach(function (costume) {

        template = icon = new CostumeIconMorph(costume, template);
        icon.setPosition(new Point(x, y));
        myself.addContents(icon);
        if (ide === null || ide.currentSprite.costume === costume) {
            // adding new buttons for each costume
            var buttonCoor = [icon.right() + 2 * padding, y];
            var button;

            if (costume instanceof Costume) {
                if (costume.locked == false && !ide.currentSprite.isLocked) {
                    if (ide && ide.currentSprite instanceof StageMorph) {
                        button = myself.addCostumeButton(icon, 'edit', "edit this background",
                            function () {
                                this.editCostume();
                                var name = sprite.devName ? sprite.devName : sprite.name;
                                logObj = {action: 'costumeIconButton', button: 'edit',
                                spriteID: name, costumeID: costume.name};
                                ide.updateLog(logObj);
                            },
                            buttonCoor);
                        buttonCoor[1] = button.bottom() + padding;

                        button = myself.addCostumeButton(icon, 'delete', "delete this background",
                            function () {
                                this.removeCostume();
                                var name = sprite.devName ? sprite.devName : sprite.name;
                                logObj = {action: 'costumeIconButton', button: 'delete',
                                spriteID: name, costumeID: costume.name};
                                ide.updateLog(logObj);
                            },
                            buttonCoor);
                        buttonCoor[1] = button.bottom() + padding;

                        button = myself.addCostumeButton(icon, 'rename', "rename this background",
                            function () {
                                this.renameCostume();
                                var name = sprite.devName ? sprite.devName : sprite.name;
                                logObj = {action: 'costumeIconButton', button: 'rename',
                                    spriteID: name, costumeID: costume.name};
                                ide.updateLog(logObj);
                            },
                            buttonCoor);
                        buttonCoor = [button.right() + 3 * padding, y];

                    }
                    else {
                        button = myself.addCostumeButton(icon, 'edit', "edit this costume",
                            function () {
                                this.editCostume();
                                var name = sprite.devName ? sprite.devName : sprite.name;
                                logObj = {action: 'costumeIconButton', button: 'edit',
                                    spriteID: name, costumeID: costume.name};
                                ide.updateLog(logObj);
                            },
                            buttonCoor);

                        buttonCoor[1] = button.bottom() + padding;
                        if (costumesArray.length > 1) {
                            button = myself.addCostumeButton(icon, 'delete', "delete this costume",
                                function () {
                                    this.removeCostume();
                                    var name = sprite.devName ? sprite.devName : sprite.name;
                                    logObj = {action: 'costumeIconButton', button: 'delete',
                                        spriteID: name, costumeID: costume.name};
                                    ide.updateLog(logObj);
                                },
                                buttonCoor);
                            buttonCoor[1] = button.bottom() + padding;
                        }
                        button = myself.addCostumeButton(icon, 'rename', "rename this costume",
                               function () {
                                   this.renameCostume();
                                   var name = sprite.devName ? sprite.devName : sprite.name;
                                   logObj = {action: 'costumeIconButton', button: 'rename',
                                       spriteID: name, costumeID: costume.name};
                                   ide.updateLog(logObj);
                               },
                            buttonCoor);
                        buttonCoor = [button.right() + 3 * padding, y];
                    }
                }
            }
            if (ide && ide.currentSprite instanceof StageMorph) {
                button = myself.addCostumeButton(icon, 'export', "export this background",
                    function () {
                        this.exportCostume();
                        var name = sprite.devName ? sprite.devName : sprite.name;
                        logObj = {action: 'costumeIconButton', button: 'export',
                            spriteID: name, costumeID: costume.name};
                        ide.updateLog(logObj);
                    },
                    buttonCoor);
                buttonCoor[1] = button.bottom() + padding;

                button = myself.addCostumeButton(icon, 'duplicate', "make a copy of this background",
                    function () {
                        this.duplicateCostume();
                        var name = sprite.devName ? sprite.devName : sprite.name;
                        logObj = {action: 'costumeIconButton', button: 'duplicate',
                            spriteID: name, costumeID: costume.name};
                        ide.updateLog(logObj);
                    },
                    buttonCoor);
            }
            else {
                button = myself.addCostumeButton(icon, 'export', "export this costume",
                    function () {
                        this.exportCostume();
                        var name = sprite.devName ? sprite.devName : sprite.name;
                        logObj = {action: 'costumeIconButton', button: 'export',
                            spriteID: name, costumeID: costume.name};
                        ide.updateLog(logObj);
                    },
                    buttonCoor);
                buttonCoor[1] = button.bottom() + padding;

                button = myself.addCostumeButton(icon, 'duplicate', "make a copy of this costume",
                    function () {
                        this.duplicateCostume();
                        var name = sprite.devName ? sprite.devName : sprite.name;
                        logObj = {action: 'costumeIconButton', button: 'duplicate',
                            spriteID: name, costumeID: costume.name};
                        ide.updateLog(logObj);
                    },
                    buttonCoor);
            }
            buttonCoor = [button.right() + 3 * padding, y];

            // developer menu
            if (ide && ide.developer) {
                var padlock = new ToggleMorph(
                    'checkbox',
                    null,
                    function () {
                        costume.locked = !costume.locked;
                        costume.isDraggable = !costume.locked;
                        myself.updateList();
                    },
                    localize('locked'),
                    function () {
                        return costume.locked;
                    }
                );
                padlock.hint = 'Costumes cannot be edited';
                padlock.label.isBold = false;
                padlock.label.setColor(this.buttonLabelColor);
                padlock.color = PushButtonMorph.prototype.color;
                padlock.highlightColor = PushButtonMorph.prototype.highlightColor;
                padlock.pressColor = PushButtonMorph.prototype.pressColor;

                padlock.tick.shadowOffset = MorphicPreferences.isFlat ?
                    new Point() : new Point(-1, -1);
                padlock.tick.shadowColor = new Color(); // black
                padlock.tick.color = ide.buttonLabelColor;
                padlock.tick.isBold = false;
                padlock.tick.drawNew();

                padlock.setPosition(new Point(buttonCoor[0], buttonCoor[1]));
                padlock.drawNew();
                myself.addContents(padlock);
            }
        }
        y = icon.bottom() + padding;
    });
    this.costumesVersion = this.sprite.costumes.lastChanged;

    this.contents.setPosition(oldPos);
    this.adjustScrollBars();
    Morph.prototype.trackChanges = oldFlag;
    this.changed();

    this.updateSelection();
};

WardrobeMorph.prototype.addCostumeButton = function (icon, name, hint, action, coor) {
    var x, y;
    button = new PushButtonMorph(
        icon,
        action,
        name
    );
    button.setPosition(new Point(coor[0], coor[1]));
    var width = button.label.width();

    /* if statement to make uniform buttons */
    if (button.label !== null) {
        var padding = button.padding * 2 + button.outline * 2 + button.edge * 2;
        button.setExtent(new Point(45 + padding, // 45 is widest label 'duplicate'
                button.label.height() + padding));
        button.label.setCenter(button.center());
    }

    this.addContents(button);
    return button;
};

WardrobeMorph.prototype.updateSelection = function () {
    this.contents.children.forEach(function (morph) {
        if (morph.refresh) {
            morph.refresh();
        }
    });
    this.spriteVersion = this.sprite.version;
};

// Wardrobe stepping

WardrobeMorph.prototype.step = function () {
    if (this.costumesVersion !== this.sprite.costumes.lastChanged) {
        this.updateList();
    }
    if (this.spriteVersion !== this.sprite.version) {
        this.updateSelection();
    }
};

// Wardrobe ops

WardrobeMorph.prototype.removeCostumeAt = function (idx) {
    this.sprite.costumes.remove(idx);
    this.updateList();
};

WardrobeMorph.prototype.importNewSound = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    new ProjectDialogMorph(ide, 'sounds').popUp();
};

WardrobeMorph.prototype.importNewCostume = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    new ProjectDialogMorph(ide, 'costumes').popUp();
};

WardrobeMorph.prototype.importNewBackground = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    new ProjectDialogMorph(ide, 'backgrounds').popUp();
};

WardrobeMorph.prototype.paintNew = function () {
    var ide = this.parentThatIsA(IDE_Morph),
        sprite = ide.currentSprite,
        name = sprite.devName ? sprite.devName : sprite.name,
        string = sprite.getNextCostumeName("Untitled"),
        cos = new Costume(newCanvas(), string),
        ide = this.parentThatIsA(IDE_Morph),
        myself = this,
        type;

    if(sprite instanceof SpriteMorph)
        type = 'sprite';
    else if (sprite instanceof StageMorph)
        type = 'stage';
    else
        type = null;

    cos.edit(
        this.world(),
        ide,
        true,
        function() {ide.updateLog({action: 'cancelWindow', window: 'paintCostume'})},
        function () {
            myself.sprite.addCostume(cos);
            myself.updateList();
            if (ide) {
                sprite.wearCostume(cos);
            }
            ide.updateLog({action: 'costumeImport', method: 'paintNew', type: type, spriteID: name, name: cos.name});
            ide.unsavedChanges = true;
        }
    );
};

// Wardrobe drag & drop

WardrobeMorph.prototype.wantsDropOf = function (morph) {
    return morph instanceof CostumeIconMorph;
};

WardrobeMorph.prototype.reactToDropOf = function (icon) {
    var idx = 0,
        costume = icon.object,
        top = icon.top();

    icon.destroy();
    this.contents.children.forEach(function (item) {
        if (item instanceof CostumeIconMorph && item.top() < top - 4) {
            idx += 1;
        }
    });
    this.sprite.costumes.add(costume, idx + 1);
    this.updateList();
    icon.mouseClickLeft(); // select
};

// SoundIconMorph ///////////////////////////////////////////////////////

/*
 I am an element in the SpriteEditor's "Sounds" tab.
 */

// SoundIconMorph inherits from ToggleButtonMorph (Widgets)
// ... and copies methods from SpriteIconMorph

SoundIconMorph.prototype = new ToggleButtonMorph();
SoundIconMorph.prototype.constructor = SoundIconMorph;
SoundIconMorph.uber = ToggleButtonMorph.prototype;

// SoundIconMorph settings

SoundIconMorph.prototype.thumbSize = new Point(80, 60);
SoundIconMorph.prototype.labelShadowOffset = null;
SoundIconMorph.prototype.labelShadowColor = null;
SoundIconMorph.prototype.labelColor = new Color(255, 255, 255);
SoundIconMorph.prototype.fontSize = 9;

// SoundIconMorph instance creation:

function SoundIconMorph(aSound, aTemplate) {
    this.init(aSound, aTemplate);
}

SoundIconMorph.prototype.init = function (aSound, aTemplate) {
    var colors, action, query;

    if (!aTemplate) {
        colors = [
            IDE_Morph.prototype.groupColor,
            IDE_Morph.prototype.frameColor,
            IDE_Morph.prototype.frameColor
        ];

    }

    action = function () {
        nop(); // When I am selected (which is never the case for sounds)
    };

    query = function () {
        return false;
    };

    // additional properties:
    this.object = aSound; // mandatory, actually
    this.version = this.object.version;
    this.thumbnail = null;

    // initialize inherited properties:
    SoundIconMorph.uber.init.call(
        this,
        colors, // color overrides, <array>: [normal, highlight, pressed]
        null, // target - not needed here
        action, // a toggle function
        this.object.name, // label string
        query, // predicate/selector
        null, // environment
        null, // hint
        aTemplate // optional, for cached background images
    );

    // override defaults and build additional components
    this.isDraggable = true;
    this.createThumbnail();
    this.padding = 2;
    this.corner = 8;
    this.fixLayout();
    this.fps = 1;
};

SoundIconMorph.prototype.createThumbnail = function () {
    var label;
    if (this.thumbnail) {
        this.thumbnail.destroy();
    }
    this.thumbnail = new Morph();
    this.thumbnail.setExtent(this.thumbSize);
    this.add(this.thumbnail);
    label = new StringMorph(
        this.createInfo(),
        '16',
        '',
        true,
        false,
        false,
        this.labelShadowOffset,
        this.labelShadowColor,
        new Color(200, 200, 200)
    );
    this.thumbnail.add(label);
    label.setCenter(new Point(40, 15));

    this.button = new PushButtonMorph(
        this,
        'toggleAudioPlaying',
        (this.object.previewAudio ? 'Stop' : 'Play')
    );
    this.button.drawNew();
    this.button.hint = 'Play sound';
    this.button.fixLayout();
    this.thumbnail.add(this.button);
    this.button.setCenter(new Point(40, 40));
};

SoundIconMorph.prototype.createInfo = function () {
    var dur = Math.round(this.object.audio.duration || 0),
        mod = dur % 60;
    return Math.floor(dur / 60).toString()
        + ":"
        + (mod < 10 ? "0" : "")
        + mod.toString();
};

SoundIconMorph.prototype.toggleAudioPlaying = function () {
    var myself = this;
    if (!this.object.previewAudio) {
        //Audio is not playing
        this.button.labelString = 'Stop';
        this.button.hint = 'Stop sound';
        this.object.previewAudio = this.object.play();
        this.object.previewAudio.addEventListener('ended', function () {
            myself.audioHasEnded();
        }, false);
    } else {
        //Audio is currently playing
        this.button.labelString = 'Play';
        this.button.hint = 'Play sound';
        this.object.previewAudio.pause();
        this.object.previewAudio.terminated = true;
        this.object.previewAudio = null;
    }
    this.button.createLabel();
};

SoundIconMorph.prototype.audioHasEnded = function () {
    this.button.trigger();
    this.button.mouseLeave();
};

SoundIconMorph.prototype.createLabel
    = SpriteIconMorph.prototype.createLabel;

// SoundIconMorph stepping

/*
 SoundIconMorph.prototype.step
 = SpriteIconMorph.prototype.step;
 */

// SoundIconMorph layout

SoundIconMorph.prototype.fixLayout
    = SpriteIconMorph.prototype.fixLayout;

// SoundIconMorph menu

SoundIconMorph.prototype.userMenu = function () {
    var menu = new MenuMorph(this);
    if (!(this.object instanceof Sound)) {
        return null;
    }
    menu.addItem('rename', 'renameSound');
    menu.addItem('delete', 'removeSound');
    return menu;
};


SoundIconMorph.prototype.renameSound = function () {
    var sound = this.object,
        ide = this.parentThatIsA(IDE_Morph),
        myself = this;
    (new DialogBoxMorph(
        null,
        function (answer) {
            if (answer && (answer !== sound.name)) {
                ide.updateLog({action: 'soundRename', name: answer, originName: sound.name});
                sound.name = answer;
                sound.version = Date.now();
                myself.createLabel(); // can be omitted once I'm stepping
                myself.fixLayout(); // can be omitted once I'm stepping
                ide.hasChangedMedia = true;
            }
        }
    )).prompt(
        'rename sound',
        sound.name,
        this.world()
    );
};

SoundIconMorph.prototype.removeSound = function () {
    var jukebox = this.parentThatIsA(JukeboxMorph),
        idx = this.parent.children.indexOf(this) - 1,
        ide = this.parentThatIsA(IDE_Morph),
        myself = this;
    jukebox.removeSound(idx);
    ide.updateLog({action:'soundRemove', name: myself.object.name, index: idx});

};

SoundIconMorph.prototype.createBackgrounds
    = SpriteIconMorph.prototype.createBackgrounds;

SoundIconMorph.prototype.createLabel
    = SpriteIconMorph.prototype.createLabel;

// SoundIconMorph drag & drop

SoundIconMorph.prototype.prepareToBeGrabbed = function () {
    this.removeSound();
};

// JukeboxMorph /////////////////////////////////////////////////////

/*
 I am JukeboxMorph, like WardrobeMorph, but for sounds
 */

// JukeboxMorph instance creation

JukeboxMorph.prototype = new ScrollFrameMorph();
JukeboxMorph.prototype.constructor = JukeboxMorph;
JukeboxMorph.uber = ScrollFrameMorph.prototype;

function JukeboxMorph(aSprite, sliderColor) {
    this.init(aSprite, sliderColor);
}

JukeboxMorph.prototype.init = function (aSprite, sliderColor) {
    // additional properties
    this.sprite = aSprite || new SpriteMorph();
    this.costumesVersion = null;
    this.spriteVersion = null;

    // initialize inherited properties
    JukeboxMorph.uber.init.call(this, null, null, sliderColor);

    // configure inherited properties
    this.acceptsDrops = false;
    this.fps = 2;
    this.updateList();
};

// Jukebox updating

JukeboxMorph.prototype.updateList = function () {
    var myself = this,
        x = this.left() + 5,
        y = this.top() + 5,
        padding = 4,
        oldFlag = Morph.prototype.trackChanges,
        icon,
        template,
        importButton,
        txt;

    this.changed();
    oldFlag = Morph.prototype.trackChanges;
    Morph.prototype.trackChanges = false;

    this.contents.destroy();
    this.contents = new FrameMorph(this);
    this.contents.acceptsDrops = false;
    this.contents.reactToDropOf = function (icon) {
        myself.reactToDropOf(icon);
    };
    this.addBack(this.contents);

    txt = new TextMorph(localize(
        'Add a new sound'
    ));

    txt.fontSize = 14;
    txt.setColor(SpriteMorph.prototype.paletteTextColor);
    txt.setPosition(new Point(x, y));//y+30));//new Point(x, y));
    this.addContents(txt);
    y = txt.bottom() + 7 * padding;

    importButton = new PushButtonMorph(
        this,
        "importNewSound",
        new SymbolMorph("note", 15)
    );
    importButton.padding = 0;
    importButton.corner = 12;
    importButton.color = IDE_Morph.prototype.frameColor;
    importButton.highlightColor = IDE_Morph.prototype.frameColor.darker(50);
    importButton.pressColor = importButton.highlightColor;
    importButton.labelMinExtent = new Point(36, 18);
    importButton.labelShadowOffset = new Point(-1, -1);
    importButton.labelShadowColor = importButton.highlightColor;
    importButton.labelColor = TurtleIconMorph.prototype.labelColor;
    importButton.contrast = this.buttonContrast;
    importButton.drawNew();
    importButton.hint = "Choose a sound from library";

    importButton.setPosition(new Point(x, y));
    importButton.fixLayout();
    importButton.setCenter(txt.center());
    importButton.setLeft(txt.right() + padding * 4);

    this.addContents(importButton);

    this.sprite.sounds.asArray().forEach(function (sound) {
        template = icon = new SoundIconMorph(sound, template);
        icon.setPosition(new Point(x, y));
        myself.addContents(icon);
        y = icon.bottom() + padding;
    });

    Morph.prototype.trackChanges = oldFlag;
    this.changed();

    this.updateSelection();
};

JukeboxMorph.prototype.importNewSound = function () {
    var ide = this.parentThatIsA(IDE_Morph);
    new ProjectDialogMorph(ide, 'sounds').popUp();
};

JukeboxMorph.prototype.updateSelection = function () {
    this.contents.children.forEach(function (morph) {
        if (morph.refresh) {
            morph.refresh();
        }
    });
    this.spriteVersion = this.sprite.version;
};

// Jukebox stepping

/*
 JukeboxMorph.prototype.step = function () {
 if (this.spriteVersion !== this.sprite.version) {
 this.updateSelection();
 }
 };
 */

// Jukebox ops

JukeboxMorph.prototype.removeSound = function (idx) {
    this.sprite.sounds.remove(idx);
    this.updateList();
};

// Jukebox drag & drop

JukeboxMorph.prototype.wantsDropOf = function (morph) {
    return morph instanceof SoundIconMorph;
};

JukeboxMorph.prototype.reactToDropOf = function (icon) {
    var idx = 0,
        costume = icon.object,
        top = icon.top();

    icon.destroy();
    this.contents.children.forEach(function (item) {
        if (item.top() < top - 4) {
            idx += 1;
        }
    });
    this.sprite.sounds.add(costume, idx);
    this.updateList();
};
