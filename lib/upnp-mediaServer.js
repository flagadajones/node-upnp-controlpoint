var util = require('util'),
    EventEmitter = require('events').EventEmitter;
var parseString = require('xml2js').parseString;
var ConnectionManagerService = require('./connectionManagerService').ConnectionManagerService;
var ContentDirectoryService = require('./contentDirectoryService').ContentDirectoryService;
var AVTransportService = require('./avTransportService').AVTransportService;
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
    this.services = {};
    //console.log(this.device);
    for (name in this.device.services) {
        var service = this.device.services[name];
        switch (service.serviceType) {
        case ContentDirectoryService.serviceType:
            self.services[name] = new ContentDirectoryService(service);
            break;
        case ConnectionManagerService.serviceType:
            self.services[name] = new ConnectionManagerService(service);
            break;
        case AVTransportService.serviceType:
            self.services[name] = new AVTransportService(service);
            break;

        }
    };



};

util.inherits(MediaServer, EventEmitter);

MediaServer.deviceType = "urn:schemas-upnp-org:device:MediaServer:1";



MediaServer.prototype.callAction = function (serviceId, action, args, callback) {
    if (!this.services[serviceId]) {
        callback({
            Error: {
                "errorCode": "404",
                "errorDescription": "Service Not implemented"
            }
        });
        return;
    }
    if (!this.services[serviceId].service.actions[action.name]) {
        callback({
            Error: {
                "errorCode": "404",
                "errorDescription": "Action Not Implemented"
            }
        });
        return;
    }
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

exports.MediaServer = MediaServer;



/* ---------------------------------------------------------------------------------- */
const SOAP_ENV_PRE = "<?xml version=\"1.0\" encoding=\"utf-8\"?><s:Envelope \
xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" \
s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><s:Body>";

const SOAP_ENV_POST = "</s:Body></s:Envelope>";