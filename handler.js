var fs = require('fs');
var url = require("url");
var db = require('./model.js');
//var template = require( './jade.js');

var querystring = require('querystring'),
	utils = require('util');

var handleResponse = function( res, responseData ){
	res.writeHead(200, {"Content-Type": responseData.contentType});
    //res.write("Welcome");
    res.end(responseData.data);
};

function handleHTML( requestType, res, handleResponse, pushData ) {
	if( requestType === 'GET'){
		return {
				  contentType: 'text/plain',
				  data       : '<html><body> <h3> HELLO WORLD</h3></body></html>'
			   };
   	}
   	else if( requestType === 'POST' ){
   		// not sure how we post to a server side rendered system, probably just json!
	}
}

function handleJSON( req, requestType, res, pushData ) {
	var responseData;
	if( requestType === 'GET'){
		// fs.exists('./test/dummy_blogs.json', function (exists) {
	 //    	console.log( exists ? "it's there" : "not!");
		// });
		fs.readFile('./test/dummy_blogs.json', function( err, data ) {
			if( err ){
				console.log( "Error: " + err );
			}
			responseData =  {
				     			contentType: 'application/json',
					 			data        : data
				   			};
		   handleResponse( res, responseData );
		});
	}
	else if( requestType === 'POST' ){
		console.log( "data to post: " + req.body );

		var fullBody = '';
        
        req.on('data', function(chunk) {
          // append the current chunk of data to the fullBody variable
          fullBody += chunk.toString();
        });
        
        req.on('end', function() {
	   		fs.readFile('./test/dummy_blogs.json', function(err, data) {
	    		var blogs = JSON.parse( data );
	    		var decodedBody = querystring.parse(fullBody);
	    		blogs.push( decodedBody);
	    		fs.writeFile('./test/dummy_blogs.json', JSON.stringify(blogs, null, 4), function(err) {
	    			responseData = {
								     contentType: 'application/json',
									 data        :  JSON.stringify(blogs)
					   	   			};
	    			handleResponse( res, responseData );

	   			});	
			});
   		});
	}

}

function route ( req, res, handleResponse ) {

	// GET json blogs request
	// GET html string blogs request
	// POST new blog 

	// if pathname === '/' then return html string	
	// else if pathname === '/blogs.json'
			// if GET else if POST
	var pathname = url.parse(req.url).pathname;
    console.log( "Query: " + url.parse(req.url).query);
    var requestFormat = 'json';//url.parse(req.url).query.dataType;
    var requestType = req.method;
    console.log( "Request Format: " + requestFormat );
    console.log( "Request Type: " + requestType );
	if( requestFormat && requestFormat.match(/html/) ){
		 handleHTML( requestType, res );		
	}
	else if( requestFormat && requestFormat.match(/json/) ){
		 handleJSON( req, requestType, res );
	}
}


module.exports = function handler(req, res) {

	// console.log( req );
	route( req, res );

};


module.exports = {


    home: function handler(req, res) {
        // console.log("Request for " + pathname + " received.");
        var query = db.getPosts();//function( blogPosts ) {
        	query.exec(function (err, posts) {
        		console.log( 'In query.exec : ' + posts );
        	
       			//var renderedPage = template.renderMainPage( posts );
       			res.writeHead(200, {"Content-Type": "text/plain"});
	        	// res.write("Welcome");
	        	// res.end(renderedPage );
	        	res.end( JSON.stringify( posts ));
        	});
        //});
    },

    // read: function handler(req, res) {
    //     // console.log("Request for " + pathname + " received.");

    //     res.writeHead(200, {"Content-Type": "text/plain"});
    //     res.write("Welcome");
    //     res.end(" to read article");

    // },
    create: function handler(req, res) {
        // console.log("Request for " + pathname + " received.");
       
        var fullBody = '';
        
        req.on('data', function(chunk) {
          // append the current chunk of data to the fullBody variable
          fullBody += chunk.toString();
        });
        
        req.on('end', function() {
        	var newPost = querystring.parse(fullBody);
        	db.addPost( newPost, function(err) {
	        	res.writeHead(200, {"Content-Type": "text/plain"});
	        	res.end("created article");
	        });
        });

    },
	update: function handler(req, res) {

        res.writeHead(200, {"Content-Type": "text/plain"});
        res.write("Welcome");
        res.end(" to create article");

    },

    delete: function handler(req, res) {

	    res.writeHead(200, {"Content-Type": "text/plain"});
	    res.write("Welcome");
	    res.end(" to delete article");

    },
    blogpage: function handler(req, res) {

	    res.writeHead(200, {"Content-Type": "text/plain"});
	    res.write("Welcome");
	    res.end(" to blogpage");

    },
    editpage: function handler(req, res) {

	    res.writeHead(200, {"Content-Type": "text/plain"});
	    res.write("Welcome");
	    res.end("to editpage");

    }

};


