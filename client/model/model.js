import runner from './runner.js'
import validator from './validator.js'


export class File{

    constructor(values){
        Object.assign(this, values);
    }

    parse(){
        try{
            this.ast = runner.parse(this.text)
            this.errors = runner.validate(this.ast)
        }catch(e){
            console.log(e)
            this.ast = undefined
            this.errors = [validator.addContextInfo(e)]
        }
        this.errors.forEach(error => error.file = this.name)
    }

    hasErrors(){
        return this.errors.length > 0
    }

    isRunnable(){
        return this.ast && !this.hasErrors()
    }

    get isDirectory(){
        return false
    }
    
    get completeName(){
        return this.path + this.name
    }

    compile(){
        this.parse()
    }

    equals(other){
        return this.name == other.name && this.path == other.path
    }

    toJson(){
        return {name:this.name, extension: this.extension, path:this.path, text: this.text, type: "file"}
    }
}

export class Folder {

    constructor(values){
        Object.assign(this, values);
        this.name = values.name
        this.children = []
        if(values.children){
            values.children.forEach( file =>{
                if(file.extension == "directory"){
                    this.addFolder(new Folder(file, this.path))
                }else{
                    this.addFile(new File(file), this.path)
                }
            })
        }
        this.extension = 'directory'
    }

    get files(){
        return this.children
    }

    get isDirectory(){
        return true
    }

    get completeName(){
        return this.path + this.name
    }

    getFileByName(fileName){
        return this.children.find(children => children.name == fileName && !children.isDirectory)
    }

    addFile(file){
        var folder = this.findFolderByPath(file.path)
        folder.children.push(file);
    }

    addFolder(folder){
        var parent = this.findFolderByPath(folder.path)
        parent.children.push(folder);
    }

    findFolderByPath = (folderPath) => {
        var element = this
        if(element.path == folderPath || (element.path+"/"+element.name) == folderPath){
          return element
        }
    
        var subPath = folderPath.replace(element.path+element.name, '')
        subPath.split("/").forEach(p =>{
          if(p != ""){
            element = element.children.find( child => child.name == p && child.isDirectory)
          }
        })
        return element
    }

    find(element){
        if(element == undefined){
            return this
        }
        if(element.extension == 'directory'){
            return this.findFolderByPath(element.path+"/"+element.name)
        }else{
            var parent = this.findFolderByPath(element.path)
            return parent.getFileByName(element.name)
        }
    }

    equals(other){
        return this.name == other.name && this.path == other.path
    }

    compile(){
        this.children.forEach(children => children.compile() )
    }

    toJson(){
        return {name:this.name, path:this.path, extension:this.extension, type:"dir", children: this.children.map(children => children.toJson())}
    }

}

export class Project extends Folder {


    addFolderToElement(folder, element){
        if(element.isDirectory){
            folder.path = element.path + element.name
        }else{
            folder.path = element.path
        }

        this.addFolder(folder)
    }

    addFileToElement(file, element){
        if(element.isProject){
            file.path = element.path + element.name
        }else if(element.isDirectory){
            file.path = element.path + "/" + element.name
        }else{
            file.path = element.path
        }
        this.addFile(file)
    }

    incrUpdates(){
        this.updates += 1
    }

    get isProject(){
        return true
    }
  
}

export const defaultText = (fileProperties) => {
    switch(fileProperties.type){
        case "object": return `object ${fileProperties.name} {\n \n}`
        case "class": return `class ${fileProperties.name} {\n \n}`
        case "program": return `program ${fileProperties.name} {\n \t console.println('Hello Wollok') \n}`
        case "test": return `test "${fileProperties.name}" {\n \t assert.that(true) \n}`
    }

}