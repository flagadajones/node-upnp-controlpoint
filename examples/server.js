var application_root = __dirname;
var express = require("express.io");
var http = require('http');
var bodyParser = require('body-parser');
var connect = require('connect');
var request = require('request');
var m3u = require('m3u');
var soap2json = require('../lib/soap2json');
var DOMParser = require('xmldom').DOMParser;
var domParser = new DOMParser();
var app = express();
var DataStore = require('nedb');
var async = require('async');
var _ = require('underscore');
var db = {};
db.servers = new DataStore({
  filename: './db/servers.json',
  autoload: true
});
db.servers.update({
  active: true
}, {
  $set: {
    active: false
  }
}, {
  multi: true
});
db.albums = new DataStore({
  filename: './db/albums.json',
  autoload: true
});

var allowCrossDomain = function(req, res, next) {
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
//app.use(connect.compress());
app.use(require('connect-livereload')({
  port: 35729
}));
app.get('/servers', function(req, res) {
  db.servers.find({
    type: "Server"
  }, function(err, servers) {
    res.setHeader('Content-Type', 'application/json');

    res.send(200, servers);

  })

});

app.get('/renderers', function(req, res) {
  db.servers.find({
    type: "Renderer"
  }, function(err, renderers) {
    res.setHeader('Content-Type', 'application/json');

    res.send(200, renderers);

  })

});
app.get('/servers/:serverid/albums', function(req, res) {
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
app.get('/albums', function(req, res) {
  db.albums.loadDatabase();
  db.servers.find({
    active: true
  }, function(err, docs) {
    db.albums.find({
      server: {
        $in: _.map(docs, function(item) {
          return item._id;
        })
      }
    }, function(err, albu) {
      //      console.log(albums);
      res.setHeader('Content-Type', 'application/json');
      //return albu;
      res.json(albu);
      //res.end();
    });
  });
});
app.get('/servers/:serverid/albums/:albumId', function(req, res) {
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
app.get('/servers/:serverid/albums/:albumId/pistes', function(req, res) {
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

app.get('/servers/:serverid/browse/:id', function(req, res) {
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

app.get('/test', function(req, res) {
  var body = req.body;
  body = {
    "serverId": "55076f6e-6b79-4d65-6471-b8a386975678",
    "albumId": "0$1$12$5746"
  };

  var args = {
    ObjectID: body.albumId,
    BrowseFlag: ContentDirectoryService.BROWSE_FLAG.BrowseMetadata,
    Filter: "*",
    StartingIndex: 0,
    RequestedCount: 200,
    SortCriteria: ""
  };
  console.log(args);
  mediaServers[body.serverId].callAction(ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.Browse, args, function(result) {
    var albumMeta = result.Result;
    albumMeta = albumMeta.replace("</container></DIDL-Lite>", "");
    //result.Result = albumMeta;
    // res.send(200, result);
    var args2 = {
      ObjectID: body.albumId,
      BrowseFlag: ContentDirectoryService.BROWSE_FLAG.BrowseDirectChildren,
      Filter: "*",
      StartingIndex: 0,
      RequestedCount: 200,
      SortCriteria: ""
    };
    console.log(args);
    mediaServers[body.serverId].callAction(ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.Browse, args2, function(result) {
      listePiste = result.Result.replace("<DIDL-Lite xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:upnp=\"urn:schemas-upnp-org:metadata-1-0/upnp/\" xmlns:dlna=\"urn:schemas-dlna-org:metadata-1-0/\" xmlns:arib=\"urn:schemas-arib-or-jp:elements-1-0/\" xmlns:dtcp=\"urn:schemas-dtcp-com:metadata-1-0/\" xmlns:pv=\"http://www.pv.com/pvns/\" xmlns=\"urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/\">", "").replace("</DIDL-Lite>", "");
      //  result.Result = listePiste;
      //    res.send(200, result);
      var args3 = {
        InstanceID: 0,
        CurrentURI: "http://192.168.0.23:4242/servers/" + body.serverId + "/playlist/" + body.albumId + "/playlist.m3u",
        CurrentURIMetaData: encodeHTML(albumMeta + listePiste + "</container></DIDL-Lite>"), //encodeHTML(result.Result),

        //"http://192.168.0.32:9000/disk/DLNA-PNMP3-OP01-FLAGS01700000/O0$1$8I435978.mp3"
      };

      //    res.setHeader('Content-Type', 'application/xml');
      //    res.send(200, albumMeta + listePiste + "</container></DIDL-Lite>");
      console.log(args2);
      callAndSend(mediaRenderers, "693f0e26-bd86-47b3-8183-9836e0313d2e", AVTransportService.serviceUrn, AVTransportService.actions.SetAVTransportURI, args3, res);
    });
  });

});
app.get('/servers/:serverid/getSystemUpdateID', function(req, res) {
  var args = {};
  callAndSend(mediaServers, req.params.serverid, ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.GetSystemUpdateID, args, res);
});

app.get('/servers/:serverid/getSortCapabilities', function(req, res) {
  var args = {};
  callAndSend(mediaServers, req.params.serverid, ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.GetSortCapabilities, args, res);
});

app.get('/servers/:serverid/getSearchCapabilities', function(req, res) {
  var args = {};
  callAndSend(mediaServers, req.params.serverid, ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.GetSearchCapabilities, args, res);
});

app.get('/servers/:serverid/playlist/:albumId/playlist.m3u', function(req, res) {
  var args = {
    ObjectID: req.params.albumId,
    BrowseFlag: ContentDirectoryService.BROWSE_FLAG.BrowseDirectChildren,
    Filter: "*",
    StartingIndex: 0,
    RequestedCount: 200,
    SortCriteria: ""
  };
  mediaServers[req.params.serverid].callAction(ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.Browse, args, function(result) {
    var writer = m3u.extendedWriter();
    var xmlDIDL = domParser.parseFromString(result.Result, 'text/xml');
    result.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
    result.Result.item.forEach(function(item) {
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

app.get('/renderers/:rendererId/mediaInfo', function(req, res) {
  var args = {
    InstanceID: 0
  };
  callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.GetMediaInfo, args, res);
});

app.get('/renderers/:rendererId/currentTransportActions', function(req, res) {
  var args = {
    InstanceID: 0
  };
  callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.GetCurrentTransportActions, args, res);
});

app.get('/renderers/:rendererId/transportInfo', function(req, res) {
  var args = {
    InstanceID: 0
  };
  callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.GetTransportInfo, args, res);
});

app.get('/renderers/:rendererId/positionInfo', function(req, res) {
  var args = {
    InstanceID: 0,
  };
  callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.GetPositionInfo, args, res);
});

app.get('/renderers/:rendererId/play', function(req, res) {
  var args = {
    InstanceID: 0,
    Speed: 1
  };
  callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.Play, args, res);
});

app.get('/renderers/:rendererId/pause', function(req, res) {
  var args = {
    InstanceID: 0
  };
  callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.Pause, args, res);
});


app.get('/renderers/:rendererId/next', function(req, res) {
  var args = {
    InstanceID: 0,
  };
  callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.Next, args, res);
});

app.get('/renderers/:rendererId/prev', function(req, res) {
  var args = {
    InstanceID: 0,
  };
  callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.Prev, args, res);
});




app.put('/renderers/:rendererId/transportURI', function(req, res) {
  var body = req.body;


  var args = {
    ObjectID: body.albumId,
    BrowseFlag: ContentDirectoryService.BROWSE_FLAG.BrowseMetadata,
    Filter: "*",
    StartingIndex: 0,
    RequestedCount: 200,
    SortCriteria: ""
  };
  console.log(args);
  mediaServers[body.serverId].callAction(ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.Browse, args, function(result) {
    var albumMeta = result.Result;
    albumMeta = albumMeta.replace("</container></DIDL-Lite>", "");
    //result.Result = albumMeta;
    // res.send(200, result);
    var args2 = {
      ObjectID: body.albumId,
      BrowseFlag: ContentDirectoryService.BROWSE_FLAG.BrowseDirectChildren,
      Filter: "*",
      StartingIndex: 0,
      RequestedCount: 200,
      SortCriteria: ""
    };
    console.log(args);
    mediaServers[body.serverId].callAction(ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.Browse, args2, function(result) {
      listePiste = result.Result.replace("<DIDL-Lite xmlns:dc=\"http://purl.org/dc/elements/1.1/\" xmlns:upnp=\"urn:schemas-upnp-org:metadata-1-0/upnp/\" xmlns:dlna=\"urn:schemas-dlna-org:metadata-1-0/\" xmlns:arib=\"urn:schemas-arib-or-jp:elements-1-0/\" xmlns:dtcp=\"urn:schemas-dtcp-com:metadata-1-0/\" xmlns:pv=\"http://www.pv.com/pvns/\" xmlns=\"urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/\">", "").replace("</DIDL-Lite>", "");
      //  result.Result = listePiste;
      //    res.send(200, result);
      var args3 = {
        InstanceID: 0,
        CurrentURI: "http://192.168.0.23:4242/servers/" + body.serverId + "/playlist/" + body.albumId + "/playlist.m3u",
        CurrentURIMetaData: encodeHTML(albumMeta + listePiste + "</container></DIDL-Lite>"), //encodeHTML(result.Result),

        //"http://192.168.0.32:9000/disk/DLNA-PNMP3-OP01-FLAGS01700000/O0$1$8I435978.mp3"
      };

      //    res.setHeader('Content-Type', 'application/xml');
      //    res.send(200, albumMeta + listePiste + "</container></DIDL-Lite>");
      console.log(args2);
      callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.SetAVTransportURI, args3, res);
    });
  });

});


app.put('/renderers/:rendererId/nextTransportURI', function(req, res) {
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
  mediaServers[body.serverId].callAction(ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.Browse, args, function(result) {
    var args2 = {
      InstanceID: 0,
      NextURIMetaData: encodeHTML(result.Result),
      NextURI: "http://127.0.0.1:61817/MediaServerContent_0/4/0000000000000009/%20-%20Sleep%20Away.mp3", //"http://localhost:4242/servers/" + body.serverId + "/playlist/" + body.albumId,
    };
    console.log(args2);
    callAndSend(mediaRenderers, req.params.rendererId, AVTransportService.serviceUrn, AVTransportService.actions.SetNextAVTransportURI, args2, res);
  });


});

app.get('/disk/*', function(req, res) {
  var url = 'http://192.168.0.32:9000' + req.url;
  var requestSettings = {
    method: 'GET',
    url: url,
    encoding: null
  };

  request(requestSettings, function(error, response, body) {
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
var handleDevice = function(device) {
  //console.log("device type: " + device.deviceType + "location: " + device.location);
  switch (device.deviceType) {
    case MediaServer.deviceType:
      var mediaServer = new MediaServer(device);
      mediaServers[mediaServer.device.uuid] = mediaServer;
      createDeviceData(device, "Server");
      device.on("initialized", function() {
        console.log("inininini");
        db.servers.update({
          _id: device.uuid
        }, {
          $set: {
            active: true
          }
        });
        db.servers.findOne({
          _id: device.uuid
        }, function(err, doc) {
          if (doc.albumPath) {
            var args = {
              ObjectID: doc.albumPath,
              BrowseFlag: ContentDirectoryService.BROWSE_FLAG.BrowseDirectChildren,
              Filter: "*",
              StartingIndex: 0,
              RequestedCount: 500,
              SortCriteria: ""
            };
            //  console.log(args);
            mediaServers[device.uuid].callAction(ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.Browse, args, function(result) {

              result = browseResultParse(result);
              result.Result.container.forEach(function(album) {
                var alb = {};
                alb.server = device.uuid;
                alb.title = album.title;
                alb.artist = album.artist;
                alb._id = album.id;
                alb.albumArt = album.albumArtURI[0].Text;
                alb.nbTitre = album.childCount;
                alb.pistes = [];

                var args2 = {
                  ObjectID: album.id,
                  BrowseFlag: ContentDirectoryService.BROWSE_FLAG.BrowseDirectChildren,
                  Filter: "*",
                  StartingIndex: 0,
                  RequestedCount: 500,
                  SortCriteria: ""
                };
                mediaServers[device.uuid].callAction(ContentDirectoryService.serviceUrn, ContentDirectoryService.actions.Browse, args2, function(result2) {
                  result2 = browseResultParse(result2);


                  async.each(result2.Result.item, function(piste, callback) {
                    var pist = {};
                    pist.server = device.uuid;
                    pist.title = piste.title;
                    pist.artist = piste.albumArtist;
                    pist.duree = piste.res[0].duration;
                    pist.url = piste.res[0].Text;
                    pist._id = piste.id;

                    alb.pistes.push(pist);
                    callback();
                    //  console.log(piste);
                  }, function(err) {
                    if (err) {
                      return console.log(err);
                    }
                    //  console.log(alb);
                    db.albums.insert(alb);
                    //      console.log('all dropped');
                  });


                });

              });

            });
          }
        });
      });
      console.log("mediaServer: " + device.uuid);
      //        console.log(mediaServer.device);
      app.io.broadcast("device:server", createDeviceData(device));
      break;
    case MediaRenderer.deviceType:
      console.log("mediaRenderer: " + device.uuid);
      //  console.log(device);
      var mediaRenderer = new MediaRenderer(device);
      mediaRenderers[mediaRenderer.device.uuid] = mediaRenderer;
      createDeviceData(device, "Renderer");

      app.io.broadcast("device:renderer", createDeviceData(device));
      break;
  }
};
var callAndSend = function(type, deviceId, serviceUrn, action, args, res, resultFunction) {
  //  console.log(mediaServers[serverId].services);
  type[deviceId].callAction(serviceUrn, action, args, function(result) {
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
var createDeviceData = function(device, type) {
  var serv = {};
  serv._id = device.uuid;
  serv.name = device.friendlyName;
  serv.type = type;



  if (device.desc.iconList) {
    if (device.desc.iconList.icon[0].url[0].startsWith("http")) {
      serv.icon = device.desc.iconList.icon[0].url[0];
    } else {
      serv.icon = ((device.desc.presentationURL) ? device.desc.presentationURL : "").replace(/\/\s*$/, "") + "/" + device.desc.iconList.icon[0].url[0].replace(/^\//, '');
    }

  }
  // console.log(device.desc);
  db.servers.insert(serv);

  return serv;

};



var browseResultParse = function(result) {
  var xmlDIDL = domParser.parseFromString(result.Result, 'text/xml');
  result.Result = soap2json.XMLObjectifier.xmlToJSON(xmlDIDL);
  // console.log(result.Result.container);
  if (result.Result.container != null) {
    result.Result.container.forEach(function(item) {
      if (item.albumArtURI) {
        var fs = require('fs');
        //           request(item.albumArtURI[0].Text).pipe(fs.createWriteStream('D:/Documents/telecommande/node-upnp-controlpoint/image/' + item.id + '.jpeg'));
        item.albumArtURI[0].Text = item.albumArtURI[0].Text.replace('192.168.0.32:9000', '192.168.0.23:4242');
        //item.albumArtURI[0].Text='http://localhost:4242/images/'+item.id+'.jpeg';
      }
    });
  };
  if (result.Result.item != null) {
    result.Result.item.forEach(function(item) {
      if (item.albumArtURI) {
        item.albumArtURI[0].Text = item.albumArtURI[0].Text.replace('192.168.0.32:9000', '192.168.0.23:4242');
      }
    });
  };
  return result;
};

var encodeHTML = function(string) {
  return string.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

var cp = new UpnpControlPoint();
cp.on("device-found", handleDevice);

setInterval(function() {
  cp.search();
  console.log("search");
}, 30 * 1000);

cp.search();
