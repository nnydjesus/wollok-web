var express = require('express');
var router = express.Router();
var fs = require('fs');
const fse = require('fs-extra')
const _ = require("lodash")


function baseFolder(req){
    return "./projects/"+req.username
}

function createFolder(path){
    fs.mkdir(path, function(e){
        console.log(e)
    })
}

function getProject(name, userFolder){
    var project = {name:name, extension:"directory", children:[], path:"/"}
    readFolderContent(project, userFolder)
    return project
}

function readFolderContent(folder, userFolder){
    var folderPath = folder.path+folder.name
    var files = fs.readdirSync(userFolder+folderPath) 
    files.forEach(function(file){
        if(file.indexOf(".")>0){
            var split = file.split(".")
            var content = fs.readFileSync(userFolder+folderPath+"/"+file, 'utf8').toString()
            folder.children.push({name:file, extension:split[1], path: folderPath, text:content, dirty:false})
        }else{
            var newFolder = {name:file, extension:"directory", children:[], path:folderPath+"/"}
            folder.children.push(newFolder)
            readFolderContent(newFolder, userFolder)
        }
    });
}

function createElement(element, baseFolder){
    if(element.extension == "directory"){
        createFolder(baseFolder+element.path+"/"+element.name)
    }else{
        fs.writeFile(baseFolder+element.path+"/"+element.name, element.text, function(e){
            console.log(e)
        })
    }
}



if (!fs.existsSync("./projects")){
    fs.mkdirSync("./projects");
}

//PROJECTS
router.post('/projects', function(req, res) {
    var projectName = req.body.name;
    createFolder(baseFolder(req)+"/"+projectName)
    var project = getProject(projectName, baseFolder(req))
    res.status(200);
    res.type("application/json");
    res.write(JSON.stringify(project));
    res.end();
});

router.post('/projects/complete', function(req, res) {
    var project = req.body;
    var baseFolderPath = baseFolder(req)
    createFolder(baseFolderPath+"/"+project.name)

    _.each(project.children, function(children){
        createElement(children, baseFolderPath)
    })
    
    res.status(200);
    res.type("application/json");
    res.write(JSON.stringify("{}"));
    res.end();
});

router.get('/projects', function(req, res) {
    var projects = fs.readdirSync(baseFolder(req)) 
    res.type("application/json");
    res.write(JSON.stringify(projects));
    res.status(200);
    res.end();
});

router.get('/projects/:name', function(req, res) {
    var name = req.params.name;
    fs.readdir(baseFolder(req)+"/"+name, (err, files) => {
        var project = getProject(name, baseFolder(req))
        res.type("application/json");
        res.write(JSON.stringify(project));
        res.status(200);
        res.end();
    })
});


// FOLDERS

router.post('/folders', function(req, res) {
    var folder = req.body;
    createFolder(baseFolder(req)+folder.path+"/"+folder.name)
    res.status(200);
    res.type("application/json");
    res.write("{}");
    res.end();
});

router.delete('/folders/:folderName', function(req, res) {
    var path = req.body.path;
    var folderName = req.params.folderName;
    fse.removeSync(baseFolder(req)+path+folderName)
    res.status(200);
    res.type("application/json");
    res.write("{}");
    res.end();
});

//FILES

router.post('/files', function(req, res) {
    var file = req.body;
    fs.writeFile(baseFolder(req)+file.path+"/"+file.name, file.text, function(e){
        console.log(e)
    })
    res.status(200);
    res.type("application/json");
    res.write("{}");
    res.end();
});

router.delete('/files/:fileName', function(req, res) {
    var filePath = req.body.path;
    var fileName = req.params.fileName;
    fs.unlinkSync(baseFolder(req)+filePath+"/"+fileName)
    res.status(200);
    res.type("application/json");
    res.write("{}");
    res.end();
});


router.post('/files/rename', function(req, res) {
    var filepath = req.body.path;
    var fileName = req.body.name;
    var newName = req.body.newName;
    fs.renameSync(baseFolder(req)+filepath+"/"+fileName, baseFolder(req)+filepath+"/"+newName)
    res.status(200);
    res.type("application/json");
    res.write("{}");
    res.end();
});

module.exports = router;