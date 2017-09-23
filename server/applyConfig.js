const fetch = require('node-fetch');
const cache = require('memory-cache');
require('../resources/config.jsx');

const API_HOST = global.__CONFIG__.apiHost;

var siteConfigs = {
    "default": "Wollok",
    "sites": [
        {
            "id": "base",
            "appName": "Wollok Web",
            "icon": "/public/wollok.png",
            "siteConfig": {
                "theme": "wollok",
                "locale": "es",
            }
        },
        {
            "id": "prod",
            "appName": "Wollok Web",
            "icon": "/public/wollok.png",
            "siteConfig": {
                "theme": "wollok",
                "locale": "es",
            }
        }
    ]
};

var getDashboardHost = function (protocol, hostname) {
    return protocol.concat("://").concat(hostname);
};

var setConfigParams = function (config, shopConfigParams, dashboardHost, apiHost, shopUrl) {
    config.shopConfigParams = shopConfigParams;
    if (shopConfigParams.name && shopConfigParams.name !== null) {
        config.appName = shopConfigParams.name + " Dashboard";
        config.siteConfig.appName = config.appName;
    }
    config.siteConfig.dashboardHost = dashboardHost;
    config.siteConfig.apiHost = apiHost;
    config.siteConfig.shopUrl = shopUrl;
    config.siteConfig.logo = shopConfigParams.logo;
    config.siteConfig.lightBackgroundLogo = shopConfigParams.logo;
    config.siteConfig.darkBackgroundLogo = (shopConfigParams.logoClear === undefined || shopConfigParams.logoClear === "") ? shopConfigParams.logo : shopConfigParams.logoClear;
    config.siteConfig.favicon = shopConfigParams.favicon;
    if (config.siteConfig.favicon !== undefined && config.siteConfig.favicon !== "") {
        config.icon = config.siteConfig.favicon;
    }
    config.siteConfig.facebookAppId = shopConfigParams.facebookAppId;
    config.siteConfig.timeZone = shopConfigParams.timeZone;
    config.siteConfig.shopId = shopConfigParams.id;
};


var applyConfig = function (req, res, next) {
    const defaultConfigId = siteConfigs.default;
    req.config = siteConfigs.sites.filter(function (item) { return item.id === defaultConfigId; })[0];
    const configByHostname = siteConfigs.sites.filter(function (item) { return req.hostname.match(item.hostname) !== null; })[0];
    if (configByHostname !== undefined) {
        req.config = configByHostname;
    }
    const dashboardHost = getDashboardHost(req.protocol, req.get("Host"));
    const shopUrl = req.hostname;
    // get siteConfigParams from API or cache
    const cacheKey = "shopConfigParams:" + req.hostname;
    const shopConfigParams = cache.get(cacheKey);
    if (shopConfigParams !== null) {
        console.log("shopConfigParams loaded from cache");
        setConfigParams(req.config, shopConfigParams, dashboardHost, API_HOST, shopUrl);
    }
    next();
};

module.exports = exports = { applyConfig };