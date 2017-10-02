import React, {Component, PropTypes} from 'react';
import AceEditor from 'react-ace'
import 'brace/mode/wollok'
import 'brace/theme/twilight'
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import {File} from './model'
 

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
    }

    componentDidMount(){
        this.editor.on("input", ()=> {
            // dynamicMode.$highlightRules.setKeywords(JSON.parse(editor2.getValue()))
            this.editor.session.bgTokenizer.start(0)
        })()
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
        }
    }

    render() {
       
        if(!this.props.file){ return <div/>}
        return (
            <AceEditor
                ref="aceEditor"
                mode={this.props.mode || 'wollok'}
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

EditorComponent.propTypes = {
    mode: PropTypes.string,
    file: PropTypes.object,
    onChange: PropTypes.func,
    onSave: PropTypes.func,
};

export default EditorComponent;
