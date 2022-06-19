const databaseService = require('../services/database-service');
const httpUtils = require('../utilities/http-utils')
const {StatusCode} = require('status-code-enum')
const jwtService = require("./jwt-service");


async function getPetDetails(request, response, jwt) {
    //extract account from jwt
    const account = await jwtService.extractAccount(jwt);
    if (account == null) {
        httpUtils.buildResponse(response, StatusCode.ServerErrorInternal, null, "An unexpected error has occurred.");
        return;
    }

    //extract pet details from database
    let petDetails = await databaseService.getPetDetails(account.email, account.password);
    if (petDetails === null) {
        console.error(`Failed to get pet details for account with email ${account.email}\n`)
        httpUtils.buildResponse(response, StatusCode.ServerErrorInternal, null, `Failed to get pet details.`);
        return;
    }

    //if everything was ok
    console.log(`Pet details extracted:\n${JSON.stringify(petDetails)}\n`)
    httpUtils.buildResponse(response, StatusCode.SuccessOK, {'ContentType': 'application/json'}, JSON.stringify(petDetails));
}

module.exports.getPetDetails = getPetDetails;