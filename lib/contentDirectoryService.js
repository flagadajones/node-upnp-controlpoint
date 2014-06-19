var util = require('util'),
    EventEmitter = require('events').EventEmitter;
var soap2json = require('./soap2json');
var DOMParser = require('xmldom').DOMParser;
var TRACE = true;
var DETAIL = false;
var domParser = new DOMParser();
var xmlParsingOptions = {
    ignoreAttrs: true,
    explicitArray: false
};


/**
 * A UPnP MediaServer..
 */
var ContentDirectoryService = function (service) {
    EventEmitter.call(this);

    var self = this;
    this.service = service;

    //console.log(service);
    if (this.service) {
        this.service.on("TransferIDs", function (value) {
            if (TRACE && DETAIL) {
                console.log("ContentDirectoryService TransferIDs: " + JSON.stringify(value));
            }

        });

        this.service.on("SystemUpdateID", function (value) {
            if (TRACE && DETAIL) {
                console.log("ContentDirectoryService SystemUpdateID: " + JSON.stringify(value));
            }

        });

        this.service.on("ContainerUpdateIDs", function (value) {
            if (TRACE && DETAIL) {
                console.log("ContentDirectoryService ContainerUpdateIDs: " + JSON.stringify(value));
            }

        });
        this.service.subscribe(function (err, data) {
            //console.log("data",data);
            //console.log("error",err);
        });
    }

};

util.inherits(ContentDirectoryService, EventEmitter);

ContentDirectoryService.serviceType = "urn:schemas-upnp-org:service:ContentDirectory:1";

/**
 * send state change to device
 */

ContentDirectoryService.prototype.getSearchCapabilities = function (cb) {
    var self = this;
    var args = {};
    this.service.callAction(ACTION_ContentDirectory_GetSearchCapabilities, args, function (err, buf) {
        if (err) {
            console.log(ACTION_ContentDirectory_GetSearchCapabilities + " got err when performing action: " + err + " => " + buf);
        } else {
            cb(soap2json.extractResponse(ACTION_ContentDirectory_GetSearchCapabilities, buf));
        }

    });

};
ContentDirectoryService.prototype.getSortCapabilities = function (cb) {
    var self = this;
    var args = {};
    this.service.callAction(ACTION_ContentDirectory_GetSortCapabilities, args, function (err, buf) {
        if (err) {
            console.log(ACTION_ContentDirectory_GetSortCapabilities + " got err when performing action: " + err + " => " + buf);
        } else {
            cb(soap2json.extractResponse(ACTION_ContentDirectory_GetSortCapabilities, buf));

        }

    });

};

ContentDirectoryService.prototype.getSystemUpdateID = function (cb) {
    var self = this;
    var args = {};
    this.service.callAction(ACTION_ContentDirectory_GetSystemUpdateID, args, function (err, buf) {
        if (err) {
            console.log(ACTION_ContentDirectory_GetSystemUpdateID + " got err when performing action: " + err + " => " + buf);
        } else {
            cb(soap2json.extractResponse(ACTION_ContentDirectory_GetSystemUpdateID, buf));

        }

    });

};

ContentDirectoryService.prototype.browse = function (objectId, browseFlag, filter, startingIndex, RequestedCount, SortCriteria, cb) {
    var self = this;
    var args = {
        ObjectID: objectId,
        BrowseFlag: browseFlag,
        Filter: filter,
        StartingIndex: startingIndex,
        RequestedCount: RequestedCount,
        SortCriteria: SortCriteria
    };
    this.service.callAction(ACTION_ContentDirectory_Browse, args, function (err, buf) {

        //    cb(soap2json.extractResponse(ACTION_ContentDirectory_Browse, buf));

        if (err) {
            console.log(ACTION_ContentDirectory_Browse + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse(ACTION_ContentDirectory_Browse, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};

exports.ContentDirectoryService = ContentDirectoryService;
//REQUIRED
const ACTION_ContentDirectory_GetSearchCapabilities = "GetSearchCapabilities";
const ACTION_ContentDirectory_GetSortCapabilities = "GetSortCapabilities";
const ACTION_ContentDirectory_GetSystemUpdateID = "GetSystemUpdateID";
const ACTION_ContentDirectory_Browse = "Browse";

//OPTIONNAL
const ACTION_ContentDirectory_Search = "Search";
const ACTION_ContentDirectory_CreateObject = "CreateObject";
const ACTION_ContentDirectory_DestroyObject = "DestroyObject";
const ACTION_ContentDirectory_UpdateObject = "UpdateObject";
const ACTION_ContentDirectory_ImportResource = "ImportResource";
const ACTION_ContentDirectory_ExportResource = "ExportResource";
const ACTION_ContentDirectory_StopTransfertResource = "StopTransfertResource";
const ACTION_ContentDirectory_GetTransferProgress = "GetTransferProgress";
const ACTION_ContentDirectory_DeleteResource = "DeleteResource";
const ACTION_ContentDirectory_CreateReference = "CreateReference";


exports.BROWSE_FLAG = {
    BrowseMetadata: "BrowseMetadata",
    BrowseDirectChildren: "BrowseDirectChildren"
};

/* ---------------------------------------------------------------------------------- */
const SOAP_ENV_PRE = "<?xml version=\"1.0\" encoding=\"utf-8\"?><s:Envelope \
xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" \
s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><s:Body>";

const SOAP_ENV_POST = "</s:Body></s:Envelope>";