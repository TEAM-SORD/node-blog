# TESTING

We are using [shot](https://www.npmjs.com/package/shot) to inject requests to the handler. This means we do not have to start the server or make real HTTP requests through the network stack. Instead, we inject mock requests directly to the handler and receive mock responses that we can then test. This saves us A LOT of time (real HTTP requests are slow).
### Tools
* We are writing acceptance tests using Mocha and Shot.
* We are using node's core Assert module for assertions.
* We are writing HTTP servers using node.

### Commands

* Install dependencies with ``` npm install ```
* Start the server with ``` make s ``` or ```node server.js```
* Run the tests with ``` make t ``` or ``` npm test ```


## USER STORIES
 * As a user I would like to see an excerpt of the 'n' most recent blog posts when I first open the page
 * As a user I would like to see a side pane list of past blog posts titles
 * As a user I would like to be able to view an entire blog post in a separate page when I select 'read more'
 * As a user I would like to be able to select one of the older posts from the list and have an excerpt displayed on the main page
 * As a user I would like to add a new post 
 * As a user I would like to edit a post
 * As a user I would like a separate editing/new post page.
 * As a user I would like to delete a post

## TESTING HTML AND JSON
 * We need to test that a client request(GET, POST, DELETE) is met with a successful response, however it is trickier to extract the data we want to check from html than JSON.  Therefore, it may be easier to test that the content of a server rendered page contains what we expect it to by looking at the data in it's json form.
 
