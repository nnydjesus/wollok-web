const fetch = require('node-fetch');
require('../resources/config.jsx');

const API_HOST = global.__CONFIG__.apiHost;

var defaultConfig = {
    "appName": "Wollok Ide",
    "icon": "/public/wollok.png",
    "siteConfig": {
        "facebookAppId": "593194607741698",
        "googleClientId": "280312481769-agp1icq91galpab7sb7sv5mqbugs35ae.apps.googleusercontent.com",
        "githubClientId": "6a054b599ba023f6e75e"
    }
};

var applyConfig = function (req, res, next) {
    req.config = defaultConfig
    req.config.siteConfig.apiHost = API_HOST;
    next();
};

module.exports = exports = { applyConfig };