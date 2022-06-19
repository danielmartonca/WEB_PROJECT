const baseService = require('../services/base-service')

function getController(request, response, body) {
    switch (request.url) {
        default:
            baseService.handleFiles(request, response);
            break;
    }
}

module.exports.getController = getController;