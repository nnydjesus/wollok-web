var express = require('express');
var app = express();
var cors = require('cors')
const bodyParser = require('body-parser');

var ssrMode = process.env.SSR_MODE === 'true';

console.log("Initializing request logger");
app.use((req, res, next) => {
    console.log("New HTTP request:", req.method, req.originalUrl);
    next();
});

if (ssrMode) {
    console.log("Initializing static content");
    app.get(["/dist/*.js", "/dist/*.css"], function (req, res, next) {
        var contentType = req.url.endsWith(".js") ? "application/json" : "text/css; charset=UTF-8";
        req.url = req.url + '.gz';
        res.set('Content-Type', contentType);
        res.set('Content-Encoding', 'gzip');
        next();
    });
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
            aggregateTimeout: 1000,
            poll: 1000
        }
    }));
}

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(require("./server/applyConfig.js").applyConfig);

const session = require('express-session');
app.use(session({ secret: 'wollos-ide-4321', resave: false, saveUninitialized: true }));
app.use(function populateState(req, res, next) {
    const config = req.config;
    const sess = req.session[config.id] ||  {};
    var initialState = {};
    var locale = sess.locale || config.locale;
    initialState.siteConfig = req.config.siteConfig;
    req.initialState = initialState;
    next();
});

app.engine('ejs', require('ejs').renderFile);
app.set('views', './server/views');
// Serve static content in /public from ./public
app.use('/public', express.static('public'));

// app.use('/auth', AuthController);
// var VerifyToken = require('./server/VerifyToken');
// app.use('/api', VerifyToken, FileSystemController);


if (ssrMode) {
    const handleRender = require("./server/ssr.js").handleRender;
    // Serve client app from /dist (generated previously with Webpack) and use handleRender for all other paths
    console.log("Initializing server-side render");
    app.get('*', handleRender);
} else {
    // Serve React Router app from *
    app.get('*', function(req, res, next) {
        var environmentVariables;
        if (req.query.e1n2v3) {
            environmentVariables = JSON.stringify(process.env, null, 2)
        }
        res.render('index.ejs', { pageTitle: req.config.appName, pageIcon: req.config.icon, preloadedState: JSON.stringify(req.initialState), siteConfig: JSON.stringify(req.config.siteConfig), environmentVariables });
        next();
    });
}

var port = process.env.PORT || 3000;
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
    // Log server start to console
    console.log('Express listening on port ' + port + '!');
});