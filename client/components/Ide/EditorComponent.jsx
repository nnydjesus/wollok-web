import React, {Component, PropTypes} from 'react';
import EditorHandler from './editor/eventHandler.js'


var AceEditor = {}
var WollokMode = {}
if (typeof window !== 'undefined') {
    WollokMode = require('./editor/wollok.js').default
    require('brace/theme/twilight')
    require('brace/ext/language_tools');
    require('brace/ext/searchbox');

     AceEditor = require('react-ace').default
}

class EditorComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            annotations: this.annotationsForFile(props.file),
            lines:[]
        };
    }

    goToLine(line){
        this.editor.gotoLine(line, 0, true);
    }

    onSave = () =>{
        // this.props.file.text = this.state.file.text
        if(this.props.onSave) this.props.onSave()
        this.wollokMode.updateAst(this.props.file.ast)
    }

    componentDidMount(){
        this.wollokMode = new WollokMode();
        this.editor.getSession().setMode(this.wollokMode);
        this.editorHandler = new EditorHandler(this.editor)
        if(this.props.file){
            this.wollokMode.updateAst(this.props.file.ast)
            this.editorHandler.updateAst(this.props.file.ast)
        }
        // this.wollokMode.updateAst(this.props.file.ast)
        
    }

    get editor() {
        return this.refs.aceEditor.editor
    }

    runCommand(command){
        this.editor.execCommand(command)
    }

    annotationsForFile(file){
        var annotations = []
        if(file.errors){
            file.errors.forEach(error =>
                annotations.push({
                    row: error.location.start.line-1,
                    column: error.location.start.column,
                    text: error.message,
                    type: "error" // also warning and information
                })
            )
        }
        return annotations
    }

    componentDidUpdate(){
        if(this.refs.aceEditor && this.props.file){
            this.editor.getSession().setAnnotations(this.annotationsForFile(this.props.file))
            this.wollokMode.updateAst(this.props.file.ast)
            this.editorHandler.updateAst(this.props.file.ast)
        }
    }

    render() {
       
        if(!this.props.file){ return <div/>}
        return (
            <AceEditor
                ref="aceEditor"
                theme={this.props.theme || 'twilight'}
                onChange={this.props.onChange}
                value={this.props.file.text}
                name={this.props.name}
                showPrintMargin={false}
                fontSize={14}
                annotations={this.state.annotations}
                editorProps={{$blockScrolling: "Infinity", $useWorker:false}}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2,
                }}
                commands={[
                    {
                        name: 'save',
                        bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
                        exec: this.onSave,
                        readOnly: true
                    }
                ]}
          />
        );
    }
}

export default EditorComponent;
