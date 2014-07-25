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
/*
IDE_Morph.prototype.setDefaultDesign = function () {
    MorphicPreferences.isFlat = false;
    SpriteMorph.prototype.paletteColor = new Color(55, 55, 55);
    SpriteMorph.prototype.paletteTextColor = new Color(230, 230, 230);
    StageMorph.prototype.paletteTextColor
        = SpriteMorph.prototype.paletteTextColor;
    StageMorph.prototype.paletteColor = SpriteMorph.prototype.paletteColor;
    SpriteMorph.prototype.sliderColor
        = SpriteMorph.prototype.paletteColor.lighter(30);

    IDE_Morph.prototype.buttonContrast = 30;
    IDE_Morph.prototype.backgroundColor = new Color(40, 40, 40);
    IDE_Morph.prototype.frameColor = SpriteMorph.prototype.paletteColor;

    IDE_Morph.prototype.groupColor
        = SpriteMorph.prototype.paletteColor.lighter(8);
    IDE_Morph.prototype.sliderColor = SpriteMorph.prototype.sliderColor;
    IDE_Morph.prototype.buttonLabelColor = new Color(255, 255, 255);
    IDE_Morph.prototype.tabColors = [
        IDE_Morph.prototype.groupColor.darker(40),
        IDE_Morph.prototype.groupColor.darker(60),
        IDE_Morph.prototype.groupColor
    ];
    IDE_Morph.prototype.rotationStyleColors = IDE_Morph.prototype.tabColors;
    IDE_Morph.prototype.appModeColor = new Color();
    IDE_Morph.prototype.scriptsPaneTexture = 'scriptsPaneTexture.gif';
    IDE_Morph.prototype.padding = 5;

    SpriteIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    CostumeIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    SoundIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
    TurtleIconMorph.prototype.labelColor
        = IDE_Morph.prototype.buttonLabelColor;
};
*/

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
        IDE_Morph.prototype.groupColor.darker(30)
    ];
    IDE_Morph.prototype.appModeColor = IDE_Morph.prototype.frameColor;
    IDE_Morph.prototype.scriptsPaneTexture = 'scriptsPaneTexture2.png';
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

IDE_Morph.prototype.setDefaultDesign();

// IDE_Morph instance creation:

function IDE_Morph(paramsDictionary) {
	if (typeof paramsDictionary == 'undefined')
	{
		paramsDictionary = {};
	}
	this.init(paramsDictionary);
}

IDE_Morph.prototype.init = function (paramsDictionary) {
    // global font setting
    MorphicPreferences.globalFontFamily = 'Helvetica, Arial';

    //Setting developer mode based on html
    this.developer = typeof paramsDictionary.developerMode != 'undefined' ?
    										paramsDictionary.developerMode  : false;

    //Prioritized file ID - This will load first if it exists, regardless of sandbox mode
    this.loadFileID = typeof paramsDictionary.fileID != 'undefined' ?
                                            paramsDictionary.fileID : 'undefined';

    //Setting demo mode based on html
    this.demoMode = typeof paramsDictionary.demoMode != 'undefined' ?
                                            paramsDictionary.demoMode : false;

    // restore saved user preferences
    this.userLanguage = null; // user language preference for startup
    this.applySavedSettings();

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

    this.isAutoFill = true; // used to be isAutoFill || true;
    this.isAppMode = false;
    this.isSmallStage = false;
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
    this.paramsBuilder(paramsDictionary);


    // set costume
    var myself = this;
    if (this.currentSprite.costumes.length() == 0) {
    	var url = 'Costumes/octopi.png';
    	var img = new Image();
    	img.onload = function () {
            var canvas = newCanvas(new Point(img.width, img.height));
            canvas.getContext('2d').drawImage(img, 0, 0);
            myself.setCostumeFromImage(canvas, name);
    	};
    	img.src = url;
    }

};

IDE_Morph.prototype.paramsBuilder = function (paramsDictionary)
{
    //Setting Sandbox mode and loading the base file based on html
    if (typeof paramsDictionary.sandboxMode != 'undefined')
    {
    	if (!this.developer)
    	{
    		this.sandbox = true;
    		if (typeof paramsDictionary.sandboxMode.modulePath_URL != 'undefined')
    		{
    			SnapCloud.api.getProjectList.url =
    										paramsDictionary.sandboxMode.modulePath_URL;
    			SnapCloud.api.saveProject.url =
    										paramsDictionary.sandboxMode.modulePath_URL;

    			if (typeof paramsDictionary.sandboxMode.baseFile_ID != 'undefined')
    			{
    				this.sandboxBaseFile_ID = paramsDictionary.sandboxMode.baseFile_ID;
				}
				else
				{
					this.sandboxBaseFile_ID = 'undefined';
				}
    		}
    	}
    	else
    	{
    		this.sandbox = false;
    	}
    }
    this.buildWithParams();
};

IDE_Morph.prototype.buildWithParams = function () {
    var myself = this,
        message = '',
        id;

    if ( this.loadFileID != 'undefined' && this.sandbox ){ //loading a student sandbox file
        message = 'Loading Sandbox File...';
        id = this.loadFileID;
    }
    else if ( this.sandbox ){ //loading a new sandbox
        message = 'Creating New Sandbox...';
        id = this.sandboxBaseFile_ID;
    }
    else if ( this.loadFileID != 'undefined') { //loading non-sandbox file
        message = 'Loading File...';
        id = this.loadFileID
    }

    if(message != '') { //only do these steps if we have a fileID to load
        this.nextSteps([
            function () {
                SnapCloud.rawOpenProject({
                    file_id: id,
                    existingMessage: this.showMessage(message)},
                    myself
                );
            }
        ]);
    }
};

