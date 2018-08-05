import { Assignment, Block, Catch, Class, Closure, Constructor, Field, File, If, List, Literal, Self,  Method, Mixin, New, Parameter, Program, Reference, Return, Send, Singleton, Super, Throw, Try, Test, VariableDeclaration, traverse } from 'wollok-js/dist/model'
import { Link } from 'wollok-js/dist/linker/steps/link'
import { resolvePath } from 'wollok-js/dist/linker/scoping'
import {wre} from 'wollok-js'
import _ from 'lodash'

const CANNOT_ASSIGN_TO_VAL = "No se puede modificar constantes"
const CANNOT_ASSIGN_TO_ITSELF = "No se puede asignar a si mismo"
const CLASS_NAME_MUST_START_UPPERCASE = "El nombre de la clase {name} debe empezar con mayúscula"
const PARAMETER_NAME_MUST_START_LOWERCASE = "El parámetro {name} debe empezar con minúscula"
const VARIABLE_NAME_MUST_START_LOWERCASE = "La variable {name} debe empezar con minúscula"
const OBJECT_NAME_MUST_START_LOWERCASE = "El objeto {name} debe empezar con minúscula"
const METHOD_DOESNT_EXIST = "El objeto {target} no tiene el método {name}"
const DUPLICATED_CONSTRUCTOR = "Constructor duplicado"


function isUpperCase(myString) { 
    return (myString == myString.toUpperCase()); 
} 

function isLowerCase(myString) { 
return (myString == myString.toLowerCase()); 
} 

const nodeWrapper = (node) => {
//TODO Ver si en vez tener objeto tener  una clase
    return {
        method : ()=> {
            var current = node
            while(current.type != Method.name && current.parent){
                current = current.parent
            }
            return nodeWrapper(current)

        }, //Send
        isVoid : ()=>  _.any(node.sentences.sentences, sentence => sentence.type == Return.name), //Method
        declaringContext :()=> nodeWrapper(node.parent), //Method
        allMethods: ()=> node? node.members.filter(member => member.type == Method.name).map(nodeWrapper): [], //Singleton
        hasMethod : function(methodName){ //Singleton
            var superMethods = wre[this.superclass]
            return this.allMethods().find(method => method.name == methodName) || (superMethods? superMethods[methodName]: false)
        },
        ...node
    }
}

String.prototype.format = function(){
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};


const validateWithNatives = (natives = {}) => {


  const validate = traverse({
    // TODO: PACKAGE: ({ name, elements }) => {},

    [Singleton]: ({ name, superclass: superclassName, mixins, superArguments, members, location}) => {
        var result = []
        if(!isLowerCase(escape(name)[0])){
            result.push({location, message:OBJECT_NAME_MUST_START_LOWERCASE.format({name:name}), expected:[]})
        }
        return result.concat(_.flatten(members.map(validate)))
    },

    [Mixin]: ({ name, members }) => [],

    [Class]: ({ name, superclass: superclassName, mixins, members, location}) => {
        var result = []
        if(!isUpperCase(escape(name)[0])){
            result.push({location, message:CLASS_NAME_MUST_START_UPPERCASE.format({name:name}), expected:[]})
        }

        var constructors = members.filter(member => member.type == Constructor.name)
        var constructorsWithSameParameters = constructors.filter(c1 => constructors.find(c2 => c1 != c2 &&  c2.parameters.length == c1.parameters.length))

        constructorsWithSameParameters.forEach(constructor=>{
            result.push({location:constructor.location, message:DUPLICATED_CONSTRUCTOR.format(), expected:[]})
        })

        return result.concat(_.flatten(members.map(validate)))
    },

    [Constructor]: ({ parameters, parent, baseArguments, lookUpCall, sentences }) => [],

    [Field]: ({ variable, value }) => {
        return validate(value).concat(validate(variable))
    },

    [Method]: ({ name, parameters, sentences, native, parent }) => {
        return _.flatten(parameters.map(validate)).concat(validate(sentences))
    },

    [VariableDeclaration]: ({ variable, writeable, value }) => {
        return validate(variable)
    },

    [Assignment]: ({ variable, value, location }) => {
        if(variable.name == "self") { return [{location, message:CANNOT_ASSIGN_TO_ITSELF, expected:[]}] }

        if (variable.name.type == Link.name){
            const { token, path } = variable.name
            if (token === 'self') { return true }
            const resolved = resolvePath(variable.name, path)
            if(resolved.type === 'Field' && resolved.writeable == false){
                return [{location, message:CANNOT_ASSIGN_TO_VAL, expected:[]}]
            }
        }
        return []
    },

    [Self]: ({  }) => [],

    [Reference]: ({ name, location}) =>{
        if(name.type == Link.name){
            if(!isLowerCase(name.token.value[0])){
                return [{location, message:VARIABLE_NAME_MUST_START_LOWERCASE.format({name:name.token.value}), expected:[]}]
            }  
        }  
        return []
    },

    [Send]: (node) => {
        // var resolved = resolvePath(send.target.name, send.target.path)
        // console.log(resolved)
        if (node.target.type == Reference.name){
            const { token, path } = node.target.name
            if (token === 'self') { 
                var send = nodeWrapper(node)
                if(!send.method().declaringContext().hasMethod(send.key)){
                    return [{location:send.location, message:METHOD_DOESNT_EXIST.format({target:token, name: send.key}), expected:[]}]
                }
            }
            return []
        }else {
            return validate(node.target)
        }
    },

    [New]: ({ target, parameters }) => [],

    [Super]: ({ parameters }) => [],

    [If]: ({ condition, thenSentences, elseSentences }) =>[],

    [Return]: ({ result }) => validate(result),

    [Throw]: ({ exception }) => [],

    [Try]: ({ sentences, catches, always }) => [],

    [Catch]: ({ variable, errorType, handler }) =>[],

    [Literal]: ({ value }) => [],

    [List]: ({ values }) => [],

    [Closure]: ({ parameters, sentences }) => [],

    [File]: ({ content }) => {
        return _.flatten(content.map(validate))
    },

    // TODO: Imports
    // TODO: tests

    [Program]: ({ name, sentences }) => {
        return  validate(sentences)
    },

    [Test]: ({sentences }) => {
        return  validate(sentences)
    },

    [Block]: ({ sentences }) =>{
        return  _.flatten(sentences.map(validate))
    },

    [Parameter]: ({ name, varArg, location }) => {
        if(!isLowerCase(escape(name)[0])){
            return [{location, message:PARAMETER_NAME_MUST_START_LOWERCASE.format({name:name}), expected:[]}]
        }
        return []
    }
  })

  return validate
}

export default (model, natives) => validateWithNatives(natives)(model)