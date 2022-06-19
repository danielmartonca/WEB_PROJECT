function buildResponse(response, httpStatus, headers = undefined, body = "") {
    if (headers === undefined) headers = {};

    if (body !== "") {
        if (typeof body == "string") {
            headers['ContentType'] = 'text/plain';
            response.writeHead(httpStatus, headers);
            response.write(body, 'utf-8');
        } else {
            headers['ContentType'] = 'application/json';
            response.writeHead(httpStatus, headers);
            response.write(JSON.stringify(body), 'utf-8');
        }
    } else
        response.writeHead(httpStatus, headers);

    response.end();
}


module.exports.buildResponse = buildResponse;