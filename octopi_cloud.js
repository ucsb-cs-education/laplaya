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

var SnapCloud = new Cloud();

// Cloud /////////////////////////////////////////////////////////////

function Cloud(url) {
    this.username = null;
    this.password = null; // hex_sha512 hashed
    this.url = url;
    this.session = null;
    this.api = {
        getProjectList: {
            method: 'GET',
            url: "/laplaya_files",
            requested_data_type: "json",
            expected_result: 200
        },
        getProject: {
            method: 'GET',
            url: "/laplaya_files/:id:",
            requested_data_type: "json",
            regexes: {id: /:id:/},
            expected_result: 200
        },
        saveProject: {
            method: 'POST',
            url: "/laplaya_files",
            requested_data_type: "json",
            data: 'data',
            expected_result: 201
        },
        patchProject: {
            method: 'PATCH',
            url: "/laplaya_files/:id:",
            requested_data_type: "text",
            data: 'data',
            regexes: {id: /:id:/},
            expected_result: 204,
            null_response: true
        },
        deleteProject: {
            method: 'DELETE',
            url: "/laplaya_files/:id:",
            requested_data_type: "text",
            regexes: {id: /:id:/},
            expected_result: 204,
            null_response: true
        }

    }
}

Cloud.prototype.clear = function () {
    this.username = null;
    this.password = null;
    this.session = null;
    this.api = {};
};

Cloud.prototype.rawOpenProject = function (proj, ide, callback) {
    var myself = this;
    ide.loadFileID = proj.file_id;

    callback = typeof callback !== 'undefined' ? callback : function (){};
    myself.callService(
        'getProject',
        function (response) {
            ide.source = 'cloud';
            var instructions = response['instructions'];
            if (instructions) {
                if (instructions != null) {
                    var image = /img/,
                    reg = instructions.replace(/<(.*?)>/i, "");
                    if (image.test(instructions) || reg != "") {
                        ide.instructions = instructions;
                        ide.corralBar.tabBar.tabTo('instructions');
                    }
                    else {
                        ide.instructions = null;
                    }
                }
            } else {
                ide.instructions = null;
            }
            var data = response['project'];
            if (data) {
                if (response['media']) {
                    data = "<snapdata>" + data + response['media'] + "</snapdata>"
                }
                ide.droppedText(data, undefined,{callback: callback, existingMessage: proj.existingMessage});
            } else
            {
                ide.showMessage('').destroy();
            }
            ide.setProjectName(response['file_name']);
            if (response['can_update'] === true) {
                ide.setProjectId(response['file_id']);
                ide.hasChangedMedia = false;
            } else
            {
                ide.setProjectId(null);
                ide.hasChangedMedia = true;
            }
            var processor = response['analysis_processor'];
            if (processor){
                var exports = {};
                eval(processor);
                ide.analysisProcessor = exports.process;
            } else {
                ide.analysisProcessor = null;
            }

        },
        ide.cloudError(),
        {id: proj.file_id}
    );
};

Cloud.prototype.shareProject = function(proj, dialog, entry){
    if (proj) {
        dialog.ide.confirm(
                localize(
                    'Are you sure you want to publish'
                ) + '\n"' + proj.ProjectName + '"?',
            'Share Project',
            function () {
                dialog.ide.showMessage('sharing\nproject...');
                SnapCloud.callService(
                    'patchProject',
                    function () {
                        proj.Public = 'true';
                        entry.label.isBold = true;
                        entry.label.drawNew();
                        entry.label.changed();
                        dialog.ide.showMessage('shared.', 2);
                    },
                    dialog.ide.cloudError(),
                    {
                        id: proj.file_id,
                        data: { laplaya_file: {public: true} }
                    }
                );
            }
        );
    }
};

Cloud.prototype.unshareProject = function(proj, dialog, entry) {
    if (proj) {
        dialog.ide.confirm(
                localize(
                    'Are you sure you want to unpublish'
                ) + '\n"' + proj.ProjectName + '"?',
            'Unshare Project',
            function () {
                dialog.ide.showMessage('unsharing\nproject...');
                SnapCloud.callService(
                    'patchProject',
                    function () {
                        proj.Public = 'false';
                        entry.label.isBold = false;
                        entry.label.drawNew();
                        entry.label.changed();
                        dialog.ide.showMessage('unshared.', 2);
                    },
                    dialog.ide.cloudError(),
                    {
                        id: proj.file_id,
                        data: { laplaya_file: {public: false} }
                    }
                );
            }
        );
    }
};

Cloud.prototype.deleteProject = function(proj, dialog){
    if (proj) {
        dialog.ide.confirm(
                localize(
                    'Are you sure you want to delete'
                ) + '\n"' + proj.ProjectName + '"?',
            'Delete Project',
            function () {
                SnapCloud.callService(
                    'deleteProject',
                    function () {
                        dialog.ide.hasChangedMedia = true;
                        idx = dialog.projectList.indexOf(proj);
                        dialog.projectList.splice(idx, 1);
                        dialog.installCloudProjectList(
                            dialog.projectList
                        ); // refresh list
                    },
                    dialog.ide.cloudError(),
                    {id: proj.file_id}
                );
            }
        );
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
    newProject = ( ide.projectId === '' || ide.projectId === null);
    data = {data: {laplaya_file: {
        project: pdata
    }},
    id: ide.projectId
    };
    if (media !== null){
        data.data.laplaya_file.media = media
    }
    if (ide.feedback != undefined && ide.feedback != null) {
        data.data.laplaya_task.feeback = ide.feeback;
    }
    myself.callService(
        newProject ? 'saveProject' : 'patchProject',
        function (response, url) {
            callBack.call(null, response, url);
            ide.hasChangedMedia = false;
            if (newProject)
            {
                ide.setProjectId(response['file_id'])
            }
        },
        errorCall,
        data
    );
};

Cloud.prototype.getProjectList = function (callBack, errorCall) {
    this.callService(
        'getProjectList',
        function (response, url) {
            response = $.map( response, function(val, i){
                return {
                    ProjectName: val['file_name'],
                    Notes: val['note'],
                    Thumbnail: val['thumbnail'],
                    Updated: val['updated_at'],
                    Public: val['public'].toString(),
                    file_id: val['file_id']
                }
                });
            callBack.call(null, response, url);
        },
        errorCall
    );
};

Cloud.getDisplayName = function(element)
{
    return element.ProjectName + " (" + element.file_id + ")";
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
        request_url,
        request_data;

    if (!service) {
        errorCall.call(
            null,
                'service ' + serviceName + ' is not available',
            'API'
        );
        return;
    }
    request_url = service.url;
    request_data = null;
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
                if (
                    (jqXHR.status == service.expected_result) && (
                    ( service.null_response && !data )
                    ||
                    (data && (!data.doctype || !(data.doctype.name === "html")))
                    )) {
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
            error: function (jqXHR, textStatus, errorThrown) {
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
