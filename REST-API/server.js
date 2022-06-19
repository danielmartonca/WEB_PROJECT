const http = require('http');
const httpUtils = require('./utilities/http-utils')
const {StatusCode} = require('status-code-enum')
const getController = require('./controllers/get-controller').getController;
const postController = require('./controllers/post-controller').postController;

const PORT = 8083;

http.createServer(function (request, response) {
    let data = '';
    request.on('data', (chunk) => {
        data += chunk;
    });

    request.on('end', () => {
        let json = '';
        if (data !== '') {
            try {
                json = JSON.parse(data);
            } catch (e) {
                console.error(`Couldn't convert request body to json.Request body is:${'\n' + JSON.stringify(data)}`)
                httpUtils.buildResponse(response, StatusCode.ClientErrorBadRequest, {'ContentType': 'text/plain'}, `Invalid request body. Expected json but received:\n'${data}'`)
                return;
            }
        }

        if (request.method !== "GET") console.log(`REQUEST:       ${request.method} ${request.url}${'\n' + JSON.stringify(json)}\n`);

        switch (request.method) {
            case "GET":
                getController(request, response, json)
                break;
            case "POST":
                postController(request, response, json)
                break;
            default:
                console.error("HTTP METHOD NOT SUPPORTED");
        }
    });

}).listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);