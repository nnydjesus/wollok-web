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