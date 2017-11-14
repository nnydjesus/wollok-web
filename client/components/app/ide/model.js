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
}

export class Project{
    
    constructor(values){
        Object.assign(this, values);
        this.children = this.children.map( file =>{
            return typeof(file) == File.name? file : new File(file)
        })
    }

    get files(){
        return this.children
    }
}