const databaseService = require('../services/database-service');
const httpUtils = require('../utilities/http-utils')
const {StatusCode} = require('status-code-enum')
const jwtService = require("./jwt-service");
const blobService = require('./blob-service');

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
    const extractedAccount = await databaseService.getAccountByEmailAndPassword(account.email, account.password);
    petDetails['Name'] = extractedAccount.Name;
    petDetails['FamilyName'] = extractedAccount.FamilyName;
    petDetails['Gender'] = extractedAccount.Gender;
    console.log(`Pet details to be sent:\n${JSON.stringify(petDetails)}\n`)
    httpUtils.buildResponse(response, StatusCode.SuccessOK, {'ContentType': 'application/json'}, petDetails);
}

async function updatePetDetails(request, response, jwt, petDetails) {
    //extract account from jwt
    const account = await jwtService.extractAccount(jwt);
    if (account == null) {
        httpUtils.buildResponse(response, StatusCode.ServerErrorInternal, null, "An unexpected error has occurred.");
        return;
    }

    let hasUpdated = await databaseService.updatePetDetails(account.email, account.password, petDetails);
    if (hasUpdated == null) {
        console.error("Failed to update pet details.");
        httpUtils.buildResponse(response, StatusCode.ServerErrorInternal, null, "An unexpected error has occurred.");
    }

    //if everything was ok
    console.log(`Pet details updated:\n${JSON.stringify(petDetails)}\n`)
    httpUtils.buildResponse(response, StatusCode.SuccessOK, {'ContentType': 'application/json'}, petDetails);
}

async function getPetMedia(request, response, jwt, mediaType) {
    //extract account from jwt
    const account = await jwtService.extractAccount(jwt);
    if (account == null) {
        httpUtils.buildResponse(response, StatusCode.ServerErrorInternal, null, "An unexpected error has occurred.");
        return;
    }

    let emailTruncated = account.email.split("@")[0];
    //extract pet media from file system
    let filesBytesList = await blobService.readFiles(emailTruncated, mediaType);
    if (filesBytesList === null) {
        console.error(`Failed to get pet ${mediaType} for account with email ${account.email}\n`)
        httpUtils.buildResponse(response, StatusCode.ServerErrorInternal, null, `Failed to get ${mediaType}.`);
        return;
    }

    //if everything was ok
    console.log(`Number of files extracted that will be sent to the user:\n${filesBytesList.length}\n`)
    httpUtils.buildResponse(response, StatusCode.SuccessOK, {'ContentType': 'application/json'}, filesBytesList);
}

async function getPetProfilePicture(request, response, jwt) {
    //extract account from jwt
    const account = await jwtService.extractAccount(jwt);
    if (account == null) {
        httpUtils.buildResponse(response, StatusCode.ServerErrorInternal, null, "An unexpected error has occurred.");
        return;
    }

    let emailTruncated = account.email.split("@")[0];
    //extract pet media from file system
    let profilePictureBytes = await blobService.readFile(emailTruncated, 'images', 'profilePicture.png');

    if (profilePictureBytes === null) {
        console.error(`Failed to get pet profilePicture for account with email ${account.email}\n`)
        httpUtils.buildResponse(response, StatusCode.ServerErrorInternal, null, `Failed to get profilePicture.`);
        return;
    }

    if (profilePictureBytes === false) {
        console.log(`Account with email ${account.email} does not have a profile picture set\n`)
        httpUtils.buildResponse(response, StatusCode.SuccessOK, null, ``);
        return;
    }

    //if everything was ok
    console.log(`Extracted profile picture.\n`)
    httpUtils.buildResponse(response, StatusCode.SuccessOK, {'ContentType': 'application/json'}, profilePictureBytes);
}

async function uploadPetProfilePicture(request, response, body, jwt) {
    //extract account from jwt
    const account = await jwtService.extractAccount(jwt);
    if (account == null) {
        httpUtils.buildResponse(response, StatusCode.ServerErrorInternal, null, "An unexpected error has occurred.");
        return;
    }

    let emailTruncated = account.email.split("@")[0];
    //extract pet media to the file system
    let hasCreatedFile = await blobService.writeFile(emailTruncated, 'images', 'profilePicture.png', body.bytes);
    if (hasCreatedFile === null) {
        console.error(`Failed to create profile picture file for account with email ${account.email}\n`)
        httpUtils.buildResponse(response, StatusCode.ServerErrorInternal, null, `Failed to create profile picture file.`);
        return;
    }

    //if everything was ok
    console.log(`File was uploaded successfully.`)
    httpUtils.buildResponse(response, StatusCode.SuccessOK, {'ContentType': 'application/json'}, "File was uploaded successfully.");
}

async function addPetMedia(request, response, body, jwt, mediaType) {
    //extract account from jwt
    const account = await jwtService.extractAccount(jwt);
    if (account == null) {
        httpUtils.buildResponse(response, StatusCode.ServerErrorInternal, null, "An unexpected error has occurred.");
        return;
    }

    let emailTruncated = account.email.split("@")[0];
    //extract pet media from file system
    let hasCreatedFile = await blobService.writeFile(emailTruncated, mediaType, body.file, body.bytes);
    if (hasCreatedFile === null) {
        console.error(`Failed to create ${mediaType} file for account with email ${account.email}\n`)
        httpUtils.buildResponse(response, StatusCode.ServerErrorInternal, null, `Failed to create ${mediaType} file.`);
        return;
    }

    //if everything was ok
    console.log(`File was uploaded successfully.`)
    httpUtils.buildResponse(response, StatusCode.SuccessOK, {'ContentType': 'application/json'}, "File was uploaded successfully.");
}

module.exports.getPetProfilePicture = getPetProfilePicture;
module.exports.uploadPetProfilePicture = uploadPetProfilePicture;
module.exports.getPetDetails = getPetDetails;
module.exports.updatePetDetails = updatePetDetails;
module.exports.getPetMedia = getPetMedia;
module.exports.addPetMedia = addPetMedia;