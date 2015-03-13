var fs = require('fs');
var url = require("url");
var db = require('./posts.js');
var jade = require("jade");

var querystring = require('querystring'),
	utils = require('util');

var allPosts = [];
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


function getSearchData( req, processData ) {
	var fullBody = '';
        
    req.on('data', function(chunk) {
      // append the current chunk of data to the fullBody variable
      fullBody += chunk.toString();
    });
    
    req.on('end', processData());
}

function renderPage( whichPage, data ){
	var path, fn;
	switch( whichPage ){
		case "home" :
			console.log('in case index');
			path = __dirname + "/templates/index.jade";
			fn = jade.compileFile(path);
			break;
		case "editpage" :
			path = __dirname + "/templates/edit.jade";
			fn = jade.compileFile(path);
			break;
		case "blogpage" :
			path = __dirname + "/templates/post.jade";
			fn = jade.compileFile(path);
			break;
		case "createpost" :
			path = __dirname + "/templates/new.jade";
			fn = jade.compileFile(path);
			break;
		default :
			console.log( "Dont have a template for: " + whichPage );
			return;
	} 
	if( fn ) {
		console.log( 'fn exists: data.posts: '+ data.posts );
		return fn ( data);
	}
}

/*function renderPageById( req, pageType, sendResponse ){
	var requestType = req.method;
	console.log( 'request type in renderPageById: ' + requestType );
	if( requestType === 'GET') {
		console.log( 'In GET' );
		var reqURL = url.parse( req.url, true );
		var blog_id = reqURL.query.id;
		var query = db.getPosts( blog_id );
		query.exec(function (err, posts) {
			console.log( 'In GET query.exec : ' + posts );
			sendResponse( renderPage( pageType, posts ) );		
		});
	}
	else if( requestType === 'PUT '){
		console.log( 'In PUT' );
		req.on('data', function(chunk) {
      		// append the current chunk of data to the fullBody variable
      		fullBody += chunk.toString();
    	});
    
    	req.on('end', function() {
			console.log( 'fullBody: ' + fullBody );
			var decodedBody = querystring.parse(fullBody);
			console.log( 'DecodedBody: ' + decodedBody );
			db.updatePost(decodedBody, function(err, numAffected) {
  				// numAffected is the number of updated documents
				console.log( 'Error posting to db: ' + err );
				console.log( 'Number of posts updated (should be one): ' + numAffected );
				sendResponse( renderPage( pageType, posts ) );
			});
		});
	}
	else if( requestType === 'POST' ) {
		console.log( 'In POST' );
		//getSearchData( req, function() {
		var fullBody = '';
        
    	req.on('data', function(chunk) {
      		// append the current chunk of data to the fullBody variable
      		fullBody += chunk.toString();
    	});
    
    	req.on('end', function() {
			console.log( 'fullBody: ' + fullBody );
			var decodedBody = querystring.parse(fullBody);
			console.log( 'DecodedBody: ' + decodedBody );
			db.addPost(decodedBody, function(err){
				console.log( 'Error posting to db: ' + err );
			});
		});
	}
}
*/
function insertOrUpdate(req, sendResponse){
	console.log( 'In insertOrUpdate.');
	console.log( 'Req.method: ' + req.method );

	var fullBody = '';
	req.on('data', function(chunk) {
      		// append the current chunk of data to the fullBody variable
      		fullBody += chunk.toString();
	});
    
	req.on('end', function() {
		console.log( 'fullBody: ' + fullBody );
		var decodedBody = querystring.parse(fullBody);
		console.log( 'DecodedBody: ' + decodedBody.id );
		decodedBody.date = new Date();
		if( decodedBody.id ){
			console.log( 'Found id so update.');
			db.updatePost(decodedBody, function(err, numAffected) {
				// numAffected is the number of updated documents
				if( err ){
					console.log( 'Error posting to db: ' + err  );
				}
				else {
					console.log( 'Number of posts updated (should be one): ' + numAffected );
				}
				sendResponse();
			});
		}
		else {
			console.log( 'No id found so insert.');
			db.addPost(decodedBody, function (err){
				if( err ) {
					console.log( 'Error posting to db: ' + err );
				}
				else {
					console.log( 'Successfully added to db');
				}
				sendResponse();
			});
		}
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
        var query = db.getPosts();
    	query.sort({date: 'descending'}).exec(function (err, posts) {
    		console.log( 'In home handler - query.exec : ' + posts );
    		allPosts = posts;
   			var renderedHTML = renderPage( 'home', { posts : allPosts, postlist: allPosts } );
   			console.log("rendreed page:" + renderedHTML);
   			res.writeHead(200, {"Content-Type": "text/html"});
        	res.end(renderedHTML );
    	});
    },
    blogpage: function handler ( req, res ) {
      	var query = db.getPosts();
		query.sort({date: 'descending'}).exec(function (err, posts) {
			allPosts = posts;
			var reqURL = url.parse( req.url, true );
			var blog_id = reqURL.query.id;
			var query = db.getPosts( blog_id );
			query.exec(function (err, post) {
				console.log( 'In blog page handler query.exec : ' + posts );
				res.writeHead(200, {"Content-Type": "text/html"});
    			res.end( renderPage( 'blogpage', { posts : post, postlist: allPosts }));
	    	});
		});
    },
    editpage: function handler(req, res) {
        console.log("Edit Handler called.");
        var query = db.getPosts();
		query.sort({date: 'descending'}).exec(function (err, posts) {
			allPosts = posts;
			var reqURL = url.parse( req.url, true );
			var blog_id = reqURL.query.id;
			console.log( 'Open Edit Page with Blog: ' + blog_id );
			if( blog_id ) {
				var query = db.getPosts( blog_id );
				query.exec(function (err, post) {
					console.log( 'Post found: ' + post );
					res.writeHead(200, {"Content-Type": "text/html"});
	    			res.end( renderPage( 'editpage', { posts : post, postlist: allPosts }));
	    		});
    		}
    		else{
				res.writeHead(200, {"Content-Type": "text/html"});
    			res.end( renderPage( 'editpage', { posts : "", postlist: allPosts }));    			
    		}
		});
    	
    },
    create: function handler(req, res) {
        console.log("Create Handler called.");
       
        var query = db.getPosts();
		query.sort({date: 'descending'}).exec(function (err, posts) {
			console.log( 'In create new post handler query.exec : ' + posts );
			allPosts = posts;
			res.writeHead(200, {"Content-Type": "text/html"});
    		res.end( renderPage( 'editpage', { posts : "", postlist: allPosts }));
		});

    },
	update: function handler(req, res) {
        console.log("Update Handler called.");
        
		//if PUT then do DB update
		// if POST then do DB insert/add
		insertOrUpdate( req, function(){
			var query = db.getPosts();
			query.sort({date: 'descending'}).exec(function (err, posts) {
				allPosts = posts;

				res.writeHead(200, {"Content-Type": "text/html"});
				res.end( renderPage( 'home', { posts : allPosts, postlist: allPosts }));
			});
		});
    },
    delete: function handler(req, res) {

	    res.writeHead(200, {"Content-Type": "text/plain"});
	    res.write("Welcome");
	    res.end(" to delete article");

    }
};



