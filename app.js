var http=require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {
        'Content-Type':'application/json',
        'Access-Control-Allow-Origin':'*'
    });
    res.end('{"Hello":"World"}');
}).listen(8080, '127.0.0.1');
console.log('Running!');
