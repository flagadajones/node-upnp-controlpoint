var util = require('util'),
    EventEmitter = require('events').EventEmitter;
var parseString = require('xml2js').parseString;
var connectionManagerService = require('./connectionManagerService');
var contentDirectoryService = require('./contentDirectoryService');
var avTransportService = require('./avTransportService');
var soap2json = require('./soap2json');
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
    console.log(this.device);
    for (name in this.device.services) {
    
    	var service = this.device.services[name];
        switch (service.serviceType) {
        case contentDirectoryService.ContentDirectoryService.serviceType:
            self.contentDirectoryService = new contentDirectoryService.ContentDirectoryService(service);
            break;
        case connectionManagerService.ConnectionManagerService.serviceType:
            self.connectionManagerService = new connectionManagerService.ConnectionManagerService(service);
            break;
        case avTransportService.AVTransportService.serviceType:
            self.avTransportService = new avTransportService.AVTransportService(service);
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
    this.connectionManagerService.getProtocolInfo(value);
};
//NOT IMPLEMENTED
MediaServer.prototype.prepareForConnection = function (connectionId) {
    this.connectionManagerService.prepareForConnection(connectionId);
};
MediaServer.prototype.connectionComplete = function (connectionId) {
    this.connectionManagerService.connectionComplete(connectionId);
};
MediaServer.prototype.getCurrentConnectionInfo = function (connectionId) {
    this.connectionManagerService.getCurrentConnectionInfo(connectionId);
};
MediaServer.prototype.getCurrentConnectionIDs = function (value) {
    this.connectionManagerService.getCurrentConnectionIDs(value);
};



/**
 * ContentDirectory Service
 */

MediaServer.prototype.getSearchCapabilities = function (cb) {
    this.contentDirectoryService.getSearchCapabilities(cb);
};

MediaServer.prototype.getSortCapabilities = function (cb) {
    this.contentDirectoryService.getSortCapabilities(cb);
};

MediaServer.prototype.getSystemUpdateID = function (cb) {
    this.contentDirectoryService.getSystemUpdateID(cb);
};

MediaServer.prototype.browse = function (objectId, browseFlag, filter, startingIndex, RequestedCount, SortCriteria, cb) {
    this.contentDirectoryService.browse(objectId, browseFlag, filter, startingIndex, RequestedCount, SortCriteria, cb);
};
MediaServer.prototype.callAction = function(serviceId,actionName,args,callback){
	this.device._callAction(serviceId,actionName,args,function(err,result) {
		    	var json = soap2json.extractResponse(actionName, result);
		        if (err) {
		        	console.log(actionName + " got err when performing action: " + err + " => " + result);
		        } 
//		        	else {
//		            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
//		            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
//		        }
		        callback(json);

		    });
};





exports.devices = [MediaServer];
exports.MediaServer = MediaServer;


//ContentDirectory
exports.BROWSE_FLAG = contentDirectoryService.BROWSE_FLAG;

//REQUIRED
//SERVICE_TYPE_ContentDirectoryService
//SERVICE_TYPE_ConnectionManagerService
//OPTIONAL
//SERVICE_TYPE_AvTransport


/* ---------------------------------------------------------------------------------- */
const SOAP_ENV_PRE = "<?xml version=\"1.0\" encoding=\"utf-8\"?><s:Envelope \
xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" \
s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><s:Body>";

const SOAP_ENV_POST = "</s:Body></s:Envelope>";