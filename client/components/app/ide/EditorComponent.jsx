import React, {Component, PropTypes} from 'react';
import AceEditor from 'react-ace'
import 'brace/mode/wollok'
import 'brace/theme/twilight'
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
 

class EditorComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            code:""
        };
    }

    goToLine(line){
        this.editor.gotoLine(line, 0, true);
    }

    onSave = () =>{
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

    render() {
        return (
            <AceEditor
                ref="aceEditor"
                mode={this.props.mode || 'wollok'}
                theme={this.props.theme || 'twilight'}
                onChange={this.props.onChange}
                value={this.props.value}
                name={this.props.name}
                showPrintMargin={false}
                fontSize={14}
                editorProps={{$blockScrolling: "Infinity"}}
                setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                    showLineNumbers: true,
                    tabSize: 2
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
    value: PropTypes.string,
    onChange: PropTypes.func,
    onSave: PropTypes.func,
};

export default EditorComponent;
