import { Assignment, Block, Catch, Class, Closure, Constructor, Field, File, If, List, Literal, Method, Mixin, New, Parameter, Program, Reference, Return, Send, Singleton, Super, Throw, Try, Test, VariableDeclaration, traverse } from 'wollok-js/dist/model'

const findNodes = (type, condition) => {

  const find = traverse({
    // TODO: PACKAGE: ({ name, elements }) => {},

    [Singleton]: (node) => {
        if(node.type ==  type && condition(node)){
            return [node]
        }
        
        return _.flatMap(node.members, find)
    },

    [Mixin]: ({ name, members }) => [],

    [Class]: (node) => {
        if(node.type ==  type && condition(node)){
            return [node]
        }
        
        return _.flatMap(node.members, find)
    },

    [Constructor]: ({ parameters, parent, baseArguments, lookUpCall, sentences }) => [],

    [Field]: (node) => {
        if(node.type ==  type && condition(node)){
            return [node]
        }
        
        return find(node.variable).concat(find(node.value))
    },

    [Method]: (node) => {
        if(node.type ==  type && condition(node)){
            return [node]
        }
        
        return _.flatMap(node.parameters, find).concat(find(node.sentences))
    },

    [VariableDeclaration]: (node) => {
        if(node.type ==  type && condition(node)){
            return [node]
        }
        return find(node.variable).concat(find(node.value))
    },

    [Assignment]: (node) => {
        if(node.type ==  type && condition(node)){
            return [node]
        }
        return find(node.variable).concat(find(node.value))
    },

    [Reference]: (node) =>{
        if(node.type ==  type && condition(node)){
            return [node]
        }
        return []
    },

    [Send]: (node) => {
        if(node.type ==  type && condition(node)){
            return [node]
        }
        return find(node.target).concat(_.flatMap(node.parameters, find))
    },

    [New]: ({ target, parameters }) => [],

    [Super]: ({ parameters }) => [],

    [If]: ({ condition, thenSentences, elseSentences }) =>[],

    [Return]: ({ result }) => find(result),

    [Throw]: ({ exception }) => [],

    [Try]: ({ sentences, catches, always }) => [],

    [Catch]: ({ variable, errorType, handler }) =>[],

    [Literal]: ({ value }) => [],

    [List]: ({ values }) => [],

    [Closure]: ({ parameters, sentences }) => [],

    [File]: (node) => {
        if(node.type ==  type && condition(node)){
            return [node]
        }
        return _.flatMap(node.content, find)
    },

    // TODO: Imports
    // TODO: tests

    [Program]: (node) => {
        if(node.type ==  type && condition(node)){
            return [node]
        }
        return find(node.sentences)
    },

    [Test]: (node) => {
        if(node.type ==  type && condition(node)){
            return [node]
        }
        return find(node.sentences)
    },

    [Block]: (node) =>{
        if(node.type ==  type && condition(node)){
            return [node]
        }
        return _.flatMap(node.sentences, find)
    },

    [Parameter]: (node) => {
        if(node.type ==  type && condition(node)){
            return [node]
        }
        return []
    }
  })

  return find
}

export default (model, type, condition=()=>true) => model?findNodes(type, condition)(model):[]