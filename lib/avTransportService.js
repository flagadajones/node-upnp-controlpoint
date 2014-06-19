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



var AVTransportService = function (service) {
    EventEmitter.call(this);

    this.service = service;

    if (this.service) {
        this.service.on(EVENT_AVTransport_LastChange, function (value) {
            if (TRACE && DETAIL) {
                console.log("AVTransportService "+EVENT_AVTransport_LastChange+" : " + JSON.stringify(value));
            }

        });
        this.service.subscribe(function (err, data) {
            //console.log("data",data);
            //console.log("error",err);
        });
    }

};

util.inherits(AVTransportService, EventEmitter);

AVTransportService.serviceType = "urn:schemas-upnp-org:service:AVTransport:1";

/**
 * send state change to device
 */


AVTransportService.prototype.setAVTransportURI = function (instanceId,currentURI,currentURIMetaData, cb) {
    var args = {
    		InstanceID : instanceId,
    		CurrentURI:currentURI,
    		CurrentURIMetaData:currentURIMetaData
    };
    this.service.callAction( ACTION_AVTransport_SetAVTransportURI, args, function (err, buf) {

         if (err) {
            console.log( ACTION_AVTransport_SetAVTransportURI + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse( ACTION_AVTransport_SetAVTransportURI, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};

AVTransportService.prototype.getMediaInfo = function (instanceId, cb) {
    var args = {
    		InstanceID : instanceId
    };
    this.service.callAction(ACTION_AVTransport_GetMediaInfo, args, function (err, buf) {

         if (err) {
            console.log(ACTION_AVTransport_GetMediaInfo + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse(ACTION_AVTransport_GetMediaInfo, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};

AVTransportService.prototype.getTransportInfo = function (instanceId, cb) {
    var args = {
    		InstanceID : instanceId
    };
    this.service.callAction(ACTION_AVTransport_GetTransportInfo, args, function (err, buf) {

         if (err) {
            console.log(ACTION_AVTransport_GetTransportInfo + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse(ACTION_AVTransport_GetTransportInfo, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};

AVTransportService.prototype.getPositionInfo = function (instanceId, cb) {
    var args = {
    		InstanceID : instanceId
    };
    this.service.callAction(ACTION_AVTransport_GetPositionInfo, args, function (err, buf) {

         if (err) {
            console.log(ACTION_AVTransport_GetPositionInfo + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse(ACTION_AVTransport_GetPositionInfo, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};


AVTransportService.prototype.getDeviceCapabilities = function (instanceId, cb) {
    var args = {
    		InstanceID : instanceId
    };
    this.service.callAction(ACTION_AVTransport_GetDeviceCapabilities, args, function (err, buf) {

         if (err) {
            console.log(ACTION_AVTransport_GetDeviceCapabilities + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse(ACTION_AVTransport_GetDeviceCapabilities, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};
AVTransportService.prototype.getTransportSettings = function (instanceId, cb) {
    var args = {
    		InstanceID : instanceId
    };
    this.service.callAction(ACTION_AVTransport_GetTransportSettings, args, function (err, buf) {

         if (err) {
            console.log(ACTION_AVTransport_GetTransportSettings + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse(ACTION_AVTransport_GetTransportSettings, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};
AVTransportService.prototype.stop = function (instanceId, cb) {
    var args = {
    		InstanceID : instanceId
    };
    this.service.callAction(ACTION_AVTransport_Stop, args, function (err, buf) {

         if (err) {
            console.log(ACTION_AVTransport_Stop + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse(ACTION_AVTransport_Stop, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};
AVTransportService.prototype.play = function (instanceId,speed, cb) {
    var args = {
    		InstanceID : instanceId,
    		Speed:speed
    };
    this.service.callAction(ACTION_AVTransport_Play, args, function (err, buf) {

         if (err) {
            console.log(ACTION_AVTransport_Play + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse(ACTION_AVTransport_Play, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};

AVTransportService.prototype.seek = function (instanceId,unit,target, cb) {
    var args = {
    		InstanceID : instanceId,
    		Unit:unit,
    		Target:target
    };
    this.service.callAction(ACTION_AVTransport_Seek, args, function (err, buf) {

         if (err) {
            console.log(ACTION_AVTransport_Seek + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse(ACTION_AVTransport_Seek, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};

AVTransportService.prototype.next = function (instanceId, cb) {
    var args = {
    		InstanceID : instanceId
    };
    this.service.callAction(ACTION_AVTransport_Next, args, function (err, buf) {

         if (err) {
            console.log(ACTION_AVTransport_Next + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse(ACTION_AVTransport_Next, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};

AVTransportService.prototype.previous = function (instanceId, cb) {
    var args = {
    		InstanceID : instanceId
    };
    this.service.callAction(ACTION_AVTransport_Previous, args, function (err, buf) {

         if (err) {
            console.log(ACTION_AVTransport_Previous + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse(ACTION_AVTransport_Previous, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};


AVTransportService.prototype.setNextAVTransportURI = function (instanceId,nextURI,nextURIMetaData, cb) {
    var args = {
    		InstanceID : instanceId,
    		NextURI:nextURI,
    		NextURIMetaData:nextURIMetaData
    };
    this.service.callAction( ACTION_AVTransport_SetNextAVTransportURI, args, function (err, buf) {

         if (err) {
            console.log( ACTION_AVTransport_SetNextAVTransportURI + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse( ACTION_AVTransport_SetNextAVTransportURI, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};


AVTransportService.prototype.pause = function (instanceId, cb) {
    var args = {
    		InstanceID : instanceId
    };
    this.service.callAction(ACTION_AVTransport_Pause, args, function (err, buf) {

         if (err) {
            console.log(ACTION_AVTransport_Pause + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse(ACTION_AVTransport_Pause, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};

AVTransportService.prototype.record = function (instanceId, cb) {
    var args = {
    		InstanceID : instanceId
    };
    this.service.callAction(ACTION_AVTransport_Record, args, function (err, buf) {

         if (err) {
            console.log(ACTION_AVTransport_Record + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse(ACTION_AVTransport_Record, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};

AVTransportService.prototype.setPlayMode = function (instanceId,newPlayMode, cb) {
    var args = {
    		InstanceID : instanceId,
    		NewPlayMode:newPlayMode
    };
    this.service.callAction(ACTION_AVTransport_SetPlayMode, args, function (err, buf) {

         if (err) {
            console.log(ACTION_AVTransport_SetPlayMode + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse(ACTION_AVTransport_SetPlayMode, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};

AVTransportService.prototype.setRecordQualityMode = function (instanceId,newRecordQualityMode, cb) {
    var args = {
    		InstanceID : instanceId,
    		NewRecordQualityMode:newRecordQualityMode
    };
    this.service.callAction(ACTION_AVTransport_SetRecordQualityMode, args, function (err, buf) {

         if (err) {
            console.log(ACTION_AVTransport_SetRecordQualityMode + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse(ACTION_AVTransport_SetRecordQualityMode, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};

AVTransportService.prototype.getCurrentTransportActions = function (instanceId, cb) {
    var args = {
    		InstanceID : instanceId
    };
    this.service.callAction(ACTION_AVTransport_GetCurrentTransportActions, args, function (err, buf) {

         if (err) {
            console.log(ACTION_AVTransport_GetCurrentTransportActions + " got err when performing action: " + err + " => " + buf);
        } else {
            var json = soap2json.extractResponse(ACTION_AVTransport_GetCurrentTransportActions, buf);
            var xmlDIDL = domParser.parseFromString(json.Result, 'text/xml');
            json.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
            cb(json);
        }

    });

};

exports.AVTransportService = AVTransportService;

//EVENTS
const EVENT_AVTransport_LastChange = "LastChange";

//ACTIONS
//REQUIRED
const ACTION_AVTransport_SetAVTransportURI = "SetAVTransportURI";
const ACTION_AVTransport_GetMediaInfo = "GetMediaInfo";
const ACTION_AVTransport_GetTransportInfo = "GetTransportInfo";
const ACTION_AVTransport_GetPositionInfo = "GetPositionInfo";
const ACTION_AVTransport_GetDeviceCapabilities = "GetDeviceCapabilities";
const ACTION_AVTransport_GetTransportSettings = "GetTransportSettings";
const ACTION_AVTransport_Stop = "Stop";
const ACTION_AVTransport_Play = "Play";
const ACTION_AVTransport_Seek = "Seek";
const ACTION_AVTransport_Next = "Next";
const ACTION_AVTransport_Previous = "Previous";

//OPTIONNAL
const ACTION_AVTransport_SetNextAVTransportURI = "SetNextAVTransportURI";
const ACTION_AVTransport_Pause = "Pause";
const ACTION_AVTransport_Record = "Record";
const ACTION_AVTransport_SetPlayMode = "SetPlayMode";
const ACTION_AVTransport_SetRecordQualityMode = "SetRecordQualityMode";
const ACTION_AVTransport_GetCurrentTransportActions = "GetCurrentTransportActions";



/* ---------------------------------------------------------------------------------- */
const SOAP_ENV_PRE = "<?xml version=\"1.0\" encoding=\"utf-8\"?><s:Envelope \
xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" \
s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><s:Body>";

const SOAP_ENV_POST = "</s:Body></s:Envelope>";