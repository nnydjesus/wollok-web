const ssrMode = process.env.SSR_MODE === 'true';

require('../resources/config.jsx');

const getLogger = function() {
    const Logger = ssrMode ? undefined : require('le_node');
    return (Logger ? new Logger({ token: global.__CONFIG__.logentriesNodeToken }) : undefined);
};

const log = function(req, res) {
    try {
        var jsonBody = req.body;
        const level = ("" + jsonBody.lvl);
        delete jsonBody.lvl;
        jsonBody.env = global.__CONFIG__.environment;
        jsonBody.dashboardUrl = req.hostname;
        jsonBody.remoteAddress = req.ip;
        jsonBody.userAgent = req.get("User-Agent");
        jsonBody.forwardedFor = req.get("X-Forwarded-For");
        const configId = req.config ? req.config.id : "unknown";
        const userSession = req.session[configId];
        if (userSession) {
            if (!jsonBody.userEmail) {
                jsonBody.userEmail = userSession.login ? userSession.login.userEmail : "N/A";
            }
            jsonBody.dashboardUrl = userSession.login ? userSession.login.dashboardUrl : jsonBody.dashboardUrl;
            jsonBody.remoteAddress = userSession.clientData ? userSession.clientData.remoteAddress : jsonBody.remoteAddress;
            jsonBody.userAgent = userSession.clientData ? userSession.clientData.userAgent : jsonBody.userAgent;
            jsonBody.forwardedFor = userSession.clientData ? userSession.clientData.forwardedFor : jsonBody.forwardedFor;
        }
        if (ssrMode) {
            require('./remoteLog.js').remoteLog(level, jsonBody);
        } else {
            getLogger().log(level, jsonBody);
        }
        res.type("application/json");
        res.status(200);
        res.write("{}");
        res.end();
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
};

module.exports = exports = { log };
