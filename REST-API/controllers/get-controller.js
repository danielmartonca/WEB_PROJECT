const handleBaseUrl = require('../services/base-service').handleBaseUrl;

function getController(request, response) {
    switch (request.url) {
        //TODO other endpoints
        default:
            handleBaseUrl(request, response);
            break;
    }
}

module.exports.getController = getController;