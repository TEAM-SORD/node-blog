var http = require("http");
var handler = require("./handler");
var port = 4000;

//*** List of Routes and Associated Handler Functions ***//
var routes = {};
routes["/"] = handler.home; 
routes["/home"] = handler.home;
routes["/index.css"] = handler.css;
routes["/blogpage"] = handler.blogpage;// localhost:4000/open_post?id=blogid
routes["/editpage"] = handler.editpage;// localhost:4000/open_edit?id=blogid
//routes["/read"] = handler.read;
routes["/create"] = handler.create;
routes["/update"] = handler.update;
routes["/delete"] = handler.delete;


//*** Invokes the right handler or throws error ***//
var router = function(req, res){
    var url = req.url; //http://localhost:4000/blogpage?id=550034a5baf8cfd514db592d
    console.log("request received for ", url);
    console.log( "GET, POST, UPDATE, DELETE :  " + req.method );

    if (typeof routes[url] === 'function'){
        routes[url](req, res); 
    } 
    else if( url.match(/blogpage/)){
        routes['/blogpage'](req, res);
    }
    else if( url.match(/editpage/)){
        routes['/editpage'](req, res);
    }
    else {
        console.log('Error, route for ', url, 'does not exist');
        res.writeHead(404, {"Content-Type": "text/plain"});
        res.end(" ERROR!!");
    }
};


http.createServer(router).listen(port);

console.log('Server running on port', port);

