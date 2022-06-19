const baseService = require('../services/base-service')
const authenticationService = require('../services/authentication-service');
const animalsService = require('../services/animals-service');

async function postController(request, response, body, jwt = "") {
    switch (request.url) {
        case "/authentication/register":
            await authenticationService.register(request, response, body);
            break;
        case "/authentication/login":
            await authenticationService.login(request, response, body);
            break;
        case "/updatePetDetails":
            await animalsService.updatePetDetails(request, response,jwt, body);
            break;
        default:
            baseService.handle404(request, response);
            break;
    }
}

module.exports.postController = postController;