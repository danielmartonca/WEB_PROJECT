const baseService = require('../services/base-service')
const authenticationService = require('../services/authentication-service');

function postController(request, response, body) {
    switch (request.url) {
        case "/authentication/register":
            authenticationService.register(request, response, body);
            break;
        case "/authentication/login":
            authenticationService.login(request, response, body);
            break;
        default:
            baseService.handle404(request, response);
            break;
    }
}

module.exports.postController = postController;