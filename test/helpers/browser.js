require('babel-register')({"plugins": [["transform-assets", { "extensions": ["css"] }]]});
// If transform-assets plugin is not working, remember to set BABEL_DISABLE_CACHE=1 when running

require('../../resources/config.jsx');
var jsdom = require('jsdom').jsdom;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
global.window.__CONFIG__ = {dashboardHost: "http://sample.dashboard.url"};
global.__CONFIG__.dashboardHost = "http://sample.dashboard.url";
global.__CONFIG__.apiHost = "http://test.api.url";

Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property);
        global[property] = document.defaultView[property];
    }
});

global.navigator = {
    userAgent: 'node.js'
};

documentRef = document;