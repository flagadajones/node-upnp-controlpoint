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
    var args = {
        ObjectID: mediaServers[req.params.serverid].albumPath,
        BrowseFlag: ContentDirectoryService.BROWSE_FLAG.BrowseDirectChildren,
        Filter: "*",
        StartingIndex: 0,
        RequestedCount: 500,
        SortCriteria: ""
    };

    callAndSend(mediaServers, req.params.serverid, ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.Browse, args, res, browseResultParse);
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
    callAndSend(mediaServers, req.params.serverid, ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.Browse, args, res, browseResultParse);
});
app.get('/servers/:serverid/albums/:albumId/pistes', function (req, res) {
    var args = {
        ObjectID: req.params.albumId,
        BrowseFlag: ContentDirectoryService.BROWSE_FLAG.BrowseDirectChildren,
        Filter: "*",
        StartingIndex: 0,
        RequestedCount: 200,
        SortCriteria: ""
    };
    callAndSend(mediaServers, req.params.serverid, ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.Browse, args, res, browseResultParse);
});

app.get('/servers/:serverid/browse/:id', function (req, res) {
    var args = {
        ObjectID: req.params.id,
        BrowseFlag: ContentDirectoryService.BROWSE_FLAG.BrowseDirectChildren,
        Filter: "*",
        StartingIndex: 0,
        RequestedCount: 200,
        SortCriteria: ""
    };
    callAndSend(mediaServers, req.params.serverid, ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.Browse, args, res, browseResultParse);
});
app.get('/servers/:serverid/getSystemUpdateID', function (req, res) {
    var args = {};
    callAndSend(mediaServers, req.params.serverid, ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.GetSystemUpdateID, args, res);
});

app.get('/servers/:serverid/getSortCapabilities', function (req, res) {
    var args = {};
    callAndSend(mediaServers, req.params.serverid, ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.GetSortCapabilities, args, res);
});

app.get('/servers/:serverid/getSearchCapabilities', function (req, res) {
    var args = {};
    callAndSend(mediaServers, req.params.serverid, ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.GetSearchCapabilities, args, res);
});

app.get('/servers/:serverid/playlist/:albumId', function (req, res) {
    var args = {
        ObjectID: req.params.albumId,
        BrowseFlag: ContentDirectoryService.BROWSE_FLAG.BrowseDirectChildren,
        Filter: "*",
        StartingIndex: 0,
        RequestedCount: 200,
        SortCriteria: ""
    };
    mediaServers[req.params.serverid].callAction(ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.Browse, args, function (result) {
        var writer = m3u.extendedWriter();
        var xmlDIDL = domParser.parseFromString(result.Result, 'text/xml');
        result.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
        result.Result.item.forEach(function (item) {
            // A playlist item, usually a path or url.
            writer.file(item.res[0].Text, item.res[0].duration, item.title);
        });
        //      console.log(writer.toString());
        res.setHeader('Content-Type', 'application/json');

        if (result.Error)
            res.send(500, result);
        else
            res.send(200, writer.toString());
        //    res.send(200, result);

    });

});

app.get('/renderers/:rendererId/mediaInfo', function (req, res) {
    var args = {
        InstanceID: 0
    };
    callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.GetMediaInfo, args, res);
});

app.get('/renderers/:rendererId/currentTransportActions', function (req, res) {
    var args = {
        InstanceID: 0
    };
    callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.GetCurrentTransportActions, args, res);
});

app.get('/renderers/:rendererId/transportInfo', function (req, res) {
    var args = {
        InstanceID: 0
    };
    callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.GetTransportInfo, args, res);
});

app.get('/renderers/:rendererId/positionInfo', function (req, res) {
    var args = {
        InstanceID: 0,
    };
    callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.GetPositionInfo, args, res);
});

app.get('/renderers/:rendererId/play', function (req, res) {
    var args = {
        InstanceID: 0,
        Speed: 1
    };
    callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.Play, args, res);
});

app.get('/renderers/:rendererId/pause', function (req, res) {
    var args = {
        InstanceID: 0
    };
    callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.Pause, args, res);
});


app.get('/renderers/:rendererId/next', function (req, res) {
    var args = {
        InstanceID: 0,
    };
    callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.Next, args, res);
});

app.get('/renderers/:rendererId/prev', function (req, res) {
    var args = {
        InstanceID: 0,
    };
    callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.Prev, args, res);
});




