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
            aggregateTimeout: 1000
        }
    }));
}

const session = require('express-session');
app.use(function populateState(req, res, next) {
    var initialState = {};
    req.initialState = initialState;
    next();
});

const bodyParser = require('body-parser');

var fs = require('fs');
app.engine('ejs', require('ejs').renderFile);
app.set('views', './server/views');
// Serve static content in /public from ./public
app.use('/public', express.static('public'));

function createFolder(path){
    fs.mkdir(path, function(e){
        console.log(e)
    })
}

app.post('/api/folers', bodyParser.json(), function(req, res) {
    var folder = req.body;
    createFolder("./projects/"+folder.path+"/"+folder.name)
    res.status(200);
    res.type("application/json");
    res.write("{}");
    res.end();
});

app.post('/api/files', bodyParser.json(), function(req, res) {
    var file = req.body;
    fs.writeFile("./projects/"+file.path+"/"+file.name+"."+file.extension, file.text, function(e){
        console.log(e)
    })
    res.status(200);
    res.type("application/json");
    res.write("{}");
    res.end();
});


function readFolderContent(folder){
    var folderPath = folder.path+folder.name
    var files = fs.readdirSync("./projects"+folderPath) 
    files.forEach(function(file){
        if(file.indexOf(".")>0){
            var split = file.split(".")
            var content = fs.readFileSync("./projects"+folderPath+"/"+file, 'utf8').toString()
            folder.children.push({name:split[0], extension:split[1], path: folderPath, text:content, dirty:false})
        }else{
            var newFolder = {name:file, extension:"directory", children:[], path:folderPath+"/"}
            folder.children.push(newFolder)
            readFolderContent(newFolder)
        }
    });
}

function getProject(name){
    var project = {name:name, extension:"directory", children:[], path:"/"}
    readFolderContent(project)
    return project
}

app.get('/api/projects/:name', function(req, res) {
    var name = req.params.name;
    fs.readdir("./projects/"+name, (err, files) => {
        project = getProject(name)
        res.type("application/json");
        res.write(JSON.stringify(project));
        res.status(200);
        res.end();
      })
});

app.get('/api/projects', function(req, res) {
    var projects = fs.readdirSync("./projects") 
    res.type("application/json");
    res.write(JSON.stringify(projects));
    res.status(200);
    res.end();
});

app.post('/api/projects', bodyParser.json(), function(req, res) {
    var projectName = req.body.name;
    createFolder("./projects/"+projectName)
    project = getProject(projectName)
    res.status(200);
    res.type("application/json");
    res.write(JSON.stringify(project));
    res.end();
});

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
        res.render('index.ejs', { pageTitle: "Wollok Ide", pageIcon: "/public/wollok.png", preloadedState: JSON.stringify(req.initialState), environmentVariables });
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