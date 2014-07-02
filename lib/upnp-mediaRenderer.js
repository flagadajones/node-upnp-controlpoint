var util = require('util'),
    EventEmitter = require('events').EventEmitter;

var ConnectionManagerService = require('./connectionManagerService').ConnectionManagerService;
var RenderingControlService = require('./renderingControlService').RenderingControlService;
var AVTransportService = require('./avTransportService').AVTransportService;
var soap2json = require('./soap2json');

var TRACE = false;
var DETAIL = false;

/**
 * A UPnP MediaRenderer..
 */
var MediaRenderer = function (device) {
    EventEmitter.call(this);
    //console.log(device);
    var self = this;
    this.device = device;
    this.services = {};
    // find the basic event service in the device

    for (name in this.device.services) {
        var service = this.device.services[name];
        switch (service.serviceType) {
        case RenderingControlService.serviceType:
            self.services[name] = new RenderingControlService(service);
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



util.inherits(MediaRenderer, EventEmitter);

MediaRenderer.deviceType = "urn:schemas-upnp-org:device:MediaRenderer:1";



MediaRenderer.prototype.callAction = function (serviceId, action, args, callback) {
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



exports.MediaRenderer = MediaRenderer;


//ContentDirectory
//exports.BROWSE_FLAG = contentDirectoryService.BROWSE_FLAG;

//REQUIRED
//SERVICE_TYPE_RenderingControl
//SERVICE_TYPE_ConnectionManager

//OPTIONAL
//SERVICE_TYPE_AvTransport


