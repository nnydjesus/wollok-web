import React, {Component, PropTypes} from 'react';
import Console from 'react-console-component';
import runner from '../../model/runner.js';
import 'react-console-component/main.css';

class ConsoleComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lines:["La consola no esta disponible"],
            runnable:false
        };
    }

    componentDidMount(){
    }

    runFile(file){
        var mode;
        var lines = this.state.lines
        var running = false
        if(this.refs.console){
            this.refs.console.setState({
                acceptInput: true,
                log: []
            });
        }
        switch(file.extension){
            case "wlk": mode = "repl";
                lines = []
                console.println = (value)=> {
                    this.refs.console.log(value.toString());
                    this.refs.console.return();
                }
                running = true
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
            runnable:running,
            running,
            lines
        })
        this.props.updateStatus({running})
    }

    get running(){
        return this.state.running 
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

    stop = () =>{
        this.setState({
            ast:undefined,
            mode:"",
            running:false
        })
        this.refs.console.setState({
            acceptInput: false,
        });
        this.props.updateStatus({running:false})
    }


    handleConsole = (text) =>{
        if(this.state.mode != "repl"){ return }
        if(text == "quit"){
            this.stop()
            return 
        }
        var program = " program repl { \n ";
        var ret = ""
        if(!(text.startsWith("var") || text.startsWith("new"))){
            ret = " return "
        }
        program += this.state.lines.join("\n") + ret + text
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
            lines.push(text+"\n")
            this.setState(lines)
        }catch(e){
            this.refs.console.logX("error", e.message);
            this.refs.console.return();
        }
    }


    render() {
        return (
            <div className="console">
                {(this.state.runnable)?
                <Console ref="console"
                    handler={this.handleConsole}
                    promptLabel=">>> "
                    welcomeMessage={`Ejecutando el archivo ${this.state.file.name} \nWollok interactive console (type "quit" to quit):`}
                    autofocus={true}
                />
                : <div className="display"> {this.state.lines.map((line, index) => <p key={index}>{line} </p>)}</div>
            }
            </div>
        );
    }
}

export default ConsoleComponent;
