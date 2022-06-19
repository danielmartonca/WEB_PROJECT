const baseService = require('../services/base-service')
const animalsService = require('../services/animals-service')
const jwtService = require('../services/jwt-service')
const httpUtils = require('../utilities/http-utils')
const {StatusCode} = require('status-code-enum')

async function getController(request, response, jwt = "") {
    switch (request.url) {
        case "/getPetDetails":
            const account = await jwtService.extractAccount(jwt);
            if (account == null) {
                httpUtils.buildResponse(response, StatusCode.ServerErrorInternal, null, "An unexpected error has occurred.");
                return;
            }
            await animalsService.getPetDetails(request, response, account);
            break;
        default:
            baseService.handleFiles(request, response);
            break;
    }
}

module.exports.getController = getController;