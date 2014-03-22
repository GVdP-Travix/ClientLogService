"use strict";

require('winston-logstash');


var winston=require('winston'),
    logger=new(winston.Logger)({
        transports: [
            new (winston.transports.Console)()
        ]
    });

logger.reconfigure=function(host, port) {
    winston.add(winston.transports.Logstash, {
        port: port,
        host: host
    });
};

// TODO: Uncomment when done..
//winston.handleExceptions();
logger.info('Logging initialized');

module.exports=logger;
