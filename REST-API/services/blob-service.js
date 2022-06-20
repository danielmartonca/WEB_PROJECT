const fs = require('fs');
const base64 = require('base64-arraybuffer')
const arrayBufferToBuffer = require('arraybuffer-to-buffer');

async function readFiles(userEmailTruncated, directory) {
    try {
        let images = [];
        let filenames = fs.readdirSync(`REST-API/blob/users/${userEmailTruncated}/${directory}`);
        filenames.forEach(file => {
            console.log(`Reading file ${`REST-API/blob/users/${userEmailTruncated}/${directory}/` + file}`);
            const data = fs.readFileSync(`REST-API/blob/users/${userEmailTruncated}/${directory}/` + file);
            console.log(`Successfully read file ${`REST-API/blob/users/${userEmailTruncated}/${directory}/` + file}`);
            images.push(data.toString("base64"));
        });
        return images;
    } catch (e) {
        console.error(`Exception while reading files at /REST-API/blob/users/${userEmailTruncated}/${directory} . Exception is:\n${e}`);
        return null;
    }
}

async function writeFile(userEmailTruncated, directory, file, fileBytes) {
    try {
        console.log(`Creating file at /REST-API/blob/users/${userEmailTruncated}/${directory}/${file}`);
        fs.writeFileSync(`REST-API/blob/users/${userEmailTruncated}/${directory}/${file}`, arrayBufferToBuffer(base64.decode(fileBytes)));
        console.log(`Successfully created file /REST-API/blob/users/${userEmailTruncated}/${directory}/${file}`);
        return true;
    } catch (e) {
        console.error(`Exception while writing file at /REST-API/blob/users/${userEmailTruncated}/${directory}/${file} . Exception is:\n${e}`);
        return null;
    }
}

module.exports.readFiles = readFiles;
module.exports.writeFile = writeFile;
