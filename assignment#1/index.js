/*
* Getting Started with Hello World API endpoint.
*/

const http = require('http'); //importing the required nodejs http server library
const url = require('url') //importing the required nodejs url library to help us parse User request and know what specific resource they are asking for
const config = require('./config');
const stringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer((req,res)=>{

    var parsedUrl = url.parse(req.url,true)
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,''); //replace any trailing slashes with empty

    var method = req.method.toLowerCase(); // getting the method of the request made and converting it to lower case, just in case method sent to the app is uppercase. 

    var queryObject = parsedUrl.query;

    var headers = req.headers;

    var decoder = new stringDecoder('utf-8');
    var buffer = '';

    req.on('data',(data)=>{
        buffer += decoder.write(data);
    });

    req.on('end',()=>{
        buffer += decoder.end();

        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        var data = {
            'trimmedPath': trimmedPath,
            'queryObject' :queryObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        }

        chosenHandler(data,(statusCode,payload)=>{
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};

            var payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

               
        console.log('returning ', statusCode,payloadString);
        });
     
    });

});

server.listen(config.port,()=>{
    console.log(`server listening on port ${config.port} in ${config.envName} mode`);
});

//define handler

var handlers = {};

handlers.hello = function(data,callback){
    callback(200,{'success':'Hello World!'});
};

handlers.notFound = function(data,callback){
    //fallback route, so that when nothing matches this gets called.
    callback(404);
};

/*Doing actual request routing*/

var router = {
    'hello' : handlers.hello
}