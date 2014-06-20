var util = require('util'),
    EventEmitter = require('events').EventEmitter;
var parseString = require('xml2js').parseString;
var TRACE = true;
var DETAIL = false;

var xmlParsingOptions = {
    ignoreAttrs: true,
    explicitArray: false
};


/**
 * A UPnP MediaServer..
 */
var ConnectionManagerService = function (service) {
    EventEmitter.call(this);

    this.service = service;


    if (this.service) {
        this.service.on(ConnectionManagerService.events.SourceProtocolInfo, function (value) {
            console.log("Connection service SourceProtocolInfo: " + JSON.stringify(value));
        });
        this.service.on(ConnectionManagerService.events.SinkProtocolInfo, function (value) {
            console.log("Connection service SinkProtocolInfo: " + JSON.stringify(value));
        });
        this.service.on(ConnectionManagerService.events.CurrentConnectionIDs, function (value) {
            console.log("Connection service CurrentConnectionIDs: " + JSON.stringify(value));
        });
        this.service.subscribe(function (err, data) {
            //console.log("data",data);
            //console.log("error",err);
        });
    }

};

util.inherits(ConnectionManagerService, EventEmitter);

ConnectionManagerService.serviceType = "urn:schemas-upnp-org:service:ConnectionManager:1";
ConnectionManagerService.serviceUrn = "urn:upnp-org:serviceId:ConnectionManager";

//ACTIONS
ConnectionManagerService.actions = {};

ConnectionManagerService.actions.GetProtocolInfo = {
    name: "GetProtocolInfo"
};
ConnectionManagerService.actions.PrepareForConnection = {
    name: "PrepareForConnection"
};
ConnectionManagerService.actions.ConnectionComplete = {
    name: "ConnectionComplete"
};
ConnectionManagerService.actions.GetCurrentConnectionInfo = {
    name: "GetCurrentConnectionInfo"
};
ConnectionManagerService.actions.GetCurrentConnectionIDs = {
    name: "GetCurrentConnectionIDs"
};

//EVENTS

ConnectionManagerService.events = {};
ConnectionManagerService.events.SourceProtocolInfo = "SourceProtocolInfo";
ConnectionManagerService.events.SinkProtocolInfo = "SinkProtocolInfo";
ConnectionManagerService.events.CurrentConnectionIDs = "CurrentConnectionIDs";

exports.ConnectionManagerService = ConnectionManagerService;




/* ---------------------------------------------------------------------------------- */
const SOAP_ENV_PRE = "<?xml version=\"1.0\" encoding=\"utf-8\"?><s:Envelope \
xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" \
s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><s:Body>";

const SOAP_ENV_POST = "</s:Body></s:Envelope>";