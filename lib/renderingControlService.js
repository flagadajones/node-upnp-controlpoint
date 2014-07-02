var util = require('util'),
    EventEmitter = require('events').EventEmitter;
var TRACE = false;
var DETAIL = false;


/**
 * A UPnP MediaServer..
 */
var RenderingControlService = function (service) {
    EventEmitter.call(this);

    this.service = service;

    if (this.service) {
        this.service.on("stateChange", function (value) {
            console.log("RenderingControlService event:" /*+ JSON.stringify(value)*/);
        });
        this.service.subscribe(function (err, data) {
            //console.log("data",data);
            //console.log("error",err);
        });
    }

};

util.inherits(RenderingControlService, EventEmitter);

RenderingControlService.serviceType = "urn:schemas-upnp-org:service:RenderingControl:1";
RenderingControlService.serviceUrn = "urn:upnp-org:serviceId:RenderingControl";
/**
 * send state change to device
 */



exports.RenderingControlService = RenderingControlService;

//EVENTS
RenderingControlService.events = {};
RenderingControlService.events.LastChange = "LastChange";

//ACTIONS
//REQUIRED
RenderingControlService.actions = {};
RenderingControlService.actions.ListPresets = {
    name: "ListPresets"
};
RenderingControlService.actions.SelectPreset = {
    name: "SelectPreset"
};

//OPTIONNAL
RenderingControlService.actions.GetBrightness = {
    name: "GetBrightness"
};
RenderingControlService.actions.SetBrightness = {
    name: "SetBrightness"
};
RenderingControlService.actions.GetContrast = {
    name: "GetContrast"
};
RenderingControlService.actions.SetContrast = {
    name: "SetContrast"
};
RenderingControlService.actions.GetSharpness = {
    name: "GetSharpness"
};
RenderingControlService.actions.SetSharpness = {
    name: "SetSharpness"
};
RenderingControlService.actions.GetRedVideoGain = {
    name: "GetRedVideoGain"
};
RenderingControlService.actions.SetRedVideoGain = {
    name: "SetRedVideoGain"
};
RenderingControlService.actions.GetGreenVideoGain = {
    name: "GetGreenVideoGain"
};
RenderingControlService.actions.SetGreenVideoGain = {
    name: "SetGreenVideoGain"
};
RenderingControlService.actions.GetBlueVideoGain = {
    name: "GetBlueVideoGain"
};
RenderingControlService.actions.SetBlueVideoGain = {
    name: "SetBlueVideoGain"
};
RenderingControlService.actions.GetRedVideoBlackLevel = {
    name: "GetRedVideoBlackLevel"
};
RenderingControlService.actions.SetRedVideoBlackLevel = {
    name: "SetRedVideoBlackLevel"
};
RenderingControlService.actions.GetGreenVideoBlackLevel = {
    name: "GetGreenVideoBlackLevel"
};
RenderingControlService.actions.SetGreenVideoBlackLevel = {
    name: "SetGreenVideoBlackLevel"
};
RenderingControlService.actions.GetBlueVideoBlackLevel = {
    name: "GetBlueVideoBlackLevel"
};
RenderingControlService.actions.SetBlueVideoBlackLevel = {
    name: "SetBlueVideoBlackLevel"
};
RenderingControlService.actions.GetColorTemperature = {
    name: "GetColorTemperature"
};
RenderingControlService.actions.SetColorTemperature = {
    name: "SetColorTemperature"
};
RenderingControlService.actions.GetHorizontalKeystone = {
    name: "GetHorizontalKeystone"
};
RenderingControlService.actions.SetHorizontalKeystone = {
    name: "SetHorizontalKeystone"
};
RenderingControlService.actions.GetVerticalKeystone = {
    name: "GetVerticalKeystone"
};
RenderingControlService.actions.SetVerticalKeystone = {
    name: "SetVerticalKeystone"
};
RenderingControlService.actions.GetMute = {
    name: "GetMute"
};
RenderingControlService.actions.SetMute = {
    name: "SetMute"
};
RenderingControlService.actions.GetVolume = {
    name: "GetVolume"
};
RenderingControlService.actions.SetVolume = {
    name: "SetVolume"
};
RenderingControlService.actions.GetVolumeDB = {
    name: "GetVolumeDB"
};
RenderingControlService.actions.SetVolumeDB = {
    name: "SetVolumeDB"
};
RenderingControlService.actions.GetVolumeDBRange = {
    name: "GetVolumeDBRange"
};
RenderingControlService.actions.GetLoudness = {
    name: "GetLoudness"
};
RenderingControlService.actions.SetLoudness = {
    name: "SetLoudness"
};


