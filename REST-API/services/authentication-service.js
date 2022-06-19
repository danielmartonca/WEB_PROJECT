const databaseService = require('../services/database-service');
const httpUtils = require('../utilities/http-utils')
const {StatusCode} = require('status-code-enum')

async function register(request, response, body) {
    let accountExists = await databaseService.accountExistsByEmail(body.email);
    if (accountExists === true) {
        console.error(`Cannot create new account because account with email '${body.email}' already exists.`)
        httpUtils.buildResponse(response, StatusCode.ClientErrorConflict, null, `Cannot create new account because account with email '${body.email}' already exists.`);
        return;
    }

    let hasAddedAccount = await databaseService.registerAccount(body);
    if (!hasAddedAccount) {
        console.error("Failed to register new account.\n")
        httpUtils.buildResponse(response, StatusCode.ServerErrorInternal);
        return;
    }

    console.log("Registered new account.\n")
    httpUtils.buildResponse(response, StatusCode.SuccessCreated, null, "Successfully created new account.");
}

module.exports.register = register;