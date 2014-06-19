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
        this.service.on("SourceProtocolInfo", function (value) {
            if (TRACE && DETAIL) {
                console.log("Connection service SourceProtocolInfo: " + JSON.stringify(value));
            }

        });
        this.service.on("SinkProtocolInfo", function (value) {
            if (TRACE && DETAIL) {
                console.log("Connection service SinkProtocolInfo: " + JSON.stringify(value));
            }

        });
        this.service.on("CurrentConnectionIDs", function (value) {
            if (TRACE && DETAIL) {
                console.log("Connection service CurrentConnectionIDs: " + JSON.stringify(value));
            }

        });
        this.service.subscribe(function (err, data) {
            //console.log("data",data);
            //console.log("error",err);
        });
    }

};

util.inherits(ConnectionManagerService, EventEmitter);

ConnectionManagerService.serviceType = "urn:schemas-upnp-org:service:ConnectionManager:1";

/**
 * send state change to device
 */

ConnectionManagerService.prototype.getProtocolInfo = function (value) {
    var args = {};
    this.service.callAction(ACTION_ConnectionManager_GetProtocolInfo, args, function (err, buf) {
        if (err) {
            console.log(ACTION_ConnectionManager_GetProtocolInfo + " got err when performing action: " + err + " => " + buf);
        } else {
            if (TRACE && DETAIL) {
                parseString(buf, xmlParsingOptions, function (err, result) {
                    console.log(ACTION_ConnectionManager_GetProtocolInfo + " got SOAP reponse: " + JSON.stringify(result["s:Envelope"]["s:Body"]));
                });
            }

            // if success, can emit state change immediately
            //self.emit("BinaryState", v);
        }
    });

};
//NOT IMPLEMENTED
ConnectionManagerService.prototype.prepareForConnection = function (connectionId) {
    var args = {
        ConnectionID: connectionId
    };
    console.log(args);
    this.service.callAction(ACTION_ConnectionManager_PrepareForConnection, args, function (err, buf) {
        if (err) {
            console.log(ACTION_ConnectionManager_PrepareForConnection + " got err when performing action: " + err + " => " + buf);
        } else {

            if (TRACE && DETAIL) {
                parseString(buf, xmlParsingOptions, function (err, result) {
                    console.log(ACTION_ConnectionManager_PrepareForConnection + " got SOAP reponse: " + JSON.stringify(result["s:Envelope"]["s:Body"]));
                });
            }

            // if success, can emit state change immediately
            //self.emit("BinaryState", v);
        }
    });

};
ConnectionManagerService.prototype.connectionComplete = function (connectionId) {
    var args = {};
    this.service.callAction(ACTION_ConnectionManager_ConnectionComplete, args, function (err, buf) {
        if (err) {
            console.log(ACTION_ConnectionManager_ConnectionComplete + " got err when performing action: " + err + " => " + buf);
        } else {
            if (TRACE && DETAIL) {
                parseString(buf, xmlParsingOptions, function (err, result) {
                    console.log(ACTION_ConnectionManager_ConnectionComplete + " got SOAP reponse: " + JSON.stringify(result["s:Envelope"]["s:Body"]));
                });
            }

            // if success, can emit state change immediately
            //self.emit("BinaryState", v);
        }
    });

};
ConnectionManagerService.prototype.getCurrentConnectionInfo = function (connectionId) {
    var args = {
        ConnectionID: connectionId
    };

    this.service.callAction(ACTION_ConnectionManager_GetCurrentConnectionInfo, args, function (err, buf) {
        if (err) {
            console.log(ACTION_ConnectionManager_GetCurrentConnectionInfo + " got err when performing action: " + err + " => " + buf);
        } else {
            if (TRACE && DETAIL) {
                parseString(buf, xmlParsingOptions, function (err, result) {
                    console.log(ACTION_ConnectionManager_GetCurrentConnectionInfo + " got SOAP reponse: " + JSON.stringify(result["s:Envelope"]["s:Body"]));
                });

            }

            // if success, can emit state change immediately
            //self.emit("BinaryState", v);
        }
    });

};
ConnectionManagerService.prototype.getCurrentConnectionIDs = function (value) {
    var args = {};
    this.service.callAction(ACTION_ConnectionManager_GetCurrentConnectionIDs, args, function (err, buf) {
        if (err) {
            console.log(ACTION_ConnectionManager_GetCurrentConnectionIDs + " got err when performing action: " + err + " => " + buf);
        } else {
            if (TRACE && DETAIL) {
                parseString(buf, xmlParsingOptions, function (err, result) {
                    console.log(ACTION_ConnectionManager_GetCurrentConnectionIDs + " got SOAP reponse: " + JSON.stringify(result["s:Envelope"]["s:Body"]));
                });
            }


            // if success, can emit state change immediately
            //self.emit("BinaryState", v);
        }
    });

};

exports.ConnectionManagerService = ConnectionManagerService;


//EVENTS
const EVENT_ConnectionManager_SourceProtocolInfo="SourceProtocolInfo";
const EVENT_ConnectionManager_SinkProtocolInfo="SinkProtocolInfo";
const EVENT_ConnectionManager_CurrentConnectionIDs="CurrentConnectionIDs";

//ACTIONS
const ACTION_ConnectionManager_GetProtocolInfo = "GetProtocolInfo";
const ACTION_ConnectionManager_PrepareForConnection = "PrepareForConnection";
const ACTION_ConnectionManager_ConnectionComplete = "ConnectionComplete";
const ACTION_ConnectionManager_GetCurrentConnectionInfo = "GetCurrentConnectionInfo";
const ACTION_ConnectionManager_GetCurrentConnectionIDs = "GetCurrentConnectionIDs";


/* ---------------------------------------------------------------------------------- */
const SOAP_ENV_PRE = "<?xml version=\"1.0\" encoding=\"utf-8\"?><s:Envelope \
xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\" \
s:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><s:Body>";

const SOAP_ENV_POST = "</s:Body></s:Envelope>";