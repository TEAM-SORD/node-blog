
var fs = require('fs');
var url = require("url");
var db = require('./posts.js');
var jade = require("jade");


var querystring = require('querystring'),
	utils = require('util');

var allPosts = [];

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
		decodedBody.date = new Date();
		if( decodedBody.id ){
			console.log( 'Found id so update.');
			db.updatePost(decodedBody, function(err, numAffected) {
				// numAffected is the number of updated documents
				console.log( ( err )? 'Error posting to db: ' + err : 'Number of posts updated (1): ' + numAffected );
				sendResponse();
			});
		}
		else {
			console.log( 'No id found so insert.');
			db.addPost(decodedBody, function (err){
				console.log( ( err )? 'Error posting to db: ' + err : 'Successfully added to db');
				sendResponse();
			});
		}
	});
}
function writeHTMLToResponse( res, renderedHTML ){
	res.writeHead(200, {"Content-Type": "text/html"});
	res.end(renderedHTML );
}
function getPostsForSideBar( req, res, renderOtherPane ){
	var query = db.getPosts();
	query.sort( {date: 'descending'} ).exec( function (err, posts) {
		console.log( 'In getPostsForSideBar - query.exec : ' + posts );
		allPosts = posts;
		renderOtherPane( allPosts );
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
    	console.log("Home page Handler called.");
    	getPostsForSideBar( req, res, function( allPosts ) {
    		var renderedHTML = renderPage( 'home', { posts : allPosts, postlist: allPosts } );
    		writeHTMLToResponse( res, renderedHTML );
    	} );
    },
    blogpage: function handler ( req, res ) {
    	console.log("BlogPage Handler called.");
    	getPostsForSideBar( req, res, function( allPosts ) {
    		var reqURL = url.parse( req.url, true );
			var blog_id = reqURL.query.id;
			var query = db.getPosts( blog_id );
			query.exec(function (err, post) {
    			var renderedHTML = renderPage( 'blogpage', { posts : post, postlist: allPosts } );
				writeHTMLToResponse( res, renderedHTML );
			});
    	});
    },
    editpage: function handler(req, res) {
        console.log("Edit Handler called.");
        var reqURL = url.parse( req.url, true );
		var blog_id = reqURL.query.id;	
        getPostsForSideBar( req, res, function( allPosts ) {    		
			var query = db.getPosts( blog_id );
			query.exec(function (err, post) {
				post = ( blog_id )? post : "";
    			var renderedHTML = renderPage( 'editpage', { posts : post, postlist: allPosts } );
				writeHTMLToResponse( res, renderedHTML );
			});
    	});
    },
    create: function handler(req, res) {
        console.log("Create Handler called.");
        getPostsForSideBar( req, res, function( allPosts ) {
    		var renderedHTML = renderPage( 'editpage', { posts : "", postlist: allPosts } );
    		writeHTMLToResponse( res, renderedHTML );
    	} );
    },
	update: function handler(req, res) {
        console.log("Update Handler called.");
        
		//if PUT then do DB update
		// if POST then do DB insert/add
		insertOrUpdate( req, function(){
			getPostsForSideBar( req, res, function( allPosts ) {
    			var renderedHTML = renderPage( 'home', { posts : allPosts, postlist: allPosts } );
    			writeHTMLToResponse( res, renderedHTML );
    		});
		});
    },
    delete: function handler(req, res) {

	    res.writeHead(200, {"Content-Type": "text/plain"});
	    res.write("Welcome");
	    res.end(" to delete article");

    }
};



