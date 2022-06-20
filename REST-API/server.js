const http = require('http');
const httpUtils = require('./utilities/http-utils')
const {StatusCode} = require('status-code-enum')
const getController = require('./controllers/get-controller').getController;
const postController = require('./controllers/post-controller').postController;
const putController = require('./controllers/put-controller').putController;
const jwtService = require('./services/jwt-service');

const PORT = 8083;

const authorisationRequiredApis = new Set(["/getPetDetails", "/updatePetDetails", "/getPetImages", "/getPetVideos", "/getPetAudio", "/addPetImage", "/addPetVideo", "/addPetAudio"]);

http.createServer(function (request, response) {
    //while data is still being received -> do nothing
    let data = '';
    request.on('data', (chunk) => {
        data += chunk;
    });

    //after all the data has been retrieved
    request.on('end', async () => {
        let body = '';
        if (data !== '') {
            try {
                //transform it into json
                switch (request.headers["content-type"]) {
                    case "application/json":
                        body = JSON.parse(data);
                        break;
                    default:
                        body = data;
                        break;
                }
            } catch (e) {
                console.error(`Couldn't convert request body . Request body is:${'\n' + JSON.stringify(data)}\nException is:${e}`)
                httpUtils.buildResponse(response, StatusCode.ClientErrorBadRequest, {'ContentType': 'text/plain'}, `Invalid request body.`)
                return;
            }
        }

        //log all requests that are not GET
        if (request.method !== "GET" || authorisationRequiredApis.has(request.url)) console.log(`REQUEST:       ${request.method} ${request.url}${'\n' + JSON.stringify(body)}\n`);

        let token = '';
        //if the current api call requires authorisation look for 'Authorisation: Bearer tokenValue' header and check if tokenValue is a valid JWT token then verify it
        if (authorisationRequiredApis.has(request.url)) {
            if (request.headers.authorization === undefined) {
                console.log("User tried to access confidential resource without authorisation header.")
                httpUtils.buildResponse(response, StatusCode.ClientErrorUnauthorized, {'ContentType': 'text/plain'}, `Not authorised to access the resource.`)
                return;
            }

            if (!request.headers.authorization.includes('Bearer ')) {
                console.log("User tried to access confidential resource without authorisation header:  'Bearer tokenValue'.")
                httpUtils.buildResponse(response, StatusCode.ClientErrorUnauthorized, {'ContentType': 'text/plain'}, `Not authorised to access the resource.`)
                return;
            }

            token = request.headers.authorization.split(' ')[1];
            let isValid = await jwtService.verifyJwt(token);
            if (!isValid) {
                console.log("User tried to access unauthorised resource with invalid JWT token.")
                httpUtils.buildResponse(response, StatusCode.ClientErrorUnauthorized, {'ContentType': 'text/plain'}, `Not authorised to access the resource.`)
                return;
            }

            console.log("Token found and validated.");
        }

        switch (request.method) {
            case "GET":
                await getController(request, response, token)
                break;
            case "POST":
                await postController(request, response, body, token)
                break;
            case "PUT":
                await putController(request, response, body, token)
                break;
            default:
                console.error("HTTP METHOD NOT SUPPORTED");
        }
    });

}).listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);