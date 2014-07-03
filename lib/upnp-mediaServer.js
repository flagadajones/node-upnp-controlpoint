var util = require('util'),
    EventEmitter = require('events').EventEmitter;

var ConnectionManagerService = require('./connectionManagerService').ConnectionManagerService;
var ContentDirectoryService = require('./contentDirectoryService').ContentDirectoryService;
var AVTransportService = require('./avTransportService').AVTransportService;

var soap2json = require('./soap2json');
var TRACE = false;
var DETAIL = false;

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
	  var servId = serviceId.split(":");

	  serviceId=servId[servId.length-1];
	
	//  console.log(serviceId);
	//	console.log(this.services);
		
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


