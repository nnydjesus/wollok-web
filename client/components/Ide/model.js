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

    addFile(file){
        var parent = this
        var parentPath = parent.path+parent.name
        parentPath.replace(file.path, "").split("/").forEach(name =>{
            if(name != undefined && name != "" && name != parent.name){
                parent = parent.children.find(c => c.name == name)
            }
        })
        parent.children.push(file);
    }

    addFolder(folder){
        var parent = this
        folder.path.split("/").forEach(name =>{
            if(name != undefined && name != "" && name != parent.name){
                parent = parent.children.find(c => c.name == name)
            }
        })
        parent.children.push(folder);
    }

}

export class Project extends Folder {

    addFolderToElement(folder, element){
        if(element.isDirectory){
            folder.path = element.path + "/" + element.name
        }else{
            folder.path = element.path
        }

        this.addFolder(folder)
    }

    addFileToElement(file, element){
        if(element.isDirectory){
            file.path = element.path + "/" + element.name
        }else{
            file.path = element.path
        }

        this.addFile(file)
    }
  
}