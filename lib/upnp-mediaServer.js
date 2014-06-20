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
    this.services = {}
    //console.log(this.device);
    for (name in this.device.services) {
        var service = this.device.services[name];
        switch (service.serviceType) {
        case contentDirectoryService.ContentDirectoryService.serviceType:
            self.services[name] = new contentDirectoryService.ContentDirectoryService(service);
            break;
        case connectionManagerService.ConnectionManagerService.serviceType:
            self.services[name] = new connectionManagerService.ConnectionManagerService(service);
            break;
        case avTransportService.AVTransportService.serviceType:
            self.services[name] = new avTransportService.AVTransportService(service);
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



MediaServer.prototype.callAction = function (serviceId, action, args, callback) {

    console.log(this.services[serviceId].service.actions);
    if (!this.services[serviceId]) {
        callback({
            Error: {
                "errorCode": "404",
                "errorDescription": "Service Not implemented"
            }
        });
        return;
    }
/*    if (!this.services[serviceId].service.actions[action.name]) {
        callback({
            Error: {
                "errorCode": "404",
                "errorDescription": "Action Not Implemented"
            }
        });
        return;
    }*/
    this.device._callAction(serviceId, action.name, args, function (err, result) {
        var json = soap2json.extractResponse(action.name, result);
        if (err) {
            console.log(action.name + " got err when performing action: " + err + " => " + result);
            callback(json);
        } else {
            if (action.callback) {
                action.callback(json, callback);
            } else {
                callback(json);
            }
        }

    });
};

exports.devices = [MediaServer];
exports.MediaServer = MediaServer;


//ContentDirectory
exports.BROWSE_FLAG = contentDirectoryService.BROWSE_FLAG;


/* ---------------------------------------------------------------------------------- */
const SOAP_ENV_PRE = "<?xml version=\"1.0\" encoding=\"utf-8\"?><s:Envelope \
xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" \
s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><s:Body>";

const SOAP_ENV_POST = "</s:Body></s:Envelope>";