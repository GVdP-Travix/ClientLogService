"use strict";

var log=require('./winston/logger'),
    fs=require('fs'),
    http=require('http'),
    Q=require('q'),
    halson=require('halson'),
    express=require('express'),
    app=express(),
    readFile,
    config,
    version, port, logstash={};

log.info('Initialization');
Q.longStackSupport=true;
readFile=Q.denodeify(fs.readFile);

function readConfig() {
    return readFile('./package.json', 'utf8').
        then(function(data) {
            var d=JSON.parse(data);
            version=d["version"];
            log.info(d);

            return readFile('./config.json', 'utf8');
        },function(err) {
            log.error("Can't read package.json!", err);
            return process.exit(11);
        }).
        then(function(data) {
            var config=JSON.parse(data);
            port=config["port"];
            logstash=config["logstash"];
            // TODO later..
            //log.reconfigure(logstash.host, logstash.port)
        }, function(err) {
            log.error("Can't read config.json!", err);
            return process.exit(11);
        });
}

function setupRoutes() {
    var deferred=Q.defer();
    app.enable('trust proxy');

    // Usage
    app.get('/', function(req, res) {
        "use strict";
        var usage=halson({
            name:"client-log"
        }).
            addLink('self', "/").
            addLink('ping', "/ping").
            addLink('check', "/check").
            addLink('log', "/log");
        res.json(usage);
    });
    deferred.notify(0.1);

    // Health check
    app.get('/ping', function(req, res) {
        "use strict";
        var ping=halson({
            ping:"pong"
        }).addLink('self', '/');
        res.json(ping);
    });
    deferred.notify(2.5);

    app.get('/check', function(req, res) {
        "use strict";
        var check=halson({
            status:"alive",
            api:{
                listeningOn:port,
                loggingOn:{
                    console: {},
                    logstash: {
                        host: logstash.host,
                        port: logstash.port
                    }
                }
            }
        }).addLink('self', '/');
        res.json(check);
    });
    deferred.notify(5.0);

    // Log data
//    app.get('/log', function(req, res) {
//        // Empty HTTP 200
//        res.end();
//    });
//    deferred.notify(7.5);

    app.post('/log', function(req, res) {
    });
    deferred.notify(1.0);
    deferred.resolve('DONE!');

    return deferred.promise;
}

readConfig()
    .then(function() {
        return setupRoutes();
    })
    .progress(function(prog) {
        log.info(prog);
    })
    .done(function() {
        http.createServer(app).listen(port, function() {
            log.info('Starting', {listeningOn:port, version:version});
        })
    });
