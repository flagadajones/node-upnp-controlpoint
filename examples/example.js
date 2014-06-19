var UpnpControlPoint = require("../lib/upnp-controlpoint").UpnpControlPoint,
    wemo = require("../lib/wemo"),
    dlna = require("../lib/dlna");

var handleDevice = function (device) {
    //console.log("device type: " + device.deviceType + " location: " + device.location);
    switch (device.deviceType) {
    case dlna.MediaServer.deviceType:
        var mediaServer = new dlna.MediaServer(device);
        //ConnectionManager
        //mediaServer.getProtocolInfo();
        //mediaServer.prepareForConnection(0);//NOT_IMPLEMENTED
        //mediaServer.getCurrentConnectionIDs();
        //mediaServer.getCurrentConnectionInfo(0);
        //mediaServer.connectionComplete(0);//NOT_IMPLEMENTEDs

        //ContentDirectory    
        //mediaServer.getSearchCapabilities();
        //mediaServer.getSortCapabilities();
        //  mediaServer.getSystemUpdateID();
        //mediaServer.browse("0$1$12", dlna.BROWSE_FLAG.BrowseDirectChildren, "*", 0,5, "");//container
        //  mediaServer.browse("0$1$12$5951", dlna.BROWSE_FLAG.BrowseDirectChildren, "*", 0,1, "");//item 
        //console.log(mediaServer);
        break;

    }
};

var cp = new UpnpControlPoint();

cp.on("device", handleDevice);

cp.search();