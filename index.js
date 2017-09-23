var express = require('express');
var app = express();

var ssrMode = process.env.SSR_MODE === 'true';

console.log("Initializing request logger");
app.use((req, res, next) => {
    console.log("New HTTP request:", req.method, req.originalUrl);
    next();
});

if (ssrMode) {
    console.log("Initializing static content");
    app.use("/dist", express.static('dist'));
} else {
    var webpackDevMiddleware = require("webpack-dev-middleware");
    var webpack = require("webpack");
    var compiler = webpack(require('./webpack.config.js'));
    console.log("Starting Webpack in dev mode...");
    // Serve Webpack content in /dist
    app.use("/dist", webpackDevMiddleware(compiler, {
        // options
        watchOptions: {
            aggregateTimeout: 1000
        }
    }));
}

app.use(require("./server/applyConfig.js").applyConfig);

const session = require('express-session');
app.use(session({ secret: 'dashboard-4321', resave: false, saveUninitialized: true }));
app.use(function populateState(req, res, next) {
    console.log("populate")
    const config = req.config;
    const sess =  {};
    var initialState = {};
    var login = sess.login || {};
    var userData = sess.userData || {};
    var previousUsers = sess.previousUsers || [];
    var locale = sess.locale || config.locale;
    initialState.login = { authToken: login.authToken, userIdentity: login.userIdentity, userEmail: login.userEmail, userPicture: login.userPicture, userLoginPicture: login.userLoginPicture, userData, previousUsers };
    initialState.i18n = { locale };
    initialState.siteConfig = req.config.siteConfig;
    req.initialState = initialState;
    console.log("populate - finish")
    next();
});

const bodyParser = require('body-parser');
app.post('/api/update', bodyParser.json(), function updateSessionData(req, res) {
    console.log("update")
    const config = req.config;
    const body = req.body;
    var sess = req.session[config.id] || {};
    //console.log("Received session update data:", body);
    if (body.logout + "" === "true") {
        //console.log("User is logging out");
        sess.login = {};
        sess.userData = {};
    }
    // if (body.login && typeof body.login.authToken !== "undefined") {
    //     const newLogin = body.login;
    //     const userType = newLogin.isSocial ? "facebook" : "email";
    //     var userToAdd = {
    //         userIdentity: newLogin.userIdentity,
    //         userEmail: newLogin.userEmail,
    //         userPicture: newLogin.userPicture,
    //         userLoginPicture: newLogin.userLoginPicture,
    //         userType
    //     };
    //     var previousUsers = sess.previousUsers || [];
    //     var newPreviousUsers = [userToAdd];
    //     for (var i = 0; i < previousUsers.length; i++) {
    //         var previousUser = previousUsers[i];
    //         if (!(previousUser.userType === userToAdd.userType && previousUser.userEmail === userToAdd.userEmail)) {
    //             newPreviousUsers.push(previousUser);
    //         }
    //     }
    //     sess.previousUsers = newPreviousUsers;
    //     sess.login = newLogin;
    //     sess.clientData = {
    //         remoteAddress: req.ip,
    //         userAgent: req.get("User-Agent"),
    //         forwardedFor: req.get("X-Forwarded-For")
    //     };
    // }
    // if (body.userData && typeof body.userData !== "undefined") {
    //     sess.userData = body.userData;
    // }
    // if (body.deletePreviousUserData + "" === "true") {
    //     //console.log("Deleting previous user data for session");
    //     sess.previousUsers = [];
    // }
    //console.log("New session data: ", sess);
    req.session[config.id] = sess;
    res.type("application/json");
    res.status(200);
    res.write(JSON.stringify({ "message": "Session updated correctly" }));
    res.end();
    console.log("update - finish")
});

app.post('/api/retrieve', bodyParser.json(), function retrieveSessionData(req, res) {
    const config = req.config;
    const body = req.body;
    //console.log("req.body:", req.body);
    var sess = req.session[config.id] ||  {};
    //console.log("sess:", sess);
    var jsonResponse = {};
    var options = body.options || [];
    for (var i = 0; i < options.length; i++) {
        var opt = options[i];
        jsonResponse[opt] = sess[opt];
    }
    res.type("application/json");
    res.status(200);
    res.write(JSON.stringify(jsonResponse));
    res.end();
});

app.post('/api/log', bodyParser.json(), require('./server/log.js').log);

const catchAll = function(req, res) {
    res.status(302);
    res.location("/main");
    res.end();
};
app.get('/api', catchAll);
app.get('/api/*', catchAll);

app.engine('ejs', require('ejs').renderFile);
app.set('views', './server/views');
// Serve static content in /public from ./public
app.use('/public', express.static('public'));

if (ssrMode) {
    const handleRender = require("./server/ssr.js").handleRender;
    // Serve client app from /dist (generated previously with Webpack) and use handleRender for all other paths
    console.log("Initializing server-side render");
    app.get('*', handleRender);
} else {
    // Serve React Router app from *
    app.get('*', function(req, res, next) {
        console.log("Using config:", req.config.id);
        var environmentVariables;
        if (req.query.e1n2v3) {
            environmentVariables = JSON.stringify(process.env, null, 2)
        }
        res.render('index.ejs', { pageTitle: req.config.appName, pageIcon: req.config.icon, preloadedState: JSON.stringify(req.initialState), siteConfig: JSON.stringify(req.config.siteConfig), environmentVariables });
        next();
    });
}

var port = process.env.PORT || 9990;
app.listen(port, function() {
    // Get local network interfaces
    var os = require('os');
    var ifaces = os.networkInterfaces();
    var interfaces = {};
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;
        ifaces[ifname].forEach(function (iface) {
            if (iface.internal !== false) {
                return;
            }
            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                interfaces[ifname + ':' + alias] = iface.address;
            } else {
                // this interface has only one ipv4 adress
                interfaces[ifname] = iface.address;
            }
            ++alias;
        });
    });
    // Remotely log server start
    const serverInfo = { message: "Server started", interfaces, port };
    require('./server/remoteLog.js').remoteLog("info", serverInfo);
    // Log server start to console
    console.log('Express listening on port ' + port + '!');
});