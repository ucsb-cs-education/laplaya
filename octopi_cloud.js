/*

    cloud.js

    a backend API for SNAP!

    written by Jens Mönig

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

*/

// Global settings /////////////////////////////////////////////////////

/*global modules, IDE_Morph, SnapSerializer, hex_sha512, alert, nop*/

modules.cloud = '2014-January-09';

// Global stuff

var Cloud;

var SnapCloud = new Cloud(
    'https://snapcloud.miosoft.com/miocon/app/login?_app=SnapCloud'
);

// Cloud /////////////////////////////////////////////////////////////

function Cloud(url) {
    this.username = null;
    this.password = null; // hex_sha512 hashed
    this.url = url;
    this.session = null;
    this.api = {
        getProjectList: { method: 'GET', url: "/student_portal/snap/saves/snapsave.json"} ,
        getProject: { method: 'GET', url: "/student_portal/snap/saves/snapsave/:id:.xml", regexes: {id: /:id:/}}
    }
}

Cloud.prototype.clear = function () {
    this.username = null;
    this.password = null;
    this.session = null;
    this.api = {};
};

Cloud.prototype.rawOpenProject = function(proj, ide) {
    var myself = this;
    myself.callService(
        'getProject',
        function (response) {
            ide.source = 'cloud';
            ide.droppedText(response);
//                    if (proj.Public === 'true') {
//                        location.hash = '#present:Username=' +
//                            encodeURIComponent(SnapCloud.username) +
//                            '&ProjectName=' +
//                            encodeURIComponent(proj.ProjectName);
//                    }
        },
        ide.cloudError(),
        {id: proj.ProjectName}
    );
};

Cloud.prototype.getPublicProject = function (
    id,
    callBack,
    errorCall
) {
    // id is Username=username&projectName=projectname,
    // where the values are url-component encoded
    // callBack is a single argument function, errorCall take two args
    var request = new XMLHttpRequest(),
        responseList,
        myself = this;
    try {
        request.open(
            "GET",
            (this.hasProtocol() ? '' : 'http://')
                + this.url + 'Public'
                + '&'
                + id,
            true
        );
        request.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );
        request.withCredentials = true;
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.responseText) {
                    if (request.responseText.indexOf('ERROR') === 0) {
                        errorCall.call(
                            this,
                            request.responseText
                        );
                    } else {
                        responseList = myself.parseResponse(
                            request.responseText
                        );
                        callBack.call(
                            null,
                            responseList[0].SourceCode
                        );
                    }
                } else {
                    errorCall.call(
                        null,
                        myself.url + 'Public',
                        'could not connect to:'
                    );
                }
            }
        };
        request.send(null);
    } catch (err) {
        errorCall.call(this, err.toString(), 'Snap!Cloud');
    }
};

Cloud.prototype.saveProject = function (ide, callBack, errorCall) {
    var myself = this,
        pdata,
        media;

    ide.serializer.isCollectingMedia = true;
    pdata = ide.serializer.serialize(ide.stage);
    media = ide.hasChangedMedia ?
            ide.serializer.mediaXML(ide.projectName) : null;
    ide.serializer.isCollectingMedia = false;
    ide.serializer.flushMedia();

    // check if serialized data can be parsed back again
    try {
        ide.serializer.parse(pdata);
    } catch (err) {
        ide.showMessage('Serialization of program data failed:\n' + err);
        throw new Error('Serialization of program data failed:\n' + err);
    }
    if (media !== null) {
        try {
            ide.serializer.parse(media);
        } catch (err) {
            ide.showMessage('Serialization of media failed:\n' + err);
            throw new Error('Serialization of media failed:\n' + err);
        }
    }
    ide.serializer.isCollectingMedia = false;
    ide.serializer.flushMedia();

    myself.callService(
        'saveProject',
        function (response, url) {
            callBack.call(null, response, url);
            ide.hasChangedMedia = false;
        },
        errorCall,
        [
            ide.projectName,
            pdata,
            media,
            pdata.length,
            media ? media.length : 0
        ]
    );
};

Cloud.prototype.getProjectList = function (callBack, errorCall) {
    this.callService(
        'getProjectList',
        function (response, url) {
            response = $.parseJSON(response);
            callBack.call(null, response, url);
        },
        errorCall
    );
};

// Cloud: backend communication

Cloud.prototype.callURL = function (url, callBack, errorCall) {
    // both callBack and errorCall are optional two-argument functions
    var request = new XMLHttpRequest(),
        myself = this;
    try {
        request.open('GET', url, true);
        request.withCredentials = true;
        request.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );
        request.setRequestHeader('MioCracker', this.session);
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.responseText) {
                    var responseList = myself.parseResponse(
                        request.responseText
                    );
                    callBack.call(null, responseList, url);
                } else {
                    errorCall.call(
                        null,
                        url,
                        'no response from:'
                    );
                }
            }
        };
        request.send(null);
    } catch (err) {
        errorCall.call(this, err.toString(), url);
    }
};

