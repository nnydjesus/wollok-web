import fetch from 'node-fetch';
import './config.jsx';

const DASHBOARD_HOST = (typeof window === "undefined") ? "http://localhost" + (process.env.PORT ? ":" + process.env.PORT : ":3000") : window.__CONFIG__.dashboardHost;

// Log levels, in order of increasing severity: debug, info, notice, warning, err, crit, alert, emerg
export const log = (level, message, obj) => {
    let logOptions = {lvl: level, message};
    if (typeof obj === "object") {
        logOptions = Object.assign({}, logOptions, obj);
    }
    var jsonBody = JSON.stringify(logOptions);
    var postHeaders = {
        'Content-Type' : 'application/json',
        'Content-Length' : Buffer.byteLength(jsonBody, 'utf8')
    };
    fetch(DASHBOARD_HOST + "/api/log", { method: "POST", body: jsonBody, headers: postHeaders }).then(response => {
        if (response.status === 500) {
            throw {id: "httpError500"};
        }
    }).catch(err => {
        // Ignore error but log locally
        console.log("Error while logging:", err);
    });
};

export default log;