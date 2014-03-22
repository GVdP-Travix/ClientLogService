"use strict";

var winston=require('winston'),
    logger=new(winston.Logger)({
        transports: [
            new (winston.transports.Console)()
        ]
    });

//winston.handleExceptions();
logger.info('Logging initialized');

module.exports=logger;
