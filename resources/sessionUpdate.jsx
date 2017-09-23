import fetch from 'node-fetch';

const sessionUpdate = function(jsonToSend) {
    const jsonBody = JSON.stringify(jsonToSend);
    const postHeaders = {"Content-Type": "application/json", "Content-Length": Buffer.byteLength(jsonBody, "utf8")};
    let location = window.location.href;
    let pathPosition = location.indexOf("/", location.indexOf("//") + 2);
    if (pathPosition !== -1) {
        location = location.substring(0, pathPosition);
    }
    location = location + "/api/update";
    return fetch(location, { method: "POST", body: jsonBody, headers: postHeaders });
};

const sessionRetrieve = function(options) {
    var jsonToSend = { options };
    const jsonBody = JSON.stringify(jsonToSend);
    const postHeaders = {"Content-Type": "application/json", "Content-Length": Buffer.byteLength(jsonBody, "utf8")};
    let location = window.location.href;
    let pathPosition = location.indexOf("/", location.indexOf("//") + 2);
    if (pathPosition !== -1) {
        location = location.substring(0, pathPosition);
    }
    location = location + "/api/retrieve";
    return fetch(location, { method: "POST", body: jsonBody, headers: postHeaders }).then(res => {
        if (res.status == 200) {
            return res.json();
        }
    });
};

export { sessionUpdate, sessionRetrieve };