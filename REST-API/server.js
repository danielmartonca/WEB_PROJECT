const http = require('http');
const getController = require('./controllers/get-controller').getController;
const postController = require('./controllers/post-controller').postController;

const PORT = 8083;

http.createServer(function (request, response) {
    switch (request.method) {
        case "GET":
            getController(request, response)
            break;
        case "POST":
            postController(request, response)
            break;
        default:
            console.error("HTTP METHOD NOT SUPPORTED");
    }
}).listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);