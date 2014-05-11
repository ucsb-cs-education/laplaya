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
        getProjectList: {
            method: 'GET',
            url: "/student_portal/snap/saves/snap_files.json",
            requested_data_type: "json",
            expected_result: 200
        },
        getProject: {
            method: 'GET',
            url: "/student_portal/snap/saves/snap_files/:id:.xml",
            requested_data_type: "xml",
            regexes: {id: /:id:/},
            expected_result: 200
        },
        saveProject: {
            method: 'POST',
            url: "/student_portal/snap/saves/snap_files",
            requested_data_type: "json",
            data: 'data',
            expected_result: 201
        },
        patchProject: {
            method: 'PATCH',
            url: "/student_porta/snap/saves/snap_files/:id:.xml",
            requested_data_type: "json"
        }
    }
}

Cloud.prototype.clear = function () {
    this.username = null;
    this.password = null;
    this.session = null;
    this.api = {};
};

Cloud.prototype.rawOpenProject = function (proj, ide) {
    var myself = this;
    myself.callService(
        'getProject',
        function (response) {
            ide.source = 'cloud';
            ide.droppedText(response.documentElement.outerHTML);
// It might be useful to alter the URL like this for public saves, so that it is easier to link.... but
//                    if (proj.Public === 'true') {
//                        location.hash = '#present:Username=' +
//                            encodeURIComponent(SnapCloud.username) +
//                            '&ProjectName=' +
//                            encodeURIComponent(proj.ProjectName);
//                    }
        },
        ide.cloudError(),
        {id: proj.project_id}
    );
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
        {data: {snap_project: { project_name: ide.projectName,
            snap_file_xml: pdata
//            media: media,
//            data_length: pdata.length,
//            media_length: media ? media.length : 0
        }}}
    );
};

Cloud.prototype.getProjectList = function (callBack, errorCall) {
    this.callService(
        'getProjectList',
        function (response, url) {
            $.map( response, function(val, i){
                val['ProjectName'] = val['project_name'];
                });
            callBack.call(null, response, url);
        },
        errorCall
    );
};

// Cloud: backend communication

Cloud.prototype.callURL = function (url, callBack, errorCall) {
    // both callBack and errorCall are optional two-argument functions
    var myself = this;
    try {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'application/x-www-form-urlencoded',
            success: function (data, textStatus, jqXHR) {
                if (jqXHR.status == 200 && jqXHR.responseText ) {
                    callback.call(null, myself.parseResponse(jqXHR.responseText), url);
                }
                else {
                    errorCall.call(
                        this,
                        url,
                            'Invalid request. HTML Response: ' + jqXHR.status
                    );
                    return;
                }
            },
            error: function (data, textStatus, jqXHR) {
                errorCall.call(
                    this,
                    url,
                        'Invalid request. HTML Response: ' + jqXHR.status
                );
                return;
            }
            ,
            // TODO: Remove this! I think this is only necessary while we are jQuery from googleapi's rather than the
            // JQuery available through the Rails asset pipeline
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
            }

        });
    } catch (err) {
        errorCall.call(this, err.toString(), url);
    }
};

Cloud.prototype.callService = function (serviceName, callBack, errorCall, args) {
    // both callBack and errorCall are optional two-argument functions
    var service = this.api[serviceName],
        postDict;

    if (!service) {
        errorCall.call(
            null,
                'service ' + serviceName + ' is not available',
            'API'
        );
        return;
    }
    request_url = service.url
    request_data = null
    if (args && Object.keys(args).length > 0) {
        if (service.regexes) {
            for (key in service.regexes) {
                request_url = request_url.replace(service.regexes[key], args[key]);
            }
        }
        if (service.data){
            request_data = args[service.data]
        }
    }
    try {
        $.ajax({
            url: request_url,
            type: service.method,
            dataType: service.requested_data_type,
            data: request_data,
            success: function (data, textStatus, jqXHR) {
                if (jqXHR.status == service.expected_result && data && (!data.doctype || !(data.doctype.name === "html"))) {
                    callBack.call(null, data, request_url);
                }
                else {
                    errorCall.call(
                        this,
                            'Invalid request. HTML Response: ' + jqXHR.status,
                            'Service: ' + serviceName
                    );
                    return;
                }
            },
            error: function (data, textStatus, jqXHR) {
                errorCall.call(
                    this,
                        'Invalid request. HTML Response: ' + jqXHR.status,
                        'Service: ' + serviceName
                );
                return;
            }
            ,
            // TODO: Remove this! I think this is only necessary while we are jQuery from googleapi's rather than the
            // JQuery available through the Rails asset pipeline
            beforeSend: function(xhr) {
                xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))
            }

        });
    } catch (err) {
        errorCall.call(this, err.toString(), service.url);
    }
};

Cloud.prototype.getMenuItems = function (advancedOptions) {
    var result = [];
    return result
};

// Cloud: user messages (to be overridden)

Cloud.prototype.message = function (string) {
    alert(string);
};
