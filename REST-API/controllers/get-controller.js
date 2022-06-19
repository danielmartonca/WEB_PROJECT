const baseService = require('../services/base-service')
const animalsService = require('../services/animals-service')

async function getController(request, response, jwt = "") {
    switch (request.url) {
        case "/getPetDetails":
            await animalsService.getPetDetails(request, response, jwt);
            break;
        default:
            baseService.handleFiles(request, response);
            break;
    }
}

module.exports.getController = getController;