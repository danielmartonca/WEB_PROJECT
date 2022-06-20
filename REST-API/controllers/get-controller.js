const baseService = require('../services/base-service')
const animalsService = require('../services/animals-service')

async function getController(request, response, jwt = "") {
    switch (request.url) {
        case "/getPetDetails":
            await animalsService.getPetDetails(request, response, jwt);
            break;
        case "/getPetProfilePicture":
            await animalsService.getPetProfilePicture(request, response, jwt);
            break;
        case "/getPetImages":
            await animalsService.getPetMedia(request, response, jwt, 'images');
            break;
        case "/getPetVideos":
            await animalsService.getPetMedia(request, response, jwt, 'videos');
            break;
        case "/getPetAudio":
            await animalsService.getPetMedia(request, response, jwt, 'audio');
            break;
        case "/getMealPlan":
            await animalsService.getMealPlan(request, response, jwt);
            break;
        default:
            baseService.handleFiles(request, response);
            break;
    }
}

module.exports.getController = getController;