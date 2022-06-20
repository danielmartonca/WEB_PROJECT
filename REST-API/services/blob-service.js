const fs = require('fs');

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

module.exports.readFiles = readFiles;
