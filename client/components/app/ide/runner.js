import { compiler, parser, linker,wre, interpreter} from 'wollok-js'
import scope from 'wollok-js/dist/wre/wre.txt'
import validator from './astValidator.js'

class Runner{

    parse(code){
        return linker(parser(code))
    }

    validate(ast){
        return validator(ast, wre)
    }

    compile(ast){
        return compiler(ast, wre)
    }

    eval(code){
        return eval(scope+"; "+ code);
    }

}

export default new Runner()
