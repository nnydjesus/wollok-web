import { compiler, parser, linker,wre, interpreter} from 'wollok-js'
import scope from 'wollok-js/dist/wre/wre.txt'
import validator from './astValidator.js'

class Runner{

    parse(text){
        var ast = parser(text)
        return linker(ast)
    }

    validate(ast){
        return validator(ast, wre)
    }

    compile(ast){
        return compiler(ast, wre)
    }

    eval(code){
        console.log(code)
        return eval(scope+"; "+ code);
    }

}

export default new Runner()
