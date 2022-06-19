const databaseService = require('../services/database-service');
const httpUtils = require('../utilities/http-utils')
const {StatusCode} = require('status-code-enum')
const jwtService = require('./jwt-service')

const nameRegex = RegExp("^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð,.'-]+$")
const familyNameRegex = RegExp("^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð,.'-]+$")
const emailRegex = RegExp("^[\\w-\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
const passwordRegex = RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")

async function register(request, response, body) {
    //check if fields are matching regex patterns
    if (nameRegex.test(body.name) === false) {
        console.error(`Invalid name '${body.name}'.`)
        httpUtils.buildResponse(response, StatusCode.ClientErrorBadRequest, null, `Invalid name '${body.name}'.`);
        return;
    }
    if (familyNameRegex.test(body.familyname) === false) {
        console.error(`Invalid familyname '${body.familyname}'.`)
        httpUtils.buildResponse(response, StatusCode.ClientErrorBadRequest, null, `Invalid familyname '${body.familyname}'.`);
        return;
    }
    if (emailRegex.test(body.email) === false) {
        console.error(`Invalid email '${body.email}'.`)
        httpUtils.buildResponse(response, StatusCode.ClientErrorBadRequest, null, `Invalid email '${body.email}'.`);
        return;
    }
    if (passwordRegex.test(body.password) === false) {
        console.error(`Invalid name '${body.password}'.`)
        httpUtils.buildResponse(response, StatusCode.ClientErrorBadRequest, null, `Invalid password '${body.password}'.`);
        return;
    }

    //check if account with the given email already exists
    let accountExists = await databaseService.accountExistsByEmail(body.email);
    if (accountExists === true) {
        console.error(`Cannot create new account because account with email '${body.email}' already exists.`)
        httpUtils.buildResponse(response, StatusCode.ClientErrorConflict, null, `Cannot create new account because account with email '${body.email}' already exists.`);
        return;
    }

    //register the account
    let hasAddedAccount = await databaseService.registerAccount(body);
    if (!hasAddedAccount) { //if it failed for some reason
        console.error("Failed to register new account.\n")
        httpUtils.buildResponse(response, StatusCode.ServerErrorInternal);
        return;
    }

    //if everything was ok
    console.log("Registered new account.\n")
    httpUtils.buildResponse(response, StatusCode.SuccessCreated, null, "Successfully created new account.");
}

async function login(request, response, body) {
    //check if fields are matching regex patterns
    if (emailRegex.test(body.email) === false) {
        console.error(`Invalid email '${body.email}'.`)
        httpUtils.buildResponse(response, StatusCode.ClientErrorBadRequest, null, `Invalid email '${body.email}'.`);
        return;
    }
    if (passwordRegex.test(body.password) === false) {
        console.error(`Invalid name '${body.password}'.`)
        httpUtils.buildResponse(response, StatusCode.ClientErrorBadRequest, null, `Invalid password '${body.password}'.`);
        return;
    }

    //check if account with the given email already exists
    let accountExists = await databaseService.accountExistsByCredentials(body.email, body.password);
    if (accountExists === false) {
        console.log(`Account with the fallowing credentials doesn't exists '${JSON.stringify(body)}'.`)
        httpUtils.buildResponse(response, StatusCode.ClientErrorUnauthorized, null, `Account with the given credentials doesn't exist.`);
        return;
    }

    console.log("Account found. Creating new token and returning it to the user.\n")
    const jwtToken = jwtService.generateJwt({'email': body.email, 'password': body.password});

    if (jwtToken === null) {
        httpUtils.buildResponse(response, StatusCode.ServerErrorInternal, null, `An unexpected error has occurred.`);
        return;
    }
    console.log(`Generated new jwt token for the account: ${jwtToken}`);

    //if everything was ok
    httpUtils.buildResponse(response, StatusCode.SuccessOK,
        {
            'Authorization': `Bearer ${jwtToken}`,
            'ContentType': 'application/json'
        }, "Successfully logged in.");
}

module.exports.register = register;
module.exports.login = login;