var util = require('util'),
  EventEmitter = require('events').EventEmitter,
  http = require("http"),
  url = require("url"),
  xml2js = require('xml2js'),
  UpnpService = require("./upnp-service").UpnpService;

var TRACE = false;

/**
 * A UPnP device.
 *
 * controlPoint: the control-point object that will be used to manage this device object
 * uuid: unique identifier for the device
 * location: URL to the device
 * desc: an object containing details of the device
 * localAddress: the local IP address to use for callbacks into this service.
 */
var UpnpDevice = function(controlPoint, uuid, location, desc, localAddress) {
  EventEmitter.call(this);

  if (TRACE) {
    console.log("new device object for " + uuid);
  }
  this.controlPoint = controlPoint;

  this.uuid = uuid;
  this.udn = desc.UDN[0];

  this.location = location;

  this.deviceType = desc.deviceType ? desc.deviceType[0] : null;
  this.friendlyName = desc.friendlyName ? desc.friendlyName[0] : null;
  this.manufacturer = desc.manufacturer ? desc.manufacturer[0] : null;
  this.manufacturerUrl = desc.manufacturerURL ? desc.manufacturerURL[0] : null;
  this.modelNumber = desc.modelNumber ? desc.modelNumber[0] : null;
  this.modelDescription = desc.modelDescription ? desc.modelDescription[0] : null;
  this.modelName = desc.modelName ? desc.modelName[0] : null;
  this.modelUrl = desc.modelURL ? desc.modelURL[0] : null;
  this.softwareVersion = desc.softwareVersion ? desc.softwareVersion[0] : null;
  this.hardwareVersion = desc.hardwareVersion ? desc.hardwareVersion[0] : null;
  this.serialNum = desc.serialNum ? desc.serialNum[0] : null;
  this.init = false;
  // capture extra fields
  this.desc = {};
  for (var p in desc) {
    this.desc[p] = desc[p][0];
  }

  var u = url.parse(this.location);
  this.host = u.hostname;
  this.port = u.port;

  this.localAddress = localAddress;

  this.devices = {}; // sub-devices

  this.services = {};

  this._handleDeviceInfo(desc);
  // var self = this;
  // this._getDeviceDetails(function(desc) {
  // self._handleDeviceInfo(desc);
  // });

};

util.inherits(UpnpDevice, EventEmitter);


/**
 * Get details of the device
 */
UpnpDevice.prototype._getDeviceDetails = function(callback) {
  // get device details from its XML descriptor
  var self = this;
  var deviceUrl = this.location;
  var req = http.request(deviceUrl, function(res) {
    //console.log('STATUS: ' + res.statusCode);
    // TODO check status.
    //res.setEncoding('utf8');
    var resData = "";
    res.on('data', function(chunk) {
      resData += chunk;
    });
    res.on('end', function() {
      xml2js.parseString(resData, function(err, result) {
        var desc = result.root.device[0];
        callback(desc);
      });
    });
  });
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  req.on("socket", function(socket) {
    self.localAddress = socket.address().address;
  });

  req.end();

};

UpnpDevice.prototype._handleDeviceInfo = function(desc) {
  this.deviceType = desc.deviceType[0];

  //	if (desc.deviceList) {
  //		var deviceList = desc.deviceList[0].device;
  //	}
  if (desc.serviceList) {
    var serviceList = desc.serviceList[0].service;
    for (var i = 0; i < serviceList.length; i++) {
      var serviceDesc = serviceList[i];
      // var s = {
      // serviceType : serviceDesc.serviceType[0],
      // serviceId   : serviceDesc.serviceId[0],
      // controlUrl  : serviceDesc.controlURL[0],
      // eventSubUrl  : serviceDesc.eventSubURL[0],
      // scpdUrl  : serviceDesc.SCPDURL[0]
      // };
      var self = this;
      var service = new UpnpService(self, serviceDesc);

      //this.services[service.serviceId] = service;
      var servId = service.serviceId.split(":");
      this.services[servId[servId.length - 1]] = service;
      service.on("initialized", function(serv) {
    //    console.log("service init ");
        var nbInit = 0;
        //  console.log(self.services);
        for (var n in self.services) {
        //  console.log(self.services[n].serviceType+ " "+self.services[n].init);
          if (self.services[n].init)
            nbInit++;

        }
        if (nbInit == serviceList.length) {
      //    console.log("device initialized");
          if (!self.init) {
            self.init = true;
            self.emit("initialized");
          }
        }
      });
      this._getServiceDesc(service, serviceDesc, function(service, serviceResult) {

        service.initActions(serviceResult);
      });

      this.emit("service", service); // notify listeners of service


    }
  }
};

UpnpDevice.prototype._callAction = function(serviceId, actionName, args, callback) {

  this.services[serviceId].callAction(actionName, args, callback);
  // TODO lookup service and call action
};


UpnpDevice.prototype._getServiceDesc = function(service, serviceDesc, callback) {
  var options = {
    host: this.host,
    port: this.port,
    path: service.scpdUrl,
  };
  options.headers = {
    "host": this.host + ":" + this.port,
  };


  var req = http.request(options, function(res) {
    var buf = "";
    res.on('data', function(chunk) {
      buf += chunk;
    });
    res.on('end', function() {
      if (res.statusCode !== 200) {
        callback(new Error("Problem with getting basic event service desc " + service.serviceId), buf);
      } else {

        // TODO do something with service descriptor
        xml2js.parseString(buf, function(err, result) {
          if (!result.scpd) {
            console.log("problem getting device details: no result.scpd");
            return;
          }

          var desc = result.scpd;
          if (TRACE) {
            //						console.log(desc.deviceType + " : " + desc.friendlyName + " : " + location);
          }


          //var device = new UpnpDevice(self, udn, location, desc, localAddress);
          callback(service, desc);
        });
      }
    });
  });

  req.on('error', function(err) {
    console.log(err)
  });
  req.end();
};


exports.UpnpDevice = UpnpDevice;
