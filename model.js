// Require mongoose and other node modules \\
var mongoose = require("mongoose");
var http = require("http");
var url = require("url");
var fs = require("fs");
var uriUtil  = require('mongodb-uri');

var mongodbUri = 'mongodb://beechware:Pass1on8@ds039301.mongolab.com:39301/sord';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri);

// Get notification for connection success or failure \\
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
	console.log("connection made");
});

// Define database schema which determines which properties we want to store \\
var blogSchema = mongoose.Schema({
	author : String,
	title  : String,
	text   : String,
	date   : Object,
	image  : String
});

// Adding method to the schema. Have to be defined before schema is compiled \\
blogSchema.methods.announce = function() {
	var author = this.author ? "Another blog post by " + this.author : "Anonymous blog post";
	console.log(author);
};

// Compile schema into a model, which defines the database collection \\
// First argument is collection name, second argument is schema name  \\
var blogPostModel = mongoose.model("blogPosts", blogSchema);

console.log( "blogPOPO" + blogPostModel);




module.exports = {

	getPosts : function( searchCriteria, doSomethingWithResults ) {
	    return blogPostModel.find();
	 //    function(err, blogPosts) {
		// 	console.log( 'In blogPostModel : ' + blogPosts);
		// 	if( err ) {
		// 		console.log( 'Error: ' + err );
		// 	}
		// 	doSomethingWithResults( blogPosts );
		// });

	},
	addPost  : function( newPost, successCB ) {
		var post = new blogPostModel(newPost);
		console.log( 'Post model: ' + post );
		post.save(function (err) {
		  if (err) {
		  	console.log( 'Error: ' + err );
		  } 
		  console.log( 'Saved to the collection!');
		  successCB( err );
		});
	},
	updatePost : function( post ) {

	},
	deletePost : function( post ) {

	}
};

// Example blog post 
var testPost = new blogPostModel({ author : "bob smith",
							   title : "read these words", 
							   	text : "this is some informatioon about an interesting topic of my choice",
							    date : "new data object",
							   image : "img src ='www.google.com/images/pineapple"
							});

// Saves submitted blog post to database and displays a message confirming \\
testPost.save(function(err, testPost){
	if (err) return console.error(err);
	testPost.announce();
});

