var application_root = __dirname,
    express = require("express");
var m3u = require('m3u');

var app = express();
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

// Config

//  app.use(express.bodyParser());
//  app.use(express.methodOverride());
//  app.use(app.router);
//  app.use(express.static(path.join(application_root, "public")));
//  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
app.use(allowCrossDomain);
app.use(require('connect-livereload')({
    port: 35729
}));
app.get('/servers/:serverid/albums', function (req, res) {
    console.log("browse");
    mediaServers[req.params.serverid].browse(mediaServers[req.params.serverid].albumPath, upnpMediaServer.BROWSE_FLAG.BrowseDirectChildren, "*", 0, 50, "", function (result) {
        res.setHeader('Content-Type', 'application/json');
        console.log("browse result");
        if (result.Error)
            res.send(500, result);
        else
            res.send(200, result);
    });
});

app.get('/servers/:serverid/browse/:id', function (req, res) {
    mediaServers[req.params.serverid].browse(req.params.id, upnpMediaServer.BROWSE_FLAG.BrowseDirectChildren, "*", 0, 200, "", function (result) {
        res.setHeader('Content-Type', 'application/json');
        if (result.Error)
            res.send(500, result);
        else
            res.send(200, result);

    });

});
app.get('/getSystemUpdateID', function (req, res) {
    mediaServers[0].getSystemUpdateID(function (result) {
        res.setHeader('Content-Type', 'application/json');
        if (result.Error)
            res.send(500, result);
        else
            res.send(200, result);
    });

});

app.get('/getSortCapabilities', function (req, res) {
    mediaServers[0].getSortCapabilities(function (result) {
        res.setHeader('Content-Type', 'application/json');
        if (result.Error)
            res.send(500, result);
        else
            res.send(200, result);

    });
});



app.get('/getSearchCapabilities', function (req, res) {
    mediaServers[0].getSearchCapabilities(function (result) {
        res.setHeader('Content-Type', 'application/json');

        if (result.Error)
            res.send(500, result);
        else
            res.send(200, result);

    });

});
// Launch server

app.listen(4242);


app.get('/servers/:serverid/playlist/:albumId', function (req, res) {
    mediaServers[req.params.serverid].browse(req.params.albumId, upnpMediaServer.BROWSE_FLAG.BrowseDirectChildren, "*", 0, 0, "", function (result) {
        var writer = m3u.extendedWriter();
        // A comment.
        //   writer.comment('I am a comment');
        // An empty line.
        //   writer.write(); // blank line


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


var UpnpControlPoint = require("../lib/upnp-controlpoint").UpnpControlPoint,

    upnpMediaServer = require("../lib/upnp-mediaServer"),
    upnpMediaRenderer = require("../lib/upnp-mediaRenderer");
var mediaServers = {};
var mediaRenderers = {};

var handleDevice = function (device) {
    //console.log("device type: " + device.deviceType + " location: " + device.location);
    switch (device.deviceType) {
    case upnpMediaServer.MediaServer.deviceType:
        var mediaServer = new upnpMediaServer.MediaServer(device);
        mediaServer.albumPath = '0$1$12';
        mediaServers[mediaServer.device.uuid] = mediaServer;
        //  console.log(device);
        break;
    case upnpMediaRenderer.MediaRenderer.deviceType:
        var mediaRenderer = new upnpMediaRenderer.MediaRenderer(device);
        mediaRenderers[mediaRenderer.device.uuid] = mediaRenderer;
        console.log(device);
        break;
    }
};
var cp = new UpnpControlPoint();
cp.on("device", handleDevice);
cp.search();