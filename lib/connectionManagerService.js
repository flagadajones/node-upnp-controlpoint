var util = require('util'),
    EventEmitter = require('events').EventEmitter;
var TRACE = false;
var DETAIL = false;



/**
 * A UPnP MediaServer..
 */
var ConnectionManagerService = function (service) {
    EventEmitter.call(this);

    this.service = service;


    if (this.service) {
        this.service.on("stateChange",function(value){
            console.log("ConnectionManagerService event:"/*+JSON.stringify(value)*/);
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

