const baseService = require('../services/base-service')
const animalsService = require('../services/animals-service');

async function putController(request, response, body, jwt = "") {
    switch (request.url) {
        case "/addPetImage":
            await animalsService.addPetMedia(request, response, body, jwt, "images");
            break;
        case "/addPetVideo":
            await animalsService.addPetMedia(request, response, body, jwt, "videos");
            break;
        case "/addPetAudio":
            await animalsService.addPetMedia(request, response, body, jwt, "audio");
            break;
        default:
            baseService.handle404(request, response);
            break;
    }
}

module.exports.putController = putController;