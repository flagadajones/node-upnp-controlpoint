var application_root = __dirname,
    express = require("express.io"),
    http = require('http'),
    bodyParser = require('body-parser'),
    connect = require('connect'),
    request = require('request'),
    m3u = require('m3u');
var soap2json = require('../lib/soap2json');
var DOMParser = require('xmldom').DOMParser;
var domParser = new DOMParser();
var app = express();

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
};

// Config

//  app.use(express.bodyParser());
//  app.use(express.methodOverride());
//  app.use(app.router);
//  app.use(express.static(path.join(application_root, "public")));
//  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(connect.compress());
app.use(require('connect-livereload')({
    port: 35729
}));
app.get('/servers', function (req, res) {
    var result = [];
    for (var key in mediaServers) {
        result.push(createDeviceData(mediaServers[key].device));
    };
    res.send(200, result);

});

app.get('/renderers', function (req, res) {
    var result = [];
    for (var key in mediaRenderers) {
        result.push(createDeviceData(mediaRenderers[key].device));
    };
    res.send(200, result);

});
app.get('/servers/:serverid/albums', function (req, res) {
    var fileJSON = require('../albums.json');
    var result=fileJSON;
    result.Result.container.forEach(function (item) {
        item.albumArtURI[0].Text='http://localhost:4242/images/'+item.id+'.jpeg';
    });
    res.send(200,result);
});
app.get('/servers/:serverid/albums/:albumId', function (req, res) {
    var args = {
        ObjectID: req.params.albumId,
        BrowseFlag: ContentDirectoryService.BROWSE_FLAG.BrowseMetadata,
        Filter: "*",
        StartingIndex: 0,
        RequestedCount: 1,
        SortCriteria: ""
    };
    callAndSend(req.params.serverid, ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.Browse, args, res, browseResultParse);
});
app.get('/servers/:serverid/albums/:albumId/pistes', function (req, res) {
	 var fileJSON = require('../pistes.json');
	    var result=fileJSON;
    res.send(200,result);});

app.get('/servers/:serverid/browse/:id', function (req, res) {
    var args = {
        ObjectID: req.params.id,
        BrowseFlag: ContentDirectoryService.BROWSE_FLAG.BrowseDirectChildren,
        Filter: "*",
        StartingIndex: 0,
        RequestedCount: 200,
        SortCriteria: ""
    };
    callAndSend(req.params.serverid, ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.Browse, args, res, browseResultParse);
});
app.get('/servers/:serverid/getSystemUpdateID', function (req, res) {
});

app.get('/servers/:serverid/getSortCapabilities', function (req, res) {
});

app.get('/servers/:serverid/getSearchCapabilities', function (req, res) {
});

app.get('/servers/:serverid/playlist/:albumId', function (req, res) {
});
app.put('/renderers/:rendererId/transportURI', function (req, res) {
});

app.get('/disk/*', function (req, res) {
});

app.get('/images/:id', function(req, res) {
	  res.sendfile('image/'+req.params.id);
});

// Launch server
app.http().io();
app.listen(4242);


var UpnpControlPoint = require("../lib/upnp-controlpoint").UpnpControlPoint,
    ContentDirectoryService = require("../lib/contentDirectoryService").ContentDirectoryService,

    AVTransportService = require("../lib/avTransportService").AVTransportService,

    MediaServer = require("../lib/upnp-mediaServer").MediaServer,
    MediaRenderer = require("../lib/upnp-mediaRenderer").MediaRenderer;
var mediaServers = {};
var mediaRenderers = {};
var handleDevice = function (device) {
    //console.log("device type: " + device.deviceType + "location: " + device.location);
    switch (device.deviceType) {
    case MediaServer.deviceType:
        var mediaServer = new MediaServer(device);
        mediaServer.albumPath = '0$1$12';
        mediaServers[mediaServer.device.uuid] = mediaServer;
        console.log("mediaServer: " + mediaServer.device.uuid);
        //        console.log(mediaServer.device);
        app.io.broadcast("device:server", createDeviceData(device));
        break;
    case MediaRenderer.deviceType:
        var mediaRenderer = new MediaRenderer(device);
        mediaRenderers[mediaRenderer.device.uuid] = mediaRenderer;
        console.log("mediaRenderer: " + mediaRenderer.device.uuid);
        //  console.log(device);

        app.io.broadcast("device:renderer", createDeviceData(device));

        break;
    }
};
var callAndSend = function (serverId, serviceUrn, action, args, res, resultFunction) {
   // console.log(mediaServers[serverId].services);
    mediaServers[serverId].callAction(serviceUrn, action, args, function (result) {
        if (resultFunction) {
            result = resultFunction(result);
        }
        res.setHeader('Content-Type', 'application/json');
        if (result.Error)
            res.send(500, result);
        else
            res.send(200, result);
    });

};
var createDeviceData = function (device) {
    var serv = {};
    serv.id = device.uuid;
    serv.name = device.friendlyName;
    serv.icon = ((device.desc.presentationURL) ? device.desc.presentationURL : "").replace(/\/\s*$/, "") + "/" + device.desc.iconList.icon[0].url[0].replace(/^\//, '');

    return serv;

};



var browseResultParse = function (result) {
    var xmlDIDL = domParser.parseFromString(result.Result, 'text/xml');
    result.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
  //  console.log(result);
    if (result.Result.container != null) {
        result.Result.container.forEach(function (item) {
            var fs = require('fs');
            request(item.albumArtURI[0].Text).pipe(fs.createWriteStream('D:/Documents/telecommande/node-upnp-controlpoint/image/' + item.id + '.jpeg'));
            item.albumArtURI[0].Text = item.albumArtURI[0].Text.replace('192.168.0.32:9000', '192.168.0.102:4242');
            item.albumArtURI[0].Text='http://localhost:4242/images/'+item.id+'.jpeg';
        });
    };
    if (result.Result.item != null) {
        result.Result.item.forEach(function (item) {
            item.albumArtURI[0].Text = item.albumArtURI[0].Text.replace('192.168.0.32:9000', '192.168.0.102:4242');
        });
    };
    return result;
}

var cp = new UpnpControlPoint();
cp.on("device", handleDevice);
cp.search();