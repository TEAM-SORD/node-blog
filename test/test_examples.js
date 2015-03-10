// var shot = require("shot");
// var server = require("../handler");
// var assert = require("assert");
// var request;

// describe("Main page (reading view)", function () {
//     // request for html response will look like: http://localhost:8888/main?type=html
//     // request for json reqponse will look like: http://localhost:8888/main?type=json
//     request = {
//             method: "GET",
//             url: "/"
//     };

//     it("should respond with an OK status code", function (done) {

//         shot.inject(server, request, function (res) {
//             assert.equal(res.statusCode, 200);
//             done();
//         });

//     });
//     it("should respond with blogs in default html format", function (done) {

//         shot.inject(server, request, function (res) {
//             assert.equal(res.statusCode, 200);
//             done();
//         });

//     });
//     it("should respond with blogs in default html format", function (done) {

//         request.url = "/blogs.json";
//         shot.inject(server, request, function (res) {
//             console.log( res );
//             assert.equal(res.length, 2);
//             done();
//         });

//     });
// });