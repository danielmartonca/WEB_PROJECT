const jwt = require('jsonwebtoken');
const fs = require("fs");

const privateKey = fs.readFileSync('REST-API/private.key');

function generateJwt(account) {
    try {
        return jwt.sign({
            data: account
        }, privateKey, {
            expiresIn: '24h',
        });
    } catch (e) {
        console.error(`Error while generating new JWT for account ${JSON.stringify(account)}. Error is:\n${e}`);
        return null;
    }
}

async function verifyJwt(token) {
    try {
        const decoded = await jwt.verify(token, privateKey);
        return true;
    } catch (err) {
        return false;
    }
}

module.exports.generateJwt = generateJwt;
module.exports.verifyJwt = verifyJwt;