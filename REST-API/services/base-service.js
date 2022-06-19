const path = require("path");
const fs = require("fs");


function handleFiles(request, response) {
    let filePath = '.' + request.url;
    if (filePath === './') {
        filePath = './Login.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code === 'ENOENT') handle404(request, response); else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            response.writeHead(200, {'Content-Type': contentType});
            response.end(content, 'utf-8');
        }
    });
}

function handle404(request, response) {
    fs.readFile('./404.html', function (error, content) {
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.end(content, 'utf-8');
    });
}

module.exports.handleFiles = handleFiles;
module.exports.handle404 = handle404;