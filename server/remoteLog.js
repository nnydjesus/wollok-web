const fetch = require('node-fetch');

require('../resources/config.jsx');

const remoteLog = function(level, jsonBody) {
    const token = global.__CONFIG__.logentriesRestToken;
    jsonBody.level = level;
    const stringifiedBody = JSON.stringify(jsonBody);
    var postHeaders = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(stringifiedBody, 'utf8')
    };
    fetch("https://webhook.logentries.com/noformat/logs/" + token,
        {method: "POST", body: stringifiedBody, headers: postHeaders}).then(response => {
        if (response.status !== 204) {
            throw {"id": "logFailed", "status": response.status};
        }
    }).catch(err => {
        console.log("Unable to log remotely to Logentries using REST API", err);
    });
};

module.exports = exports = { remoteLog };