app.put('/renderers/:rendererId/transportURI', function (req, res) {
    var body = req.body;
    //{"serverId":"","albumId":""}
    //  console.log(body);
    var args = {
        ObjectID: body.albumId,
        BrowseFlag: ContentDirectoryService.BROWSE_FLAG.BrowseMetadata,
        Filter: "*",
        StartingIndex: 0,
        RequestedCount: 200,
        SortCriteria: ""
    };
    console.log(args);
    mediaServers[body.serverId].callAction(ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.Browse, args, function (result) {
        var args2 = {
            InstanceID: 0,
            CurrentURIMetaData: encodeHTML(result.Result),
            CurrentURI: "http://127.0.0.1:61817/MediaServerContent_0/4/0000000000000009/%20-%20Sleep%20Away.mp3", //"http://localhost:4242/servers/" + body.serverId + "/playlist/" + body.albumId,
        };
        console.log(args2);
        callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.SetAVTransportURI, args2, res);
    });


});


app.put('/renderers/:rendererId/nextTransportURI', function (req, res) {
    var body = req.body;
    //{"serverId":"","albumId":""}
    //  console.log(body);
    var args = {
        ObjectID: body.albumId,
        BrowseFlag: ContentDirectoryService.BROWSE_FLAG.BrowseMetadata,
        Filter: "*",
        StartingIndex: 0,
        RequestedCount: 200,
        SortCriteria: ""
    };
    console.log(args);
    mediaServers[body.serverId].callAction(ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.Browse, args, function (result) {
        var args2 = {
            InstanceID: 0,
            NextURIMetaData: encodeHTML(result.Result),
            NextURI: "http://127.0.0.1:61817/MediaServerContent_0/4/0000000000000009/%20-%20Sleep%20Away.mp3", //"http://localhost:4242/servers/" + body.serverId + "/playlist/" + body.albumId,
        };
        console.log(args2);
        callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.SetNextAVTransportURI, args2, res);
    });


});

app.get('/disk/*', function (req, res) {
    var url = 'http://192.168.0.32:9000' + req.url;
    var requestSettings = {
        method: 'GET',
        url: url,
        encoding: null
    };

    request(requestSettings, function (error, response, body) {
        res.setHeader('Cache-Control', 'no-transform,public,max-age=300,s-maxage=900');
        res.setHeader('content-type', 'image/jpeg');
        res.end(body, 'binary');
    });
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
    //   console.log("device type: " + device.deviceType + "location: " + device.location);
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
var callAndSend = function (type, deviceId, serviceUrn, action, args, res, resultFunction) {
    //  console.log(mediaServers[serverId].services);
    type[deviceId].callAction(serviceUrn, action, args, function (result) {
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


    if (device.desc.iconList) {
        if (device.desc.iconList.icon[0].url[0].startsWith("http")) {
            serv.icon = device.desc.iconList.icon[0].url[0];
        } else {
            serv.icon = ((device.desc.presentationURL) ? device.desc.presentationURL : "").replace(/\/\s*$/, "") + "/" + device.desc.iconList.icon[0].url[0].replace(/^\//, '');
        }

    }
    // console.log(device.desc);
    return serv;

};



var browseResultParse = function (result) {
    var xmlDIDL = domParser.parseFromString(result.Result, 'text/xml');
    result.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
    console.log(result.Result.container);
    if (result.Result.container != null) {
        result.Result.container.forEach(function (item) {
            if (item.albumArtURI) {
                var fs = require('fs');
                request(item.albumArtURI[0].Text).pipe(fs.createWriteStream('D:/Documents/telecommande/node-upnp-controlpoint/image/' + item.id + '.jpeg'));
                item.albumArtURI[0].Text = item.albumArtURI[0].Text.replace('192.168.0.32:9000', '192.168.0.102:4242');
                //item.albumArtURI[0].Text='http://localhost:4242/images/'+item.id+'.jpeg';
            }
        });
    };
    if (result.Result.item != null) {
        result.Result.item.forEach(function (item) {
            if (item.albumArtURI) {
                item.albumArtURI[0].Text = item.albumArtURI[0].Text.replace('192.168.0.32:9000', '192.168.0.102:4242');
            }
        });
    };
    return result;
};

var encodeHTML = function (string) {
    return string.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

var cp = new UpnpControlPoint();
cp.on("device", handleDevice);
/*
setInterval(function () {
    cp.search();
    console.log("search");
}, 10 * 1000);
*/
cp.search();