Cloud.prototype.callService = function (
    serviceName,
    callBack,
    errorCall,
    args
) {
    // both callBack and errorCall are optional two-argument functions
    var request = new XMLHttpRequest(),
        service = this.api[serviceName],
        myself = this,
        postDict;

    if (!service) {
        errorCall.call(
            null,
            'service ' + serviceName + ' is not available',
            'API'
        );
        return;
    }
    url = service.url
    if (args && Object.keys(args).length > 0) {
        postDict = {};
        if (service.parameters) {
            service.parameters.forEach(function (parm, idx) {
                postDict[parm] = args[idx];
            });
        }
        if (service.regexes) {
            for (key in service.regexes){
                url = url.replace(service.regexes[key], args[key]);
            }
        }
    }
    try {
        request.open(service.method, url, true);
        request.withCredentials = true;
        request.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
        );
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status == 200 && request.responseText && request.responseText.indexOf('<body') == -1) {
                    callBack.call(null, request.responseText, url);
                }
                else {
                    errorCall.call(
                        this,
                            'Invalid request. HTML Response: ' + request.status,
                            'Service: ' + serviceName
                    );
                    return;
                }
            }
        };
        request.send(this.encodeDict(postDict));
    } catch (err) {
        errorCall.call(this, err.toString(), service.url);
    }
};

// Cloud: payload transformation

Cloud.prototype.parseAPI = function (src) {
    var api = {},
        services;
    services = src.split(" ");
    services.forEach(function (service) {
        var entries = service.split("&"),
            serviceDescription = {},
            parms;
        entries.forEach(function (entry) {
            var pair = entry.split("="),
                key = decodeURIComponent(pair[0]).toLowerCase(),
                val = decodeURIComponent(pair[1]);
            if (key === "service") {
                api[val] = serviceDescription;
            } else if (key === "parameters") {
                parms = val.split(",");
                if (!(parms.length === 1 && !parms[0])) {
                    serviceDescription.parameters = parms;
                }
            } else {
                serviceDescription[key] = val;
            }
        });
    });
    return api;
};

Cloud.prototype.getMenuItems = function(advancedOptions) {
    var result = []
    if (advancedOptions) {
        result.push([
            'url...',
            'setCloudURL',
            null,
            new Color(100, 0, 0)
        ]);
        result.push(null);
    }
    if (!SnapCloud.username) {
        result.push([
            'Login...',
            'initializeCloud'
        ]);
        result.push([
            'Signup...',
            'createCloudAccount'
        ]);
        result.push([
            'Reset Password...',
            'resetCloudPassword'
        ]);
    } else {
        result.push([
            'Logout',
            'logout'
        ]);
        result.push([
            'Change Password...',
            'changeCloudPassword'
        ]);
    }
    if (advancedOptions) {
        result.push(null);
        result.push([
            'open shared project from cloud...',
            function () {
                myself.prompt('Author name…', function (usr) {
                    myself.prompt('Project name...', function (prj) {
                        var id = 'Username=' +
                            encodeURIComponent(usr.toLowerCase()) +
                            '&ProjectName=' +
                            encodeURIComponent(prj);
                        myself.showMessage(
                            'Fetching project\nfrom the cloud...'
                        );
                        SnapCloud.getPublicProject(
                            id,
                            function (projectData) {
                                var msg;
                                if (!Process.prototype.isCatchingErrors) {
                                    window.open(
                                            'data:text/xml,' + projectData
                                    );
                                }
                                myself.nextSteps([
                                    function () {
                                        msg = myself.showMessage(
                                            'Opening project...'
                                        );
                                    },
                                    function () {
                                        myself.rawOpenCloudDataString(
                                            projectData
                                        );
                                    },
                                    function () {
                                        msg.destroy();
                                    }
                                ]);
                            },
                            myself.cloudError()
                        );

                    }, null, 'project');
                }, null, 'project');
            },
            null,
            new Color(100, 0, 0)
            ]
        );
    }

    return result
};

Cloud.prototype.parseResponse = function (src) {
    var ans = [],
        lines;
    if (!src) {return ans; }
    lines = src.split(" ");
    lines.forEach(function (service) {
        var entries = service.split("&"),
            dict = {};
        entries.forEach(function (entry) {
            var pair = entry.split("="),
                key = decodeURIComponent(pair[0]),
                val = decodeURIComponent(pair[1]);
            dict[key] = val;
        });
        ans.push(dict);
    });
    return ans;
};

Cloud.prototype.parseDict = function (src) {
    var dict = {};
    if (!src) {return dict; }
    src.split("&").forEach(function (entry) {
        var pair = entry.split("="),
            key = decodeURIComponent(pair[0]),
            val = decodeURIComponent(pair[1]);
        dict[key] = val;
    });
    return dict;
};

Cloud.prototype.encodeDict = function (dict) {
    var str = '',
        pair,
        key;
    if (!dict) {return null; }
    for (key in dict) {
        if (dict.hasOwnProperty(key)) {
            pair = encodeURIComponent(key)
                + '='
                + encodeURIComponent(dict[key]);
            if (str.length > 0) {
                str += '&';
            }
            str += pair;
        }
    }
    return str;
};

// Cloud: user messages (to be overridden)

Cloud.prototype.message = function (string) {
    alert(string);
};
