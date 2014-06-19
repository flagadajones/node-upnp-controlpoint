var util = require('util'),
    EventEmitter = require('events').EventEmitter;
var soap2json = require('./soap2json');
var DOMParser = require('xmldom').DOMParser;
var TRACE = true;
var DETAIL = false;
var domParser = new DOMParser();
var xmlParsingOptions = {
    ignoreAttrs: true,
    explicitArray: false
};


/**
 * A UPnP MediaServer..
 */
var RenderingControlService = function (service) {
    EventEmitter.call(this);

    this.service = service;

    //console.log(service);
    if (this.service) {
        this.service.on(EVENT_RenderingControl_LastChange, function (value) {
            if (TRACE && DETAIL) {
                console.log("RenderingControlService "+EVENT_RenderingControl_LastChange+" : " + JSON.stringify(value));
            }

        });
        this.service.subscribe(function (err, data) {
            //console.log("data",data);
            //console.log("error",err);
        });
    }

};

util.inherits(RenderingControlService, EventEmitter);

RenderingControlService.serviceType = "urn:schemas-upnp-org:service:RenderingControl:1";

/**
 * send state change to device
 */


RenderingControlService.prototype.listPresets = function (instanceId, cb) {
    var args = {
    		InstanceID : instanceId
    };
    this.service.callAction(ACTION_RenderingControl_ListPresets, args, function (err, buf) {

         if (err) {
            console.log(ACTION_RenderingControl_ListPresets + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse(ACTION_RenderingControl_ListPresets, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};

RenderingControlService.prototype.selectPreset = function (instanceId,presetName, cb) {
    var args = {
    		InstanceID : instanceId,
    		PresetName: presetName
    };
    this.service.callAction(ACTION_RenderingControl_SelectPreset, args, function (err, buf) {

         if (err) {
            console.log(ACTION_RenderingControl_SelectPreset + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse(ACTION_RenderingControl_SelectPreset, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};



exports.RenderingControlService = RenderingControlService;

//EVENTS
const EVENT_RenderingControl_LastChange = "LastChange";

//ACTIONS
//REQUIRED
const ACTION_RenderingControl_ListPresets = "ListPresets";
const ACTION_RenderingControl_SelectPreset = "SelectPreset";

//OPTIONNAL
const ACTION_RenderingControl_GetBrightness = "GetBrightness";
const ACTION_RenderingControl_SetBrightness = "SetBrightness";
const ACTION_RenderingControl_GetContrast = "GetContrast";
const ACTION_RenderingControl_SetContrast = "SetContrast";
const ACTION_RenderingControl_GetSharpness = "GetSharpness";
const ACTION_RenderingControl_SetSharpness = "SetSharpness";
const ACTION_RenderingControl_GetRedVideoGain = "GetRedVideoGain";
const ACTION_RenderingControl_SetRedVideoGain = "SetRedVideoGain";
const ACTION_RenderingControl_GetGreenVideoGain = "GetGreenVideoGain";
const ACTION_RenderingControl_SetGreenVideoGain = "SetGreenVideoGain";
const ACTION_RenderingControl_GetBlueVideoGain = "GetBlueVideoGain";
const ACTION_RenderingControl_SetBlueVideoGain = "SetBlueVideoGain";
const ACTION_RenderingControl_GetRedVideoBlackLevel = "GetRedVideoBlackLevel";
const ACTION_RenderingControl_SetRedVideoBlackLevel = "SetRedVideoBlackLevel";
const ACTION_RenderingControl_GetGreenVideoBlackLevel = "GetGreenVideoBlackLevel";
const ACTION_RenderingControl_SetGreenVideoBlackLevel = "SetGreenVideoBlackLevel";
const ACTION_RenderingControl_GetBlueVideoBlackLevel = "GetBlueVideoBlackLevel";
const ACTION_RenderingControl_SetBlueVideoBlackLevel = "SetBlueVideoBlackLevel";
const ACTION_RenderingControl_GetColorTemperature = "GetColorTemperature";
const ACTION_RenderingControl_SetColorTemperature = "SetColorTemperature";
const ACTION_RenderingControl_GetHorizontalKeystone = "GetHorizontalKeystone";
const ACTION_RenderingControl_SetHorizontalKeystone = "SetHorizontalKeystone";
const ACTION_RenderingControl_GetVerticalKeystone = "GetVerticalKeystone";
const ACTION_RenderingControl_SetVerticalKeystone = "SetVerticalKeystone";
const ACTION_RenderingControl_GetMute = "GetMute";
const ACTION_RenderingControl_SetMute = "SetMute";
const ACTION_RenderingControl_GetVolume = "GetVolume";
const ACTION_RenderingControl_SetVolume = "SetVolume";
const ACTION_RenderingControl_GetVolumeDB = "GetVolumeDB";
const ACTION_RenderingControl_SetVolumeDB = "SetVolumeDB";
const ACTION_RenderingControl_GetVolumeDBRange = "GetVolumeDBRange";
const ACTION_RenderingControl_GetLoudness = "GetLoudness";
const ACTION_RenderingControl_SetLoudness = "SetLoudness";


/* ---------------------------------------------------------------------------------- */
const SOAP_ENV_PRE = "<?xml version=\"1.0\" encoding=\"utf-8\"?><s:Envelope \
xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" \
s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><s:Body>";

const SOAP_ENV_POST = "</s:Body></s:Envelope>";