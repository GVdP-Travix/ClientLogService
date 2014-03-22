"use strict";

var log=require('./winston/logger'),
    fs=require('fs'),
    http=require('http'),
    Q=require('q'),
    express=require('express'),
    app=express(),
    readFile,
    config, version;

log.info('Initialization');
Q.longStackSupport=true;
readFile=Q.denodeify(fs.readFile);

function readConfig() {
    return readFile('./package.json', 'utf8').
        then(function(data) {
            version=data["version"];
            log.info(data);
        }, function(err) {
            console.log("aa");
            log.error("Can't read package.json!", err);
            return process.exit(11);
        });
}

function setupRoutes() {
    var deferred=Q.defer();
    app.enable('trust proxy');

    // Usage
    app.get('/', function(req, res) {
        "use strict";

    });
    deferred.notify(0.1);

    // Health check
    app.get('/ping', function(req, res) {
        "use strict";
        res.send({
            ping:"pong"
        });
    });
    deferred.notify(2.5);

    app.get('/check', function(req, res) {
    });
    deferred.notify(5.0);

    // Log data
    app.get('/log', function(req, res) {
    });
    deferred.notify(7.5);

    app.post('/log', function(req, res) {
    });
    deferred.notify(1.0);
    deferred.resolve('DONE!');

    return deferred.promise;
}

readConfig().then(function() {
    return setupRoutes();
}).done(function() {
        http.createServer(app).listen(3000, function() {
            log.info('Startup', {listeningOn:3000, version:version});
        })
    });
