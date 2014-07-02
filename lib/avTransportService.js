var util = require('util'),
    EventEmitter = require('events').EventEmitter;
var TRACE = false;
var DETAIL = false;



var AVTransportService = function (service) {
    EventEmitter.call(this);

    this.service = service;

    if (this.service) {
        this.service.on("stateChange", function (value) {
            console.log("AVTransportService event:" /*+ JSON.stringify(value)*/);
        });
         this.service.subscribe(function (err, data) {
            //console.log("data",data);
            //console.log("error",err);
        });
    }

};

util.inherits(AVTransportService, EventEmitter);

AVTransportService.serviceType = "urn:schemas-upnp-org:service:AVTransport:1";
AVTransportService.serviceUrn = "urn:upnp-org:serviceId:AVTransport";

/**
 * send state change to device
 */


exports.AVTransportService = AVTransportService;

//EVENTS
AVTransportService.events = {};
AVTransportService.events.LastChange = "LastChange";

//ACTIONS
//REQUIRED
AVTransportService.actions = {};

AVTransportService.actions.SetAVTransportURI = {
    name: "SetAVTransportURI"
};
AVTransportService.actions.GetMediaInfo = {
    name: "GetMediaInfo"
};
AVTransportService.actions.GetTransportInfo = {
    name: "GetTransportInfo"
};
AVTransportService.actions.GetPositionInfo = {
    name: "GetPositionInfo"
};
AVTransportService.actions.GetDeviceCapabilities = {
    name: "GetDeviceCapabilities"
};
AVTransportService.actions.GetTransportSettings = {
    name: "GetTransportSettings"
};
AVTransportService.actions.Stop = {
    name: "Stop"
};
AVTransportService.actions.Play = {
    name: "Play"
};
AVTransportService.actions.Seek = {
    name: "Seek"
};
AVTransportService.actions.Next = {
    name: "Next"
};
AVTransportService.actions.Previous = {
    name: "Previous"
};

//OPTIONNAL
AVTransportService.actions.SetNextAVTransportURI = {
    name: "SetNextAVTransportURI"
};
AVTransportService.actions.Pause = {
    name: "Pause"
};
AVTransportService.actions.Record = {
    name: "Record"
};
AVTransportService.actions.SetPlayMode = {
    name: "SetPlayMode"
};
AVTransportService.actions.SetRecordQualityMode = {
    name: "SetRecordQualityMode"
};
AVTransportService.actions.GetCurrentTransportActions = {
    name: "GetCurrentTransportActions"
};

