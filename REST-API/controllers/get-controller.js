const baseService = require('../services/base-service')
const animalsService = require('../services/animals-service')
const jwtService = require('../services/jwt-service')
const httpUtils = require('../utilities/http-utils')
const {StatusCode} = require('status-code-enum')

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