"use strict";

require('winston-logstash');

var winston=require('winston'),
    consoleLog=new (winston.transports.Console)(),
    logger=new winston.Logger({
        transports:[
            consoleLog
        ]
    });

logger.reconfigure=function(host, port) {
    logger.add(winston.transports.Logstash, {
        port:port,
        host:host
    }, false)
        .remove(consoleLog);
};

// TODO: Uncomment when done..
//winston.handleExceptions();
logger.info('Logging initialized');

module.exports=logger;
