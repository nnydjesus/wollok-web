const fetch = require('node-fetch');
const cache = require('memory-cache');
require('../resources/config.jsx');

const API_HOST = global.__CONFIG__.apiHost;

var applyConfig = function (req, res, next) {
    next();
};

module.exports = exports = { applyConfig };