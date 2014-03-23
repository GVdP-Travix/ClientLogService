"use strict";
var halson=require('halson');

exports.index=function(req, res) {
    "use strict";
    var usage=halson({
        name:"client-log"
    }).
        addLink('self', "/").
        addLink('ping', "/ping").
        addLink('check', "/check").
        addLink('log', "/log");
    res.json(usage);
};

exports.ping=function(req, res) {
    "use strict";
    var ping=halson({
        ping:"pong"
    }).addLink('self', '/');
    res.json(ping);
};

exports.check=function(req, res) {
    "use strict";
    var check=halson({
        status:"alive",
        api:{
            listeningOn:port,
            loggingOn:{
                console:{},
                logstash:{
                    host:logstash.host,
                    port:logstash.port
                }
            }
        }
    }).addLink('self', '/');
    res.json(check);
};

exports.doLog=function(logger) {
    return function(req, res) {
        var content=req.body;

        res.json({});
        logger.log('error', { tags:["javascript", "frontend"], body:content});
    };
};
