var util = require('util'),
    EventEmitter = require('events').EventEmitter;
var parseString = require('xml2js').parseString;
var connectionManagerService = require('./connectionManagerService');
var renderingControlService = require('./renderingControlService');
//var contentDirectoryService = require('./contentDirectoryService');
var TRACE = true;
var DETAIL = true;

/**
 * A UPnP MediaRenderer..
 */
var MediaRenderer = function (device) {
    EventEmitter.call(this);
    //console.log(device);
    var self = this;
    this.device = device;
    this.renderingControlService = null;
    this.connectionManagerService = null;
    this.avTransportService = null;
    // find the basic event service in the device

    for (name in this.device.services) {
        var service = this.device.services[name];
        switch (service.serviceType) {
        case renderingControlService.RenderingControlService.serviceType:
            self.renderingControlService = new renderingControlService.RenderingControlService(service);
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

util.inherits(MediaRenderer, EventEmitter);

MediaRenderer.deviceType = "urn:schemas-upnp-org:device:MediaRenderer:1";

/**
 * ConnectionManager Service
 */

MediaRenderer.prototype.getProtocolInfo = function (value) {
    this.connectionManagerService.getProtocolInfo(value);
};
//NOT IMPLEMENTED
MediaRenderer.prototype.prepareForConnection = function (connectionId) {
    this.connectionManagerService.prepareForConnection(connectionId);
};
MediaRenderer.prototype.connectionComplete = function (connectionId) {
    this.connectionManagerService.connectionComplete(connectionId);
};
MediaRenderer.prototype.getCurrentConnectionInfo = function (connectionId) {
    this.connectionManagerService.getCurrentConnectionInfo(connectionId);
};
MediaRenderer.prototype.getCurrentConnectionIDs = function (value) {
    this.connectionManagerService.getCurrentConnectionIDs(value);
};









exports.devices = [MediaRenderer];
exports.MediaRenderer = MediaRenderer;


//ContentDirectory
//exports.BROWSE_FLAG = contentDirectoryService.BROWSE_FLAG;

//REQUIRED
//SERVICE_TYPE_RenderingControl
//SERVICE_TYPE_ConnectionManager

//OPTIONAL
//SERVICE_TYPE_AvTransport



/* ---------------------------------------------------------------------------------- */
const SOAP_ENV_PRE = "<?xml version=\"1.0\" encoding=\"utf-8\"?><s:Envelope \
xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" \
s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><s:Body>";

const SOAP_ENV_POST = "</s:Body></s:Envelope>";