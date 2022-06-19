const baseService = require('../services/base-service')
const registerService = require('../services/authentication-service');

function postController(request, response, body) {
    switch (request.url) {
        case "/authentication/register":
            registerService.register(request, response);
            break;
        default:
            baseService.handle404(request, response);
            break;
    }
}

module.exports.postController = postController;