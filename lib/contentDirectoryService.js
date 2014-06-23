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

    this.service = service;

    //console.log(service);
    if (this.service) {
        this.service.on(ContentDirectoryService.events.TransferIDs, function (value) {
            console.log("ContentDirectoryService TransferIDs: " + JSON.stringify(value));
        });

        this.service.on(ContentDirectoryService.events.SystemUpdateID, function (value) {
            console.log("ContentDirectoryService SystemUpdateID: " + JSON.stringify(value));
        });

        this.service.on(ContentDirectoryService.events.ContainerUpdateIDs, function (value) {
            console.log("ContentDirectoryService ContainerUpdateIDs: " + JSON.stringify(value));
        });

        this.service.subscribe(function (err, data) {
            //console.log("data",data);
            //console.log("error",err);
        });
    }

};

util.inherits(ContentDirectoryService, EventEmitter);

ContentDirectoryService.serviceType = "urn:schemas-upnp-org:service:ContentDirectory:1";
ContentDirectoryService.serviceUrn = "urn:upnp-org:serviceId:ContentDirectory";
ContentDirectoryService.actions = {};
ContentDirectoryService.actions.GetSearchCapabilities = {
    name: "GetSearchCapabilities"
};
ContentDirectoryService.actions.GetSortCapabilities = {
    name: "GetSortCapabilities"
};
ContentDirectoryService.actions.GetSystemUpdateID = {
    name: "GetSystemUpdateID"
};
ContentDirectoryService.actions.Browse = {
    name: "Browse"
    /*,
    callback: function (json, callback) {
        var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
        json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);        callback(json);
    }*/
};

//OPTIONNAL
ContentDirectoryService.actions.Search = {
    name: "Search"
};
ContentDirectoryService.actions.CreateObject = {
    name: "CreateObject"
};
ContentDirectoryService.actions.DestroyObject = {
    name: "DestroyObject"
};
ContentDirectoryService.actions.UpdateObject = {
    name: "UpdateObject"
};
ContentDirectoryService.actions.ImportResource = {
    name: "ImportResource"
};
ContentDirectoryService.actions.ExportResource = {
    name: "ExportResource"
};
ContentDirectoryService.actions.StopTransfertResource = {
    name: "StopTransfertResource"
};
ContentDirectoryService.actions.GetTransferProgress = {
    name: "GetTransferProgress"
};
ContentDirectoryService.actions.DeleteResource = {
    name: "DeleteResource"
};
ContentDirectoryService.actions.CreateReference = {
    name: "CreateReference"
};

//EVENTS
ContentDirectoryService.events = {};
ContentDirectoryService.events.TransferIDs = "TransferIDs";
ContentDirectoryService.events.SystemUpdateID = "SystemUpdateID";
ContentDirectoryService.events.ContainerUpdateIDs = "ContainerUpdateIDs";

ContentDirectoryService.BROWSE_FLAG = {
    BrowseMetadata: "BrowseMetadata",
    BrowseDirectChildren: "BrowseDirectChildren"
};


exports.ContentDirectoryService = ContentDirectoryService;

/* ---------------------------------------------------------------------------------- */
const SOAP_ENV_PRE = "<?xml version=\"1.0\" encoding=\"utf-8\"?><s:Envelope \
xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" \
s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><s:Body>";

const SOAP_ENV_POST = "</s:Body></s:Envelope>";