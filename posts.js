// Require mongoose and other node modules \\
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId; 
var uriUtil = require('mongodb-uri');
var http = require("http");
var url = require("url");
var fs = require("fs");

// mongoose.connect("mongodb://127.0.0.1:27017/blogpostdb");
var mongodbUri = 'mongodb://beechware:Pass1on8@ds039301.mongolab.com:39301/sord';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
mongoose.connect(mongooseUri);

// Get notification for connection success or failure \\
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
// db.once("open", function (callback) {
// 	console.log("connection made");
// });

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
var blogPostModel = mongoose.model("blogposts", blogSchema);

function formatID( searchCriteria ) {
	var query = { _id: new ObjectId(searchCriteria) };
	return query;
}
module.exports = {

	getPosts : function( searchCriteria ) {
		// searchCriteria = { _id : sf184943095043 }
		if( searchCriteria ) {
			searchCriteria = formatID( searchCriteria );
		}
	    return blogPostModel.find( searchCriteria );
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
	updatePost : function( post, successCB ) {
		var searchCriteria = formatID( post.id );
		var  update = post, 
  			 options = { multi: true };

		blogPostModel.update(searchCriteria, update, options, successCB);
	},
	deletePost : function( post ) {

	}
};



