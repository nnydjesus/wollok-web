import React, {Component, PropTypes} from 'react';
import Console from 'react-console-component';
import runner from './runner';
 

class ConsoleComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lines:["La consola no esta disponible"],
        };
    }


    componentDidMount(){

    }

    runFile(file){
        var mode;
        var lines = this.state.lines
        switch(file.extension){
            case "wlk": mode = "repl";
                lines = []
                console.println = (value)=> {
                    this.refs.console.log(value.toString());
                    this.refs.console.return();
                }
                break;
            case "wpgm": mode = "result";
                lines = []
                console.println = (value)=> {
                    lines.push(value.toString())
                }
                this.runProgram(file)
                break;
            case "wtest": mode = "test";
                lines = ["Comming soon"]
                // lines = []
                // console.println = (value)=> {
                //     lines.push(value.toString())
                // }
                // this.runProgram(file)
                break;
        }

        this.setState({
            file:file,
            ast:file.ast,
            mode:mode,
            lines
        })
    }

    runProgram(file){
        try{
            var code = runner.compile(file.ast)+";"
            var result = runner.eval(code)
            if(result){
                return result.toString()
            }
        }catch(e){
            return e.message;
        }
    }

    stop(){
        this.setState({
            ast:undefined,
            lines:[]
        })
    }

    handleConsole = (text) =>{
        if(text == "quit"){
            this.stop()
        }
        var program = " program repl { \n ";
        program += this.state.lines.join("\n") + " return "+ text
        program +=  "\n }"
        try{
            var ast = runner.parse(program)
            var lines = this.state.lines
    
            var code = runner.compile(this.state.ast)+";"
            code += runner.compile(ast)
            var result = runner.eval(code)
            if(result){
                this.refs.console.log(result.toString());
            }
            this.refs.console.return();
            lines.push(text)
            this.setState(lines)
        }catch(e){
            this.refs.console.logX("error", e.message);
            this.refs.console.return();
        }
    }


    render() {
        return (
            <div className="console">
                {(this.state.ast && this.state.mode == "repl")?
                <Console ref="console"
                    handler={this.handleConsole}
                    promptLabel=">>> "
                    welcomeMessage={'Wollok interactive console (type "quit" to quit):'}
                    autofocus={true}
                />
                : <div className="display"> {this.state.lines.map((line, index) => <p key={index}>{line} </p>)}</div>
            }
            </div>
        );
    }
}

ConsoleComponent.propTypes = {
    ast: PropTypes.object,
};

export default ConsoleComponent;