IDE_Morph.prototype.openIn = function (world) {
    var hash, usr, myself = this, urlLanguage = null;

    this.buildPanes();
    world.add(this);
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
            request.open('GET', url, false);
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
    this.logo.texture = 'snap_logo_sm.png';
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
        gradient.addColorStop(0.35, myself.frameColor.toString());
        context.fillStyle = gradient;//MorphicPreferences.isFlat ?
               // myself.frameColor.toString() : gradient;
        context.fillRect(0, 0, this.width(), this.height());
        if (this.texture) {
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
    // button.hint = 'stage size\nsmall & normal';
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
    button.hint = 'Full Screen/\n' +
                  'Normal Screen';
    button.fixLayout();
    button.refresh();
    appModeButton = button;
    if(!this.demoMode) {
        this.controlBar.add(appModeButton);
    }
    this.controlBar.appModeButton = appModeButton; // for refreshing

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
                            this.labelColor = new Color(255,220,0);
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
        'pressStart',
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
        'pressReady',
        new SymbolMorph('turnRight', 14)
    );
    button.corner = 12;
    button.color = colors[0];
    button.highlightColor = colors[1];
    button.pressColor = colors[2];
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = colors[1];
    button.labelColor = new Color(84, 255, 159);
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

    // nextTaskButton
    button = new PushButtonMorph(
        this,
        'nextTask', //'settingsMenu' to base off of
        new SymbolMorph('arrowRight', 14)
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
    button.hint = 'Next Task';
    button.fixLayout();
    nextTaskButton = button;
    this.controlBar.add(nextTaskButton);
    this.controlBar.nextTaskButton = nextTaskButton; // for menu positioning

    // lastTaskButton
    button = new PushButtonMorph(
        this,
        'lastTask',
        new SymbolMorph('arrowLeft', 14)
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
    button.hint = 'Last Task';
    button.fixLayout();
    lastTaskButton = button;
    this.controlBar.add(lastTaskButton);
    this.controlBar.lastTaskButton = lastTaskButton; // for menu positioning

	// exitButton
	button = new PushButtonMorph(
        this,
        'exitOut',
        new SymbolMorph('arrowUp', 14)
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
    button.hint = 'Exit';
    button.fixLayout();
    exitButton = button;
    this.controlBar.add(exitButton);
    this.controlBar.exitButton = exitButton; // for menu positioning

    // checkButton
	button = new PushButtonMorph(
        this,
        'saveTask',
        new SymbolMorph('checkMark', 14) //change to check mark
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
    button.labelColor = new Color(0, 200, 0);
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.hint = 'Save Task';
    button.fixLayout();
    checkButton = button;
    this.controlBar.add(checkButton);
    this.controlBar.checkButton = checkButton; // for menu positioning

    /*// cloudButton
    button = new PushButtonMorph(
        this,
        'cloudMenu',
        new SymbolMorph('cloud', 11)
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
    button.hint = 'Cloud';
    button.fixLayout();
    cloudButton = button;
    this.controlBar.add(cloudButton);
    this.controlBar.cloudButton = cloudButton; // for menu positioning
*/

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

        [stageSizeButton, appModeButton].forEach(
            function (button) {
                x += padding;
                button.setCenter(myself.controlBar.center());
                button.setLeft(x);
                x += button.width();
            }
        );

            lastTaskButton.setCenter(myself.controlBar.center());
            lastTaskButton.setRight(this.left() + (padding * 2));

            checkButton.setCenter(myself.controlBar.center());
            checkButton.setLeft(lastTaskButton.right() + padding);

            nextTaskButton.setCenter(myself.controlBar.center());
            nextTaskButton.setLeft(checkButton.right() + padding);

            exitButton.setCenter(myself.controlBar.center());
            exitButton.setLeft(nextTaskButton.right() + padding);

            settingsButton.setCenter(myself.controlBar.center());
            settingsButton.setRight(lastTaskButton.left() - padding);

            projectButton.setCenter(myself.controlBar.center());
            projectButton.setRight(settingsButton.left() - padding);

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
    				if (!contains(['lists', 'other'], cat)) {
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
            ide = this.parentThatIsA(IDE_Morph),
            more = {
                operators:
                    ['reifyScript', 'reifyReporter', 'reifyPredicate'],
                control:
                    ['doWarp'],
                variables:
                    [
                        'doDeclareVariables',
                        'reportNewList',
                        'reportCONS',
                        'reportListItem',
                        'reportCDR',
                        'reportListLength',
                        'reportListContainsItem',
                        'doAddToList',
                        'doDeleteFromList',
                        'doInsertInList',
                        'doReplaceInList'
                    ]
            };

        function hasRemovedBlocks() {
            var defs = SpriteMorph.prototype.blocks,
                inPalette = StageMorph.prototype.inPaletteBlocks;
            return Object.keys(inPalette).some(function (any) {
                return ((inPalette[any] == false) && defs[any] &&
                	(defs[any].category === category ||
                   	contains((more[category] || []), any))) || (inPalette[any] == false
                   	&&category == 'variables' && any.indexOf('reportGetVar') > -1);
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

		// to do: fix for variables
        function changeCategory(button, inPalette) {
            StageMorph.prototype.inPaletteBlocks['cat-' + category] = inPalette;
            // change button color
            button.highlightColor = myself.frameColor.darker(40);
            button.color = myself.frameColor;
        	button.pressColor = SpriteMorph.prototype.blockColor[category];
            if (!inPalette) {
        		button.color = button.color.darker(30);
        		button.pressColor = button.pressColor.lighter(40);
        		button.highlightColor = button.highlightColor.lighter(40);
        	}
        	button.drawNew();
        	button.fixLayout();
        	if (button.state) {
        		button.image = button.pressImage;
        	}
            var defs = SpriteMorph.prototype.blocks;
            Object.keys(defs).forEach(function (b) {
            	if (defs[b] && defs[b].category === category) {
            	    StageMorph.prototype.inPaletteBlocks[b] = inPalette;
            	}
            });
            (more[category] || []).forEach(function (b) {
                StageMorph.prototype.inPaletteBlocks[b] = inPalette;
            });
            myself.palette.contents.children.forEach( function (block) {
            	if (block.category === category) { // || more[category].indexOf(block.selector) > -1) {
                	if (block.inPalette != inPalette) {
                    	block.switchInPalette(inPalette);
                    }
                }
            });
        }


        if (canRemoveBlocks() && ide.developer) {
        	if (!hasRemovedBlocks()) {
            	menu.addItem(
                	'Remove all category blocks',
                	function() {
                		changeCategory(this, false);
                	}
            	);
            }
        	else {
            	menu.addItem(
                	'Add all category blocks',
                	function () {
                		changeCategory(this, true);
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
            rows =  Math.ceil((myself.categories.children.length) / 2),
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
        if (!contains(['lists', 'other'], cat)) {
            addCategoryButton(cat);
        }
        }
    });
    fixCategoriesLayout();
    this.add(this.categories);
};

IDE_Morph.prototype.createPalette = function () {
    // assumes that the logo pane has already been created
    // needs the categories pane for layout
    var myself = this,
    ide = myself.parentThatIsA(IDE_Morph);

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

    }

    this.palette.reactToDropOf = function (droppedMorph) {
        var ide = this.parentThatIsA(IDE_Morph);
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
            }
        }
        else if (droppedMorph instanceof CommentMorph) {
            if (droppedMorph.locked && ide && !ide.developer) {
                droppedMorph.slideBackTo(myself.world().hand.grabOrigin);
            }
            else if (droppedMorph.locked && ide && ide.developer) {
                droppedMorph.destroy();
            }
            else if (!droppedMorph.locked) {
                droppedMorph.destroy();
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
        myself = this;

    if (this.spriteBar) {
        this.spriteBar.destroy();
    }

    this.spriteBar = new Morph();
    this.spriteBar.color = this.frameColor;
    this.add(this.spriteBar);

    function addRotationStyleButton(rotationStyle) {
        var colors = myself.rotationStyleColors,
            button;


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
        xcoord.setPosition(new Point (xcoord.position().x + 5.25, xcoord.position().y));
        ycoord.setPosition(xcoord.bottomLeft());
        this.spriteBar.add(xcoord);
        this.spriteBar.add(ycoord);
    }

    if (myself.currentEvent == null) {
        thumbnail.step = function () {
            if (thumbnail.version !== myself.currentSprite.version) {
                thumbnail.image = myself.currentSprite.thumbnail(thumbSize);
                thumbnail.changed();
                thumbnail.version = myself.currentSprite.version;
                if (myself.currentSprite.isLocked) {
                    myself.parentThatIsA(IDE_Morph).createSpriteBar();
                    myself.parentThatIsA(IDE_Morph).fixLayout();

                }

            }
        };
    }
    if (myself.currentEvent != null) {
        nameField = new InputFieldMorph(myself.currentEvent.selector);
        var y = (thumbnail.topRight().subtract(thumbnail.bottomRight())).y;
        nameField.setPosition(thumbnail.topRight().add(new Point(10, -1*y/4)));
        nameField.accept = function () { };
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
            nameField.accept = function () { };
            nameField.children.forEach(function (child) {
                if (child instanceof StringFieldMorph) {
                    child.children.forEach(function (grandchild) {
                        grandchild.isEditable = false;
                    });
                }
            });
            nameField.mouseClickLeft = function () { };
            nameField.mouseDownLeft = function () { };
        }
        else {
            nameField.accept = function () {
                myself.currentSprite.setName(nameField.getValue());
            };
            this.spriteBar.reactToEdit = function () {
                myself.currentSprite.setName(nameField.getValue());
            };
        }
    }
    /*
    if (this.developer) {
        var tabMenu = new PushButtonMorph(
                this,
                function () {
                    this.tabMenu(tabMenu.topRight());
                },
                new SymbolMorph('gears', 5)
                );
        tabMenu.highlightColor = myself.frameColor.darker(50);
        tabMenu.pressColor = this.frameColor.darker(50);
        tabMenu.setColor(this.color);
        tabMenu.labelColor = new Color(255, 255, 255, 255);
        tabMenu.drawNew();
        tabMenu.fixLayout();

        tabMenu.setPosition(nameField.topRight().add(new Point(133, 66))); // new Point (10, 0)
        this.spriteBar.add(tabMenu);


    } */

    if (myself.currentEvent == null) {
        // padlock
        padlock = new ToggleMorph(
            'checkbox',
            null,
            function () {
                if (!myself.currentSprite.isLocked && !myself.currentSprite.isInert) {
                    myself.currentSprite.isDraggable =
                        !myself.currentSprite.isDraggable;
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

        //locktoggle
        lock = new ToggleMorph(
            'checkbox',
            null,
            function () {
                myself.currentSprite.isLocked =
                    !myself.currentSprite.isLocked;
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
                if (myself.currentSprite.isDraggable && myself.currentSprite.isLocked)
                {
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
                myself.currentSprite.isInert =
                    !myself.currentSprite.isInert;
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
                myself.currentSprite.isResettable =
                    !myself.currentSprite.isResettable;
                myself.currentSprite.changed();
                myself.currentSprite.drawNew();
                myself.currentSprite.changed();
            },
            localize('resettable'),
            function () {
                return myself.currentSprite.isResettable
            }
        );
        resettable.hint='The sprite scripts can be brought back\n to some initial state';
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
        myself.currentTab = tabString;
        this.children.forEach(function (each) {
            each.refresh();
            if (each.state) {active = each; }
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
        function () {tabBar.tabTo('scripts'); },
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
            	function () { tabBar.tabTo('costumes'); },
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
            	function () { tabBar.tabTo('costumes'); },
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
            function () { tabBar.tabTo('sounds'); },
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

    var button = new PushButtonMorph(
        this,
        'addComment',
        new SymbolMorph('comment', 8)
    );
    button.corner = 6;
    button.color = IDE_Morph.prototype.groupColor ;
    button.highlightColor = IDE_Morph.prototype.groupColor.lighter(80),
    button.pressColor = IDE_Morph.prototype.groupColor.darker(20),
    button.labelMinExtent = new Point(36, 18);
    button.padding = 0;
    button.labelShadowOffset = new Point(-1, -1);
    button.labelShadowColor = SpriteMorph.prototype.paletteColor;
    button.labelColor = new Color(200, 0, 0);
    button.contrast = this.buttonContrast;
    button.drawNew();
    button.hint = 'Add comment';
    this.spriteBar.add(button);
    button.label.setCenter(button.center());
    button.setPosition(new Point(nameField.bottomLeft().x + 110, nameField.topRight().y + 1));


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
        scripts.texture = this.scriptsPaneTexture;

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
        hiddenscripts.texture = this.scriptsPaneTexture;

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
    this.add(this.corralBar);

    if (this.importableSprites) {
        // new sprite button
        newbutton = new PushButtonMorph(
            this,
            "addNewSprite",
            new SymbolMorph("turtle", 14)
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
            new SymbolMorph("brush", 15)
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
            "pickSpriteList",
            new SymbolMorph("arrowDown", 15)
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
        spriteListButton.hint = "import sprite from list";
        spriteListButton.fixLayout();
        spriteListButton.setCenter(this.corralBar.center());
        spriteListButton.setLeft(
                this.corralBar.left() + padding + newbutton.width() + padding + paintbutton.width() + padding
        );
        this.corralBar.add(spriteListButton);
    }

    //Sprite Tabs
    visible = new TabMorph(
        tabColors,
        null, // target
        function () {
            tabBar.tabTo('Sprites');

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
    if(this.importableSprites)
    {
        visible.setPosition(new Point(spriteListButton.topRight().x, spriteListButton.topRight().y + 9));
    }
    else {
        visible.setPosition(new Point(this.corralBar.left() + padding, this.corralBar.left() + 11));
    }

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
        hidden.setPosition(new Point(visible.center().x + 36, visible.topRight().y + 8));
        hidden.drawNew();
        hidden.fixLayout();
        tabBar.add(hidden);
    }
    else {
        myself.currentSpriteTab = 'visisbleSprites';
    }
    events = new TabMorph(
        tabColors,
        null, // target
        function () {
            tabBar.tabTo('events');
            //myself.spriteBar.tabBar.tabTo('scripts');
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
    events.setPosition(new Point(visible.center().x + 36, visible.topRight().y + 8));
    events.drawNew();
    events.fixLayout();
    tabBar.add(events);

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
    instructions.setPosition(new Point(events.center().x + 36, events.topRight().y + 8));
    instructions.drawNew();
    instructions.fixLayout();
    tabBar.add(instructions);

    tabBar.tabTo = function (tabString) {
        var active;
        var sprite = new SpriteMorph();

        sprite.blocksCache['events'] = null;
        myself.currentSprite.blocksCache['events'] = sprite.freshPalette('events').children[0].children.slice();
        if (tabString != 'events') {
            if (tabString == 'Sprites') {
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
                    myself.currentEvent = null;
                    myself.createSpriteBar();
                    myself.createSpriteEditor();
                    myself.fixLayout();
                    myself.spriteBar.tabBar.tabTo('scripts');
                }
            }
            myself.refreshPalette();
        }
        else {
            myself.currentCategory = 'events';
            myself.createCategories();
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
        myself.spriteBar.tabBar.tabTo('scripts');

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
    }
};

IDE_Morph.prototype.createCorral = function () {
    // assumes the corral bar has already been created
    var frame, template, padding = 5, myself = this, y = 10;

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
        return morph instanceof SpriteIconMorph;
    };

    frame.contents.reactToDropOf = function (spriteIcon) {
        myself.corral.reactToDropOf(spriteIcon);

    };

    frame.alpha = 0;

    if (myself.currentSpriteTab == 'events') {
        frame.contents.wantsDropOf = function (morph) {
            //frame.contents.children.remove(morph);
            //morph.destroy();
            //return true;
            // THIS DELETES COMMENTMORPHS WHEN DRAGGED INTO 'EVENTS' CORRAL
        };
        frame.contents.reactToDropOf = function (spriteIcon) {
            spriteIcon.destroy();
        };

        var sprite = new SpriteMorph();
        blocks = sprite.freshPalette('events').children[0].children;

        blocks.forEach(function (block) {
            if (block instanceof HatBlockMorph) {// && ! (StageMorph.prototype.inPaletteBlocks[block.selector] == false)) {
                myself.currentEvent = null;
                block.isTemplate = true;
                block.contextMenu = function () {
                };
                block.children.forEach(function (child) {
                    child.contextMenu = function () {
                    };
                    child.children.forEach(function (grandchild) {
                        grandchild.contextMenu = function () {
                        };
                    });
                });
                block.mouseClickLeft = function () {
                    //hide all other blocks from palette
                    var toHide = sprite.freshPalette('events').children[0].children;
                    var holder = [];
                    toHide.forEach(function (item) {
                        if (item instanceof BlockMorph) {
                            if (item.selector == block.selector) {
                                item.mouseClickLeft = CommandBlockMorph.prototype.rootForGrab;
                                item.rootForGrab = CommandBlockMorph.prototype.rootForGrab;
                                holder.push(item);
                            }
                        }
                    });
                    myself.currentSprite.blocksCache['events'] = holder;
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
                    events.reactToDropOf = function (morph, hand) {
                        morph.snap(hand);

                        if (morph.nextBlock() == null && morph.topBlock() == morph) {
                            morph.destroy();
                        }
                        else {
                            var script = morph.topBlock();
                            myself.corralBar.tabBar.tabTo('Sprites');
                            myself.sprites.asArray().forEach(function (sprite) {
                                if (sprite.name == script.spriteName) {
                                    myself.selectSprite(sprite);
                                }
                            });
                        }
                    }
                    events.children = [];
                    var hiddenEvents = events.fullCopy();
                    hiddenEvents.reactToDropOf = events.reactToDropOf;
                    var hidden = {};
                    var sprites = {};
                    var objects = {};
                    if (this.selector == 'receiveKey') {
                        var key = this.children[1].children[0].text;
                        myself.sprites.asArray().forEach(function (sprite) {
                            sprite.allHatBlocksForKey(key).forEach(function (script) {
                                var sprite = script.parentThatIsA(ScriptsMorph).owner;
                                var block = script;
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
                        myself.sprites.asArray().forEach(function (sprite) {
                            sprite.allHatBlocksFor(message).forEach(function (script) {
                                var sprite = script.parentThatIsA(ScriptsMorph).owner;
                                var block = script;//.fullCopy();

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
                    keys.forEach(function (key) {
                        if (sprites[key] != undefined) {
                            var header = new SpriteIconMorph(objects[key], false);
                            header.mouseClickLeft = function () {
                                myself.sprites.asArray().forEach(function (sprite) {
                                    if (key == sprite.name) {
                                        myself.corralBar.tabBar.tabTo('Sprites');
                                        myself.selectSprite(sprite);
                                    }
                                });

                            };
                            header.rootForGrab = function () {
                                return false;
                            };
                            header.userMenu = function () {
                                return null
                            };
                            events.add(header);
                            header.setPosition(new Point(x, y));
                            x = 0;
                            y = header.center().y;
                            sprites[key].forEach(function (script) {
                                script.spriteName = key;
                                events.add(script);
                                script.setPosition(new Point(x + 65, y - 20));
                                y = y + script.stackHeight() + 10;
                            });
                        }
                    });
                    x = events.topLeft().x;
                    y = events.topLeft().y;
                    var keys = Object.keys(hidden);
                    keys.forEach(function (key) {
                        if (hidden[key] != undefined) {
                            var header = new SpriteIconMorph(objects[key], false);
                            header.mouseClickLeft = function () {
                                return true
                            };
                            header.rootForGrab = function () {
                                return false
                            };
                            header.userMenu = function () {
                                return null
                            };
                            hiddenEvents.add(header);
                            header.setPosition(new Point(x, y));
                            x = 0;//header.center().x;
                            y = header.center().y;
                            hidden[key].forEach(function (script) {
                                script.spriteName = key;
                                hiddenEvents.add(script);
                                script.setPosition(new Point(x + 65, y - 20));
                                y = y + script.stackHeight() + 10;
                            });
                        }
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
            }
        });

    }

    this.sprites.asArray().forEach(function (morph) {
        template = new SpriteIconMorph(morph, template);
        if (myself.currentSpriteTab == 'Sprites') {
            if (!morph.isInert)
                frame.contents.add(template);
        }
        if (myself.currentSpriteTab == 'hiddenSprites') {
            if (morph.isInert) {
                frame.contents.add(template);
            }
        }
        //frame.contents.add(template);
    });

    this.corral.frame = frame;
    this.corral.add(frame);

    this.corral.fixLayout = function () {
        if (this.stageIcon) {
            this.stageIcon.setCenter(this.center());
            this.stageIcon.setLeft(this.left() + padding);
            this.frame.setLeft(this.stageIcon.right() + padding);
        }
        this.frame.setExtent(new Point(
                this.right() - this.frame.left(),
            this.height()
        ));
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

    this.corral.wantsDropOf = function (morph) {
        /*
         if (morph instanceof CommandBlockMorph) {
         corral.remove(morph);
         morph.destroy();
         return true;
         }
         */
        return morph instanceof SpriteIconMorph;
    };

    this.corral.reactToDropOf = function (morph) { //this.corral.reactToDropOf = function (spriteIcon) {
        if (morph instanceof CommandBlockMorph) {
            morph.slideBackTo(this.world().hand.grabOrigin);
            morph.destroy();
        }
        var idx = 1,
            pos = morph.position();//pos = spriteIcon.position();
        morph.destroy();//spriteIcon.destroy();
        this.frame.contents.children.forEach(function (icon) {
            if (pos.gt(icon.position()) || pos.y > icon.bottom()) {
                idx += 1;
            }
        });
        myself.sprites.add(morph.object, idx);//myself.sprites.add(spriteIcon.object, idx);
        myself.createCorral();
        myself.fixLayout();
    };
};

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
            this.stage.setScale(Math.floor(Math.min(
                (this.width() - padding * 2) / this.stage.dimensions.x,
                (this.height() - this.controlBar.height() * 2 - padding * 2)
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
    if (!(this.projectName === string))
    {
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

IDE_Morph.prototype.droppedImage = function (aCanvas, name) {
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

    this.currentSprite.addCostume(costume);
    this.currentSprite.wearCostume(costume);
    this.spriteBar.tabBar.tabTo('costumes');
    this.hasChangedMedia = true;
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

IDE_Morph.prototype.droppedText = function (aString, name, existingMessage) {
    var lbl = name ? name.split('.')[0] : '';
    if (aString.indexOf('<project') === 0) {
        return this.openProjectString(aString);
    }
    if (aString.indexOf('<snapdata') === 0) {
        return this.openCloudDataString(aString, existingMessage);
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

    if (suffix.toLowerCase() !== 'ypr') {return; }

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
        ypr.onload = function () {loadYPR(anArrayBuffer, name); };
        document.head.appendChild(ypr);
        ypr.src = 'ypr.js';
    } else {
        loadYPR(anArrayBuffer, name);
    }
};

// IDE_Morph helper function to change button color based on button actions
IDE_Morph.prototype.changeButtonColor = function (buttonAction) {

	if (buttonAction == "pressReady")
	{
		this.controlBar.goButton.labelColor = new Color(0, 200, 0);
    }
    else if (buttonAction == "pressStart")
    {
    	this.controlBar.goButton.labelColor = new Color (125, 125, 125);
    	//this.controlBar.getReadyButton.labelColor = new Color (125, 125, 125);
    	//this.controlBar.getReadyButton.drawNew();
    	//this.controlBar.getReadyButton.fixLayout();
    }
    else if (buttonAction == "stopAllScripts" || buttonAction == "fileChange")
    {
    	this.controlBar.goButton.labelColor = new Color (125, 125, 125);
    	//this.controlBar.getReadyButton.labelColor = new Color(84, 255, 159);
   		//this.controlBar.getReadyButton.drawNew();
    	//this.controlBar.getReadyButton.fixLayout();
    }
    this.controlBar.goButton.drawNew();
    this.controlBar.goButton.fixLayout();
}


// IDE_Morph button actions

IDE_Morph.prototype.refreshPalette = function (shouldIgnorePosition) {
    var oldTop = this.palette.contents.top();

    this.createPalette();
    this.fixLayout('refreshPalette');
    if (!shouldIgnorePosition) {
        this.palette.contents.setTop(oldTop);
    }
};

IDE_Morph.prototype.addComment = function() {
    new CommentMorph().pickUp(this.world());
};

IDE_Morph.prototype.pressStart = function () { //click for goButton
    if (this.world().currentKey === 16 && this.allowTurbo == true) { // shiftClicked
        this.toggleFastTracking();
    } else {
    	if (this.currentState == 1)
    	{
    		this.changeButtonColor('pressStart');
        	this.runScripts('flag');
        	this.currentState = 2;
    	}
    }
};

IDE_Morph.prototype.pressReady = function () { // Click for getReadyButton
    this.stopAllScripts();
    if (this.currentState == 0) {
    	this.changeButtonColor('pressReady');
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
        this.stage.threads.resumeAll(this.stage);
    } else {
        this.stage.threads.pauseAll(this.stage);
    }
    this.controlBar.pauseButton.refresh();
};

IDE_Morph.prototype.isPaused = function () {
    if (!this.stage) {return false; }
    return this.stage.threads.isPaused();
};

IDE_Morph.prototype.stopAllScripts = function () {

	if ( this.currentState != 0)
	{
		this.changeButtonColor('stopAllScripts');
    	this.currentState = 0;
    }
    this.stage.fireStopAllEvent();

};

IDE_Morph.prototype.selectSprite = function (sprite) {
    if (sprite.isInert == true && !this.developer) {
        this.currentSprite = detect(
        this.stage.children,
        function (morph) { return (morph instanceof(SpriteMorph) && !(morph.isInert)); }
    ) || this.stage;
    }
    else {
        this.currentSprite = sprite;
    }
    if(!this.demoMode) {
        this.createCategories();
        this.createPalette();
        this.createSpriteBar();
        this.createSpriteEditor();
        this.corral.refresh();
        this.fixLayout('selectSprite');
        this.currentSprite.scripts.fixMultiArgs();

        if (!this.currentSprite instanceof StageMorph) {
            this.currentSprite.updateSize();
            this.currentSprite.updatePosition();
        }

        this.spriteBar.tabBar.tabTo('scripts');
    }

};

// IDE_Morph skins

IDE_Morph.prototype.defaultDesign = function () {
    this.setDefaultDesign();
    this.refreshIDE();
    this.removeSetting('design');
};
/*
IDE_Morph.prototype.flatDesign = function () {
    this.setFlatDesign();
    this.refreshIDE();
    this.saveSetting('design', 'flat');
};
*/

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

IDE_Morph.prototype.saveTask = function () {

    var str = this.serializer.serialize(this.stage),
        project = this.serializer.load(str),
        myself = this;
    $.getScript('analysis/'+ this.projectName + '.js'  , function (name) {
        var results = window[myself.projectName].analyzeThisProject(project); //keeps namespaces clean
        var toDisplay = window[myself.projectName].htmlwrapper(results);
        var str = '';
        toDisplay.forEach(function (entry) {
            str = str + entry; 
        });
        makePop(str);
    });
}

function makePop(str) {
    var canvasContainer = document.createElement('div');
    canvasContainer.id = 'results';
    document.body.appendChild(canvasContainer);
    canvasContainer.style.position = "absolute";
    canvasContainer.style.left = "80px";
    canvasContainer.style.top = "80px";
    canvasContainer.style.width = "75%";
    canvasContainer.style.height = "75%";
    canvasContainer.style.zIndex = "1000";

    myCanvas = document.createElement('canvas');
    myCanvas.style.width = window.innerWidth-200 + "px";
    myCanvas.style.height = window.innerHeight-200 + "px";
    // You must set this otherwise the canvas will be streethed to fit the container
    myCanvas.width = window.innerWidth-200;
    myCanvas.height = window.innerHeight-200; 
 
    myCanvas.style.overflow = 'visible';
    myCanvas.style.position = 'absolute';

    var context = myCanvas.getContext('2d');
    context.fillStyle = 'rgb(255,255,255)';
    context.fillRect(0, 0, myCanvas.width, myCanvas.height);

    var canvas = myCanvas; 
    var ctx = canvas.getContext('2d');

    var data = '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">' +
                   '<foreignObject width="100%" height="100%">' +
                   '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:20px">' +
                   str +
                   '</div>' +
                   '</foreignObject>' +
                 '</svg>';

    var DOMURL = window.URL || window.webkitURL || window;

    var img = new Image();
    var svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    var url = DOMURL.createObjectURL(svg);

    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        //DOMURL.revokeObjectURL(url);
    }

    img.src = url;

    canvasContainer.appendChild(myCanvas);
    myCanvas.parentNode.addEventListener('mousedown', onMouseClickOnMyCanvas, false);
}

function onMouseClickOnMyCanvas(e) {
    myCanvas.parentNode.style.visibility = 'hidden';
}

// IDE_Morph sprite list access

IDE_Morph.prototype.addNewSprite = function () {
    var sprite = new SpriteMorph(this.globalVariables),
        rnd = Process.prototype.reportRandom;
    if (this.currentSpriteTab != 'Sprites') {
        this.corralBar.tabBar.tabTo('Sprites');
    }
    this.stage.add(sprite);
    sprite.setName("Sprite");
    sprite.setCenter(this.stage.center());

    // randomize sprite properties
    sprite.setHue(rnd.call(this, 0, 100));
    sprite.setBrightness(rnd.call(this, 50, 100));
    //sprite.turn(rnd.call(this, 1, 360));
    sprite.setXPosition(rnd.call(this, 0, 440));
    sprite.setYPosition(rnd.call(this, 0, 320));

    this.sprites.add(sprite);
    this.corral.addSprite(sprite);
    this.selectSprite(sprite);
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
        function () {myself.removeSprite(sprite); },
        function () {
            sprite.addCostume(cos);
            sprite.wearCostume(cos);
        }
    );
};

IDE_Morph.prototype.pickSpriteList = function () {

    var myself = this,
        pos = this.controlBar.appModeButton.bottomLeft(),
        names = myself.getCostumesList('Costumes'),
        libMenu = new MenuMorph( myself, localize('Import Costumes') );

    function loadCostume(file, name) {
        var url = 'Costumes' + '/' + file,
            img = new Image();
        myself.addNewSprite();
        img.onload = function () {
            var canvas = newCanvas(new Point(img.width, img.height));
            canvas.getContext('2d').drawImage(img, 0, 0);
            myself.droppedImage(canvas, file);
        };
        img.src = url;
        myself.currentSprite.setName(name);
        myself.createSpriteBar();
    }

    names.forEach(function (line) {
        if (line.name.length > 0) {
            libMenu.addItem(
                line.name,
                function () {loadCostume(line.file, line.name); }
            );
        }
    });
    libMenu.popup(world, pos);
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

    if (idx < 1) {return; }

    this.currentSprite = detect(
        this.stage.children,
        function (morph) {return (morph instanceof SpriteMorph && (!morph.isInert || myself.developer)); } // fix for dev mode
    ) || this.stage;
    this.sprites.remove(this.sprites.asArray().indexOf(sprite) + 1);
    this.createCorral();
    this.fixLayout();
    this.selectSprite(this.currentSprite);
};

// IDE_Morph menus

IDE_Morph.prototype.userMenu = function () {
    var menu = new MenuMorph(this);
    menu.addItem('help', 'nop');
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

    SnapCloud.getMenuItems(shiftClicked).forEach(function(pair){
        if (pair){
            menu.addItem.apply(menu,pair);
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

    if (this.developer)
    {
    	menu.addLine();
        addPreference(
            'Allow importing sprites',
            'toggleSpriteImporting',
            myself.importableSprites,
            'uncheck to disallow students to import sprites',
            'check to allow students to import sprites'
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
			function () {myself.isAnimating = !myself.isAnimating; },
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
				MorphicPreferences.rasterizeSVGs =
					!MorphicPreferences.rasterizeSVGs;
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
				SpriteMorph.prototype.enableNesting =
					!SpriteMorph.prototype.enableNesting;
			},
			SpriteMorph.prototype.enableNesting,
			'uncheck to disable\nsprite composition',
			'check to enable\nsprite composition',
			true
		);
		menu.addLine(); // everything below this line is stored in the project
		addPreference(
			'Thread safe scripts',
			function () {stage.isThreadSafe = !stage.isThreadSafe; },
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
				SpriteMorph.prototype.useFlatLineEnds =
					!SpriteMorph.prototype.useFlatLineEnds;
			},
			SpriteMorph.prototype.useFlatLineEnds,
			'uncheck for round ends of lines',
			'check for flat ends of lines'
		);
		addPreference(
			'Codification support',
			function () {
				StageMorph.prototype.enableCodeMapping =
					!StageMorph.prototype.enableCodeMapping;
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

    menu = new MenuMorph(this);
    menu.addItem('Project notes...', 'editProjectNotes');

    if(this.developer || this.sandbox)
    {
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
					} else
					{
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
	}
    menu.addLine();
    menu.addItem(
        'Import...',
        function () {
            var inp = document.createElement('input');
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

    menu.addItem(
        shiftClicked ?
                'Export project as plain text...' : 'Export project...',
        function () {
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

	if (this.developer)
	{
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
			function () {myself.exportGlobalBlocks(); },
			'show global custom block definitions as XML\nin a new browser window'
		);
	}

    menu.addLine();
    if (this.developer)
    {
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
    if(StageMorph.prototype.inPaletteBlocks['tab-costumes'] == true) {
        menu.addItem(
                localize(graphicsName) + '...',
            function () {
                var dir = graphicsName,
                    names = myself.getCostumesList(dir),
                    libMenu = new MenuMorph(
                        myself,
                            localize('Import') + ' ' + localize(dir)
                    );

                function loadCostume(name) {
                    var url = dir + '/' + name,
                        img = new Image();
                    img.onload = function () {
                        var canvas = newCanvas(new Point(img.width, img.height));
                        canvas.getContext('2d').drawImage(img, 0, 0);
                        myself.droppedImage(canvas, name);
                    };
                    img.src = url;
                }

                names.forEach(function (line) {
                    if (line.name.length > 0) {
                        libMenu.addItem(
                            line.name,
                            function () {
                                loadCostume(line.file);
                            }
                        );
                    }
                });
                libMenu.popup(world, pos);
            },
            'Select a costume from the media library'
        );
    }
    if(StageMorph.prototype.inPaletteBlocks['tab-sounds'] == true) {
        menu.addItem(
            localize('Sounds') + '...',
            function () {
                var names = this.getCostumesList('Sounds'),
                    libMenu = new MenuMorph(this, 'Import sound');

                function loadSound(name) {
                    var url = 'Sounds/' + name,
                        audio = new Audio();
                    audio.src = url;
                    audio.load();
                    myself.droppedAudio(audio, name);
                }

                names.forEach(function (line) {
                    if (line.name.length > 0) {
                        libMenu.addItem(
                            line.name,
                            function () {loadSound(line.file); }
                        );
                    }
                });
                libMenu.popup(world, pos);
            },
            'Select a sound from the media library'
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
    //alert(this.currentTab);
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
                             child.labelColor = new Color(200,0,0);
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
    }

// IDE_Morph menu actions

IDE_Morph.prototype.aboutSnap = function () {
    var dlg, aboutTxt, noticeTxt, creditsTxt, versions = '', translations,
        module, btn1, btn2, btn3, btn4, licenseBtn, translatorsBtn,
        world = this.world();

    aboutTxt = 'Snap! 4.0\nBuild Your Own Blocks\n\n--- beta ---\n\n'
        + 'Copyright \u24B8 2014 Jens M\u00F6nig and '
        + 'Brian Harvey\n'
        + 'jens@moenig.org, bh@cs.berkeley.edu\n\n'

        + 'Snap! is developed by the University of California, Berkeley\n'
        + '          with support from the National Science Foundation '
        + 'and MioSoft.   \n'

        + 'The design of Snap! is influenced and inspired by Scratch,\n'
        + 'from the Lifelong Kindergarten group at the MIT Media Lab\n\n'

        + 'for more information see http://snap.berkeley.edu\n'
        + 'and http://scratch.mit.edu';

    noticeTxt = localize('License')
        + '\n\n'
        + 'Snap! is free software: you can redistribute it and/or modify\n'
        + 'it under the terms of the GNU Affero General Public License as\n'
        + 'published by the Free Software Foundation, either version 3 of\n'
        + 'the License, or (at your option) any later version.\n\n'

        + 'This program is distributed in the hope that it will be useful,\n'
        + 'but WITHOUT ANY WARRANTY; without even the implied warranty of\n'
        + 'MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\n'
        + 'GNU Affero General Public License for more details.\n\n'

        + 'You should have received a copy of the\n'
        + 'GNU Affero General Public License along with this program.\n'
        + 'If not, see http://www.gnu.org/licenses/';

    creditsTxt = localize('Contributors')
        + '\n\nNathan Dinsmore: Saving/Loading, Snap-Logo Design, '
        + 'countless bugfixes'
        + '\nKartik Chandra: Paint Editor'
        + '\nIan Reynolds: UI Design, Event Bindings, '
        + 'Sound primitives'
        + '\nIvan Motyashov: Initial Squeak Porting'
        + '\nDavide Della Casa: Morphic Optimizations'
        + '\nAchal Dave: Web Audio'
        + '\nJoe Otto: Morphic Testing and Debugging';

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
    dlg.inform('About Snap', aboutTxt, world);
    btn1 = dlg.buttons.children[0];
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
    );
    btn2 = dlg.addButton(
        function () {
            dlg.body.text = aboutTxt;
            dlg.body.drawNew();
            btn1.show();
            btn2.hide();
            btn3.show();
            btn4.show();
            licenseBtn.show();
            translatorsBtn.hide();
            dlg.fixLayout();
            dlg.drawNew();
            dlg.setCenter(world.center());
        },
        'Back...'
    );
    btn2.hide();
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
    );
    btn4 = dlg.addButton(
        function () {
            dlg.body.text = creditsTxt;
            dlg.body.drawNew();
            btn1.show();
            btn2.show();
            translatorsBtn.show();
            btn3.hide();
            btn4.hide();
            licenseBtn.hide();
            dlg.fixLayout();
            dlg.drawNew();
            dlg.setCenter(world.center());
        },
        'Credits...'
    );
    translatorsBtn.hide();
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
        myself.projectNotes = text.text;
        ok.call(this);
    };

    dialog.justDropped = function () {
        text.edit();
    };

    dialog.labelString = 'Project Notes';
    dialog.createLabel();
    dialog.addBody(frame);
    frame.drawNew();
    dialog.addButton('ok', 'OK');
    dialog.addButton('cancel', 'Cancel');
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
    	var url = 'Costumes/octopi.png';
    	var img = new Image();
    	img.onload = function () {
            var canvas = newCanvas(new Point(img.width, img.height));
            canvas.getContext('2d').drawImage(img, 0, 0);
            myself.setCostumeFromImage(canvas, name);
    	};
    img.src = url;
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
        }
    ]);
    if(this.demoMode)
    {
        this.palette.destroy();
        this.spriteBar.destroy();
        this.corral.destroy();
    }
};

IDE_Morph.prototype.rawOpenProjectString = function (str) {
    this.toggleAppMode(this.demoMode);
    if(!this.demoMode) {
        this.spriteBar.tabBar.tabTo('scripts');
        this.corralBar.tabBar.tabTo('Sprites');
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

IDE_Morph.prototype.openCloudDataString = function (str, existingMessage) {
    var myself = this;
    if (typeof existingMessage != 'undefined')
    {
    	msg = existingMessage;
    }
    var msg,
        myself = this;
    this.nextSteps([
        function () {
        	if (! msg )
        	{
           		msg = myself.showMessage('Opening project...');
            }
        },
        function () {
            myself.rawOpenCloudDataString(str);
        },
        function () {
            msg.destroy();
            if(location.pathname.match(/\d+/) != null)
            {
                window.history.pushState('', '', myself.loadFileID);
            }
        }
    ]);
};

IDE_Morph.prototype.rawOpenCloudDataString = function (str) {
    var model;
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
        this.showMessage('opening project\n' + name);
        this.setProjectName(name);
        str = localStorage['-snap-project-' + name];
        this.openProjectString(str);
        //location.hash = '#open:' + str;
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
    SyntaxElementMorph.prototype.dynamicInputLabels =
        !SyntaxElementMorph.prototype.dynamicInputLabels;
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
    InputSlotDialogMorph.prototype.isLaunchingExpanded =
        !InputSlotDialogMorph.prototype.isLaunchingExpanded;
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
    //this.addNewSprite();
}

IDE_Morph.prototype.togglePlainPrototypeLabels = function () {
    BlockLabelPlaceHolderMorph.prototype.plainLabel =
        !BlockLabelPlaceHolderMorph.prototype.plainLabel;
    if (BlockLabelPlaceHolderMorph.prototype.plainLabel) {
        this.saveSetting('plainprototype', true);
    } else {
        this.removeSetting('plainprototype');
    }
};

IDE_Morph.prototype.togglePreferEmptySlotDrops = function () {
    ScriptsMorph.prototype.isPreferringEmptySlots =
        !ScriptsMorph.prototype.isPreferringEmptySlots;
};

IDE_Morph.prototype.toggleVirtualKeyboard = function () {
    MorphicPreferences.useVirtualKeyboard =
        !MorphicPreferences.useVirtualKeyboard;
};

IDE_Morph.prototype.toggleInputSliders = function () {
    MorphicPreferences.useSliderForInput =
        !MorphicPreferences.useSliderForInput;
};

IDE_Morph.prototype.toggleSliderExecute = function () {
    InputSlotMorph.prototype.executeOnSliderEdit =
        !InputSlotMorph.prototype.executeOnSliderEdit;
};

IDE_Morph.prototype.toggleAppMode = function (appMode) {
    var world = this.world(),
        elements = [
            this.logo,
            //this.controlBar.cloudButton,
            this.controlBar.projectButton,
            this.controlBar.settingsButton,
            this.controlBar.stageSizeButton,
            this.corral,
            this.corralBar,
            this.spriteEditor,
            this.spriteBar,
            this.palette,
            this.categories
        ];

    this.isAppMode = isNil(appMode) ? !this.isAppMode : appMode;

    Morph.prototype.trackChanges = false;
    if (this.isAppMode) {
        this.setColor(this.appModeColor);
        this.controlBar.setColor(this.color);
        this.controlBar.appModeButton.refresh();
        elements.forEach(function (e) {
            e.hide();
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
            e.show();
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
    if(this.isAppMode) //if changing to fullscreen, destroy corral
    {
        this.corral.destroy();
    }
    else //if changing to normal screen, create corral
    {
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
                myself.stageRatio = 0.5;
                myself.setExtent(world.extent());
                delete myself.step;
            }
        };
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
    }

    this.isSmallStage = isNil(isSmall) ? !this.isSmallStage : isSmall;
    if (this.isAnimating) {
        if (this.isSmallStage) {
            zoomIn();
        } else {
            zoomOut();
        }
    } else {
        if (this.isSmallStage) {this.stageRatio = 0.5; }
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
            function () {myself.setLanguage(lang); }
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
    if (callback) {callback.call(this); }
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
            'normal (1x)' : 1,
            'demo (1.2x)' : 1.2,
            'presentation (1.4x)' : 1.4,
            'big (2x)' : 2
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
            function () {myself.showMessage('saved.', 2); },
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
                var blob = new Blob([media],{type:'Application/xml'});
                saveAs(blob, name+'.xml');
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
                var blob = new Blob([str],{type:'Application/xml'});
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
                str =  this.serializer.serialize(this.stage);
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
            'Snap!Cloud' :
                'https://snapcloud.miosoft.com/miocon/app/' +
                    'login?_app=SnapCloud',
            'local network lab' :
                '192.168.2.107:8087/miocon/app/login?_app=SnapCloud',
            'local network office' :
                '192.168.186.146:8087/miocon/app/login?_app=SnapCloud',
            'localhost dev' :
                'localhost/miocon/app/login?_app=SnapCloud'
        }
    );
};

// IDE_Morph synchronous Http data fetching

IDE_Morph.prototype.getURL = function (url) {
    var request = new XMLHttpRequest(),
        myself = this;
    try {
        request.open('GET', url, false);
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
    this.task = task || 'open'; // String describing what do do (open, save)
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
    this.labelString = this.task === 'save' ? 'Save Project' : 'Open Project';
    this.createLabel();
    this.key = 'project' + task;

    // build contents
    this.buildContents();
    this.onNextStep = function () { // yield to show "updating" message
        myself.setSource(myself.source);
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

    this.addSourceButton('cloud', localize('Cloud'), 'cloud');
    this.addSourceButton('local', localize('Browser'), 'storage');
    if (this.task === 'open') {
        this.addSourceButton('examples', localize('Examples'), 'poster');
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
    this.preview.setExtent(
        this.ide.serializer.thumbnailSize.add(this.preview.edge * 2)
    );

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

    if (this.task === 'open') {
        this.addButton('openProject', 'Open');
        this.action = 'openProject';
    } else { // 'save'
        this.addButton('saveProject', 'Save');
        this.action = 'saveProject';
    }
    this.shareButton = this.addButton('shareProject', 'Share');
    this.unshareButton = this.addButton('unshareProject', 'Unshare');
    this.shareButton.hide();
    this.unshareButton.hide();
    this.deleteButton = this.addButton('deleteProject', 'Delete');
    this.addButton('cancel', 'Cancel');

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

ProjectDialogMorph.prototype.addSourceButton = function (
    source,
    label,
    symbol
) {
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

// ProjectDialogMorph ops

ProjectDialogMorph.prototype.setSource = function (source) {
    var myself = this,
        msg;

    this.source = source; //this.task === 'save' ? 'local' : source;
    this.srcBar.children.forEach(function (button) {
        button.refresh();
    });
    switch (this.source) {
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
    }

    this.listField.destroy();
    this.listField = new ListMorph(
        this.projectList,
        this.projectList.length > 0 ?
                function (element) {
                    return element.name;
                } : null,
        null,
        function () {myself.ok(); }
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

            if (item === undefined) {return; }
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
    } else { // 'examples', 'cloud' is initialized elsewhere
        this.listField.action = function (item) {
            var src, xml;
            if (item === undefined) {return; }
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
                function (proj) {return proj.Public === 'true'; }
            ]
        ],
        function () {myself.ok(); }
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
        if (item === undefined) {return; }
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
    if (!proj) {return; }
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
    SnapCloud.rawOpenProject(proj, myself.ide);
    this.destroy();
};

ProjectDialogMorph.prototype.saveProject = function () {
    var name = this.nameField.contents().text.text,
        file_id = null,
        notes = this.notesText.text,
        myself = this;

    if (file_id === null && this.nameField.contents().hasBeenEdited ){
        file_id = '';
    }
    if (file_id === null && this.listField.selected){
        file_id = this.listField.selected.file_id;
    }
    if (file_id === null && this.ide.projectId ) {
        file_id = this.ide.projectId;
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
                    ) + '\n"' + name + " ("+file_id+ ')"?',
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
                    function (item) {return item.name === name; }
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

ProjectDialogMorph.prototype.saveCloudProject = function () {
    var myself = this;
    this.ide.showMessage('Saving project\nto the cloud...');
    SnapCloud.saveProject(
        this.ide,
        function () {
            myself.ide.source = 'cloud';
            myself.ide.showMessage('saved.', 2);
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

        this.notesField.setTop(this.preview.bottom() + thin);
        this.notesField.setLeft(this.preview.left());
        this.notesField.setHeight(
            this.body.bottom() - this.preview.bottom() - thin
        );
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
        var ide = myself.parentThatIsA(IDE_Morph);

        if (ide) {
            ide.selectSprite(myself.object);
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
        var x = this.center().x+20;
        var y = this.center().y+25;
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
    if ((this.object instanceof SpriteMorph) || this.object instanceof StageMorph){
            displayName = this.object.name;
    }
    else{
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
    var button, myself = this;

    if (this.rotationButton) {
        this.rotationButton.destroy();
        this.roationButton = null;
    }
    if (!this.object.anchor) {
        return;
    }

    button = new ToggleButtonMorph(
        null, // colors,
        null, // target
        function () {
            myself.object.rotatesWithAnchor =
                !myself.object.rotatesWithAnchor;
        },
        [
            '\u2192',
            '\u21BB'
        ],
        function () {  // query
            return myself.object.rotatesWithAnchor;
        }
    );

    button.corner = 8;
    button.labelMinExtent = new Point(11, 11);
    button.padding = 0;
    button.pressColor = button.color;
    button.drawNew();
    // button.hint = 'rotate synchronously\nwith anchor';
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
        if(!ide.demoMode) {
            ide.createCorral();
            ide.fixLayout();
            ide.corral.refresh();
        }

    }
};

// SpriteIconMorph layout

SpriteIconMorph.prototype.fixLayout = function () {
    if (!this.thumbnail || !this.label) {return null; }

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
            },
            'open a new window\nwith a picture of the stage'
        );
        return menu;
    }
    if (!(this.object instanceof SpriteMorph)) {return null; }
    menu.addItem("show", 'showSpriteOnStage');
    if (this.parentThatIsA(IDE_Morph).developer) {
        if (this.object.isLocked == false) {
            menu.addItem("lock", function () {
                myself.object.isLocked = true;
                myself.object.changed();
                myself.object.drawNew();
                myself.object.changed();
                this.parentThatIsA(IDE_Morph).selectSprite(this.parentThatIsA(IDE_Morph).currentSprite);

            });
        }
        else {
            menu.addItem("unlock", function () {
                myself.object.isLocked = false;
                myself.object.changed();
                myself.object.drawNew();
                myself.object.changed();
                this.parentThatIsA(IDE_Morph).selectSprite(this.parentThatIsA(IDE_Morph).currentSprite);
            });
        }
    }
    menu.addLine();
    if (this.object.isResettable) {
        menu.addItem("restore", 'restoreSprite');
    }
    menu.addItem("duplicate", 'duplicateSprite');
    if ((this.object.devName == undefined) || this.object.parentThatIsA(IDE_Morph).developer) {
        menu.addItem("delete", 'removeSprite');
    }
    menu.addLine();
    if (this.object.anchor) {
        menu.addItem(
            localize('detach from') + ' ' + this.object.anchor.name,
            function () {myself.object.detachFromAnchor(); }
        );
    }
    if (this.object.parts.length) {
        menu.addItem(
            'detach all parts',
            function () {myself.object.detachAllParts(); }
        );
    }
    menu.addItem("export...", 'exportSprite');

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
    var ide = this.parentThatIsA(IDE_Morph);
    if (morph instanceof BlockMorph) {
        if(morph.isFrozen == false || ide.developer) {
            this.copyStack(morph);
        }
    } else if (morph instanceof CostumeIconMorph) {
        this.copyCostume(morph.object);
    } else if (morph instanceof SoundIconMorph) {
        this.copySound(morph.object);
    }
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
    a self-updating thumbnail of the costume I'm respresenting, and a
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
            ide.currentSprite.wearCostume(myself.object);
        }
        if (wardrobe) {
            wardrobe.updateSelection();
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
    if (!(this.object instanceof Costume)) {return null; }
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
    menu.addItem("duplicate", "duplicateCostume");
    if (this.object.status == true) {
    	menu.addItem("delete", "removeCostume");
    }
    menu.addLine();
    menu.addItem("export", "exportCostume");
    return menu;
};

CostumeIconMorph.prototype.editCostume = function () {
    if (this.object instanceof SVG_Costume) {
        this.object.editRotationPointOnly(this.world());
    } else {
        this.object.edit(
            this.world(),
            this.parentThatIsA(IDE_Morph)
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
                costume.name = ide.currentSprite.getNextCostumeName(answer);
                costume.version = Date.now();
                ide.hasChangedMedia = true;
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
    }
};

CostumeIconMorph.prototype.removeCostume = function () {
    var wardrobe = this.parentThatIsA(WardrobeMorph),
        idx = this.parent.children.indexOf(this),
        ide = this.parentThatIsA(IDE_Morph);
    if (wardrobe.sprite.costumes.length() == 0) {
    	return;
    }
    var numButtons = (this.parent.children.length - 3)/wardrobe.sprite.costumes.length();
    var costumeIndex = (idx - 3)/numButtons + 1;
    wardrobe.removeCostumeAt(costumeIndex+1);
    if (ide.currentSprite.costume === this.object) {
        ide.currentSprite.wearCostume(null);
    }
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
        paintbutton;

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

	var ide = this.parentThatIsA(IDE_Morph);

	if (ide && ide.currentSprite instanceof StageMorph) {
		txt = new TextMorph(localize('Add a new background'));
        icon = new TurtleIconMorph(this.sprite);
        icon.setPosition(new Point(x, y));
        myself.addContents(icon);
        y = icon.bottom() + padding;
	}
	else {
   		txt = new TextMorph(localize('Add a new costume'));
   	}
    txt.fontSize = 14;
    txt.setColor(SpriteMorph.prototype.paletteTextColor);

    txt.setPosition(new Point(x, y));
    this.addContents(txt);
    y = txt.bottom() + 4*padding;

    paintbutton = new PushButtonMorph(
        this,
        "paintNew",
        new SymbolMorph("brush", 15)
    );
    paintbutton.padding = 0;
    paintbutton.corner = 12;
    paintbutton.color = IDE_Morph.prototype.groupColor;
    paintbutton.highlightColor = IDE_Morph.prototype.frameColor.darker(50);
    paintbutton.pressColor = paintbutton.highlightColor;
    paintbutton.labelMinExtent = new Point(36, 18);
    paintbutton.labelShadowOffset = new Point(-1, -1);
    paintbutton.labelShadowColor = paintbutton.highlightColor;
    paintbutton.labelColor = TurtleIconMorph.prototype.labelColor;
    paintbutton.contrast = this.buttonContrast;
    paintbutton.drawNew();
    if (ide && ide.currentSprite instanceof StageMorph) {
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

    this.sprite.costumes.asArray().forEach(function (costume) {
    	template = icon = new CostumeIconMorph(costume, template);
        icon.setPosition(new Point(x, y));
        myself.addContents(icon);

        // adding new buttons for each costume
        var buttonCoor = [icon.right() + 2*padding, y];
		var button;

		if (costume.locked == false) {
			if (ide && ide.currentSprite instanceof StageMorph) {
				button = myself.addCostumeButton(icon, 'edit', "edit this background",
        									"editCostume", buttonCoor)
        		buttonCoor[1] = button.bottom() + padding;
        		button= myself.addCostumeButton(icon, 'delete', 'delete this background',
        									"removeCostume", buttonCoor);
        		buttonCoor[1] = button.bottom() + padding;
        		button = myself.addCostumeButton(icon, 'rename', 'rename this background',
        									"renameCostume", buttonCoor)
        		buttonCoor = [button.right() + 3*padding, y];

			}
			else {
        		button = myself.addCostumeButton(icon, 'edit', "edit this costume",
        									"editCostume", buttonCoor)
        		buttonCoor[1] = button.bottom() + padding;
        		button= myself.addCostumeButton(icon, 'delete', 'delete this costume',
        									"removeCostume", buttonCoor);
        		buttonCoor[1] = button.bottom() + padding;
        		button = myself.addCostumeButton(icon, 'rename', 'rename this costume',
        									"renameCostume", buttonCoor)
        		buttonCoor = [button.right() + 3*padding, y];
        	}
        }
        if (ide && ide.currentSprite instanceof StageMorph) {
        	button = myself.addCostumeButton(icon, 'export', 'export this background',
        									"exportCostume", buttonCoor)
        	buttonCoor[1] = button.bottom() + padding;
        	button = myself.addCostumeButton(icon, 'duplicate',
        									'make a copy of this background',
        									"duplicateCostume", buttonCoor)
		}
        else {
        	button = myself.addCostumeButton(icon, 'export', 'export this costume',
        									"exportCostume", buttonCoor)
        	buttonCoor[1] = button.bottom() + padding;
        	button = myself.addCostumeButton(icon, 'duplicate',
        									'make a copy of this costume',
        									"duplicateCostume", buttonCoor)
        }
        buttonCoor = [button.right() + 3*padding, y];

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
        padlock.hint = 'The sprite can be dragged\n around in the stage';
        padlock.label.isBold = false;
        padlock.label.setColor(this.buttonLabelColor);
        padlock.color = ide.tabColors[0];
        padlock.highlightColor = ide.tabColors[0];
        padlock.pressColor = ide.tabColors[1];

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
	var x,y;
	button = new PushButtonMorph(
        icon,
        action,
        name
    );
    button.setPosition(new Point(coor[0], coor[1]));
    button.fixLayout();
    this.addContents(button);
    return button;
};

WardrobeMorph.prototype.updateSelection = function () {
    this.contents.children.forEach(function (morph) {
        if (morph.refresh) {morph.refresh(); }
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

WardrobeMorph.prototype.paintNew = function () {
    var ide = this.parentThatIsA(IDE_Morph),
        string = ide.currentSprite.getNextCostumeName("Untitled");
        var cos = new Costume(newCanvas(), string),
        ide = this.parentThatIsA(IDE_Morph),
        myself = this;
    cos.edit(this.world(), ide, true, null, function () {
        myself.sprite.addCostume(cos);
        myself.updateList();
        if (ide) {
            ide.currentSprite.wearCostume(cos);
        }
    });
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
    if (!(this.object instanceof Sound)) { return null; }
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
        idx = this.parent.children.indexOf(this);
    jukebox.removeSound(idx);
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
        'import a sound from your computer\nby dragging it into here'
    ));

    txt.fontSize = 9;
    txt.setColor(SpriteMorph.prototype.paletteTextColor);
    txt.setPosition(new Point(x, y));//y+30));//new Point(x, y));
    this.addContents(txt);
    y = txt.bottom() + padding;

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

JukeboxMorph.prototype.updateSelection = function () {
    this.contents.children.forEach(function (morph) {
        if (morph.refresh) {morph.refresh(); }
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
