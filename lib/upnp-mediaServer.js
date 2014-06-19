var util = require('util'),
    EventEmitter = require('events').EventEmitter;
var parseString = require('xml2js').parseString;
var connectionManagerService = require('./connectionManagerService');
var contentDirectoryService = require('./contentDirectoryService');
var TRACE = true;
var DETAIL = true;

/**
 * A UPnP MediaServer..
 */
var MediaServer = function (device) {
    EventEmitter.call(this);
    //console.log(device);
    var self = this;
    this.device = device;
    this.eventService = null;
    this.contentDirectoryService = null;
    this.connectionManagerService = null;
    this.avTransportService = null;
    // find the basic event service in the device
    for (name in this.device.services) {
        var service = this.device.services[name];
        switch (service.serviceType) {
        case contentDirectoryService.ContentDirectoryService.serviceType:
            self.contentDirectoryService = new contentDirectoryService.ContentDirectoryService(service);
            break;
        case connectionManagerService.ConnectionManagerService.serviceType:
            self.connectionManagerService = new connectionManagerService.ConnectionManagerService(service);
            break;
        case SERVICE_TYPE_AvTransport:
            self.avTransportService = service;
            break;
        }
    };



};

util.inherits(MediaServer, EventEmitter);

MediaServer.deviceType = "urn:schemas-upnp-org:device:MediaServer:1";

/**
 * ConnectionManager Service
 */

MediaServer.prototype.getProtocolInfo = function (value) {
    var self = this;
    this.connectionManagerService.getProtocolInfo(value);
};
//NOT IMPLEMENTED
MediaServer.prototype.prepareForConnection = function (connectionId) {
    var self = this;
    this.connectionManagerService.prepareForConnection(connectionId);
};
MediaServer.prototype.connectionComplete = function (connectionId) {
    var self = this;
    this.connectionManagerService.connectionComplete(connectionId);
};
MediaServer.prototype.getCurrentConnectionInfo = function (connectionId) {
    var self = this;
    this.connectionManagerService.getCurrentConnectionInfo(connectionId);
};
MediaServer.prototype.getCurrentConnectionIDs = function (value) {
    var self = this;
    this.connectionManagerService.getCurrentConnectionIDs(value);
};



/**
 * ContentDirectory Service
 */

MediaServer.prototype.getSearchCapabilities = function (cb) {
    var self = this;
    this.contentDirectoryService.getSearchCapabilities(cb);
};

MediaServer.prototype.getSortCapabilities = function (cb) {
    var self = this;
    this.contentDirectoryService.getSortCapabilities(cb);
};

MediaServer.prototype.getSystemUpdateID = function (cb) {
    var self = this;
    this.contentDirectoryService.getSystemUpdateID(cb);
};

MediaServer.prototype.browse = function (objectId, browseFlag, filter, startingIndex, RequestedCount, SortCriteria, cb) {
    var self = this;
    this.contentDirectoryService.browse(objectId, browseFlag, filter, startingIndex, RequestedCount, SortCriteria, cb);
};






exports.devices = [MediaServer];
exports.MediaServer = MediaServer;


//ContentDirectory
exports.BROWSE_FLAG = contentDirectoryService.BROWSE_FLAG;

//REQUIRED
//OPTIONAL
const SERVICE_TYPE_AvTransport = "urn:schemas-upnp-org:service:AVTransport:1";


/* ---------------------------------------------------------------------------------- */
const SOAP_ENV_PRE = "<?xml version=\"1.0\" encoding=\"utf-8\"?><s:Envelope \
xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" \
s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><s:Body>";

const SOAP_ENV_POST = "</s:Body></s:Envelope>";