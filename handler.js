
var fs = require('fs');
var url = require("url");
var db = require('./model.js');
var jade = require("jade");


var querystring = require('querystring'),
	utils = require('util');

// var handleResponse = function( res, responseData ){
// 	res.writeHead(200, {"Content-Type": responseData.contentType});
//     //res.write("Welcome");
//     res.end(responseData.data);
// };

// function handleHTML( requestType, res, handleResponse, pushData ) {
// 	if( requestType === 'GET'){
// 		return {
// 				  contentType: 'text/plain',
// 				  data       : '<html><body> <h3> HELLO WORLD</h3></body></html>'
// 			   };
//    	}
//    	else if( requestType === 'POST' ){
//    		// not sure how we post to a server side rendered system, probably just json!
// 	}
// }

// function handleJSON( req, requestType, res, pushData ) {
// 	var responseData;
// 	if( requestType === 'GET'){
// 		// fs.exists('./test/dummy_blogs.json', function (exists) {
// 	 //    	console.log( exists ? "it's there" : "not!");
// 		// });
// 		fs.readFile('./test/dummy_blogs.json', function( err, data ) {
// 			if( err ){
// 				console.log( "Error: " + err );
// 			}
// 			responseData =  {
// 				     			contentType: 'application/json',
// 					 			data        : data
// 				   			};
// 		   handleResponse( res, responseData );
// 		});
// 	}
	// else if( requestType === 'POST' ){
	// 	console.log( "data to post: " + req.body );

	// 	var fullBody = '';
        
 //        req.on('data', function(chunk) {
 //          // append the current chunk of data to the fullBody variable
 //          fullBody += chunk.toString();
 //        });
        
 //        req.on('end', function() {
	//    		fs.readFile('./test/dummy_blogs.json', function(err, data) {
	//     		var blogs = JSON.parse( data );
	//     		var decodedBody = querystring.parse(fullBody);
	//     		blogs.push( decodedBody);
	//     		fs.writeFile('./test/dummy_blogs.json', JSON.stringify(blogs, null, 4), function(err) {
	//     			responseData = {
	// 							     contentType: 'application/json',
	// 								 data        :  JSON.stringify(blogs)
	// 				   	   			};
	//     			handleResponse( res, responseData );

	//    			});	
	// 		});
 //   		});
	// }

// }

// function route ( req, res, handleResponse ) {

// 	// GET json blogs request
// 	// GET html string blogs request
// 	// POST new blog 

// 	// if pathname === '/' then return html string	
// 	// else if pathname === '/blogs.json'
// 			// if GET else if POST
// 	var pathname = url.parse(req.url).pathname;
//     console.log( "Query: " + url.parse(req.url).query);
//     var requestFormat = 'json';//url.parse(req.url).query.dataType;
//     var requestType = req.method;
//     console.log( "Request Format: " + requestFormat );
//     console.log( "Request Type: " + requestType );
// 	if( requestFormat && requestFormat.match(/html/) ){
// 		 handleHTML( requestType, res );		
// 	}
// 	else if( requestFormat && requestFormat.match(/json/) ){
// 		 handleJSON( req, requestType, res );
// 	}
// }


// module.exports = function handler(req, res) {

// 	// console.log( req );
// 	route( req, res );

// };

// getSearchData( req, function (fullBody) {
//    			var decodedBody = querystring.parse(fullBody);
//    			console.log( 'Query Data: ' + fullBody);
//    			var post = db.getPosts( {_id : decodedBody.id } );
//     		var renderedHTML = renderPage( 'blogpost', post );
//    		});
function getSearchData( req, processData ) {
	var fullBody = '';
        
    req.on('data', function(chunk) {
      // append the current chunk of data to the fullBody variable
      fullBody += chunk.toString();
      console.log( 'fullBOdy: ' + fullBody );
    });
    
    req.on('end', processData( fullBody ));
}

function renderPage( whichPage, data ){
	var path, fn;
	switch( whichPage ){
		case "index" :
			console.log('in case index');
			path = __dirname + "/templates/index.jade";
			fn = jade.compileFile(path);
			break;
		case "editpage" :
			path = __dirname + "/templates/edit.jade";
			fn = jade.compileFile(path);
			break;
		case "blogpage" :
			path = __dirname + "/templates/index.jade";
			fn = jade.compileFile(path);
			break;
		default :
			console.log( "Dont have a template for: " + whichPage );
			return;
	} 
	if( fn ) {
		console.log( 'fn exists ');
		return fn ( { posts : data } );
	}
}

function renderPageById( req, pageType, sendResponse ){
	var reqURL = url.parse( req.url, true );
	var blog_id = reqURL.query.id;
	var query = db.getPosts( blog_id );
	query.exec(function (err, posts) {
		console.log( 'In blogpage query.exec : ' + posts );
		sendResponse( renderPage( pageType, posts ) );		
	});
}
module.exports = {

	css: function handler(req, res ){
		fs.readFile("./css/index.css", function(err, contents) {
	        res.writeHead(200, {"Content-Type": "text/css"});
	        res.end(contents);
	    });
	},
    home: function handler(req, res) {
        // console.log("Request for " + pathname + " received.");
        var query = db.getPosts();//function( blogPosts ) {
    	query.exec(function (err, posts) {
    		console.log( 'In query.exec : ' + posts );
    	
   			var renderedHTML = renderPage( 'index', posts );
   			console.log("rendreed page:" + renderedHTML);
   			res.writeHead(200, {"Content-Type": "text/html"});
        	// res.write("Welcome");
        	res.end(renderedHTML );
        	// res.end( JSON.stringify( posts ));
    	});
        //});
    },
    blogpage: function handler ( req, res ) {
    	//var url = req.url; //blogpage?id=550034a5baf8cfd514db592d
    	renderPageById( req, 'blogpage', function( renderedHTML) {
    		res.writeHead(200, {"Content-Type": "text/html"});
    		res.end( renderedHTML );
    	});
    },
    editpage: function handler(req, res) {
    	renderPageById( req, 'editpage', function( renderedHTML) {
    		res.writeHead(200, {"Content-Type": "text/html"});
    		res.end( renderedHTML );
    	});
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

    }
};



