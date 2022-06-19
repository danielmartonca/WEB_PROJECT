const handleBaseUrl = require('../services/base-service').handleBaseUrl;
const registerService = require('../services/authentication-service');

function postController(request, response) {
    switch (request.url) {
        case "/authentication/register":
            console.log(`${request.method} ${request.url} `);
            registerService.register(request, response);
            break;
        default:
            handleBaseUrl(request, response);
            break;
    }
}

module.exports.postController = postController;