const databaseService = require('../services/database-service');

function register(request, response) {
    request.setEncoding('utf8');
    request.on('data', function (bodyChunks) {
        console.log('Request body: ' + bodyChunks);
        const json = JSON.parse(bodyChunks);

        response.setHeader('Content-Type', 'application/json');
        databaseService.registerUser(json, response);
    });
}

module.exports.register = register;