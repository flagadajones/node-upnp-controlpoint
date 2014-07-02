var util = require('util'),
    EventEmitter = require('events').EventEmitter;
var TRACE = false;
var DETAIL = false;


/**
 * A UPnP MediaServer..
 */
var ContentDirectoryService = function (service) {
    EventEmitter.call(this);

    this.service = service;

    //console.log(service);
    if (this.service) {
        this.service.on("stateChange",function(value){
            console.log("ContentDirectoryService event:"/*+JSON.stringify(value)*/);
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

