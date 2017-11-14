import { Assignment, Block, Catch, Class, Closure, Constructor, Field, File, If, List, Literal, Method, Mixin, New, Parameter, Program, Reference, Return, Send, Singleton, Super, Throw, Try, Test, VariableDeclaration, traverse } from 'wollok-js/dist/model'

export default (node) => {
    
    const description = traverse({
    
        [Singleton]: ({ name}) => `Objeto ${name.value}`,
  
        [Mixin]: ({ name }) => `Mixin ${name.value}`,
  
        [Class]: ({ name}) => `Clase ${name.value}`,
    
        [Constructor]: ({ parameters}) => "",
    
        [Field]: ({ variable }) => `Variable ${description(variable)}`,
    
        [Method]: ({ name, parameters}) => `Método ${name.value}(${parameters.map(param=> param.value).join(',')})`,
    
        [VariableDeclaration]: ({ variable }) => `Variable ${description(variable)}`,
    
        [Assignment]: ({ variable, value }) => '',
    
        [Reference]: ({ name }) => {
            // unresolved
            if (name.type !== "Link") return escapeId(name)
            // resolved
            const { token, path } = name
            return token
        },
    
        [Send]: ({ target, key, parameters }) => "",
    
        [New]: ({ target, parameters }) => '',
    
        [Super]: ({ parameters }) => '',
    
        [If]: ({ condition, thenSentences, elseSentences }) => '',
    
        [Return]: ({ result }) => ``,
    
        [Throw]: ({ exception }) => ``,
    
        [Try]: ({ sentences, catches, always }) => ``,
    
        [Catch]: ({ variable, errorType, handler }) =>'',
    
        [Literal]: ({ value }) => value,
    
        [List]: ({ values }) => ``,
    
        [Closure]: ({ parameters, sentences }) => ``,
    
        [File]: ({ content }) => '',
    
        // TODO: Imports
        // TODO: tests
    
        [Program]: ({ name, sentences }) => `Programa ${name.value}`,
    
        [Block]: ({ sentences }) =>  '',
    
        [Parameter]: ({ name, varArg }) => `Parámetro ${name.value}`

  })

  return description(node)
}