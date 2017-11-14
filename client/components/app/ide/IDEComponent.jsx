import React, {Component, PropTypes} from 'react';
import {browserHistory} from 'react-router';
import {AppBar} from 'react-toolbox/lib/app_bar';
import {IconButton} from 'react-toolbox/lib/button';
import {Button} from 'react-toolbox/lib/button';
import {Tab, Tabs} from 'react-toolbox';
import {NavDrawer} from 'react-toolbox/lib/layout';
import {Panel} from 'react-toolbox/lib/layout';
import {Sidebar} from 'react-toolbox/lib/layout';
import {Navigation} from 'react-toolbox/lib/navigation';
import FontIcon from 'react-toolbox/lib/font_icon';
import {Link} from 'react-toolbox/lib/link';
import {Menu, MenuItem, MenuDivider} from 'react-toolbox/lib/menu';
import {Translate, I18n} from 'react-redux-i18n';
import {connect} from 'react-redux';
import EditorComponent from './EditorComponent.jsx'
import FileBrowser from './FileBrowser.jsx'
import Outline from './Outline.jsx'
import Toolbar from './Toolbar.jsx'
import {File, Project} from './model.js'
import Console from './Console.jsx'
import Problems from './Problems.jsx'
import validator from './validator.js'
import runner from './runner.js'
import theme from '../../../../resources/theme.jsx';
import Splitter from 'm-react-splitters';
import 'm-react-splitters/lib/splitters.css';



const defaultProject = {
    name: 'ejemplo',
    toggled: true,
    extension:"directory",
    children: [
        { name: 'aves.wlk', dirty:true, text:`object contador {
var valor = 0

method inc() { 
valor +=  1  
}

}
`,                   extension:"wlk"},
        { name: 'aves.wtest', dirty:false,  text:`object pepita  {
var energia = 100 * (44 / 232)
var nombre = "Pepa"

method comer(gramos) {
energia += 4
}

method volar(km) {
energia -= (10 + km)
}

method energia() { return energia }

method estaFeliz() { return self.energia().between(50,1000) }
}   
`,               extension:"wtest"},
    ]
}

const ErrorModel = {
    descriptrion: {type: String},
    file: {type: String},
    birthdate: {type: Date},
    cats: {type: Number},
    dogs: {type: Number},
    active: {type: Boolean}
  };

class IDEComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openFiles:[],
            editorTabIndex: 0,
            project: new Project(JSON.parse(sessionStorage.getItem("project") || JSON.stringify(defaultProject))),
            bottomTabIndex:0,
            runningConsole:false
        };
    }

    handleTabChange = (tabType) => (tabIndex) => {
        var newState = {}
        newState[tabType] = tabIndex
        this.setState(newState);
    };

    onSelectTab = (file) => () =>{
        this.setState({file})
    }

    updateCode = (code, event) =>{
        var file  = this.state.file
        file.text = code
        file.dirty = true
        this.setState({file})
    }

    updateConsoleStatus = (status) =>{
        this.setState({runningConsole: status.running})
    }

    onSaveFile = (aFile) =>{
        let file = aFile || this.state.file
        file.dirty = false
        file.parse()
        
        // sessionStorage.setItem("project", JSON.stringify(this.state.project))
        
        this.setState({file})
        // var jsCode = compiler(ast)
    }


    handleOutline = (node) =>{
        if(node.location && this.refs.editor){
            this.refs.editor.goToLine(node.location.start.line)
        }

    }

    closeFile(file){
        return () =>{
            let newState = {openFiles:this.state.openFiles.filter( f=> f.name != file.name)}
            newState.file = _.last(newState.openFiles)
            newState.editorTabIndex = newState.openFiles.length-1
            
            this.setState(newState);    
        }
    }

    handleSelectFile = (file) =>{
        let index = this.state.openFiles.findIndex( f=> f.name == file.name)
        if(index<0){
            let files = this.state.openFiles
            files.push(file)
            this.setState({openFiles:files, file,  editorTabIndex:files.length-1});
            this.onSaveFile(file)
        }else{
            this.setState({file,  editorTabIndex:index})
            this.onSaveFile()
        }
    }

    runCode = () =>{
        if(this.state.file && this.state.file.isRunnable()){
            this.handleTabChange("bottomTabIndex")(0)
            this.refs.console.runFile(this.state.file)
            // console.log(interpreter(wre)(this.state.file.ast))
            // var code = runner.compile(this.state.file.ast)
            // eval(scope+"; "+ code)
            // with(scope) eval(window.code)

        }
    }

    onSelectError = (error) =>{
        var file = this.state.project.files.find(file=> file.name == error.file)
        this.handleSelectFile(file)
        this.handleOutline(error)
    }

    newFile =(file) =>{
        var project = this.state.project
        project.children.push(new File(file))
        // sessionStorage.setItem("project", JSON.stringify(this.state.project))
        this.setState(project)
    }

    runCommand = (command) =>{
        if(this.refs.editor){
            this.refs.editor.runCommand(command)
        }
    }

    render() {
        return (
            <div className="ide-container">
                <div className="header">
                    <Toolbar runCode={this.runCode} runCommand={this.runCommand} newFile={this.newFile} saveFile={()=> this.onSaveFile()}/>
                </div>
                <Splitter position="vertical" 
                    className="body"
                    primaryPaneMaxWidth="30%"
                    primaryPaneMinWidth="200px"
                    primaryPaneWidth="250px"
                >
                    <Splitter position="horizontal"  primaryPaneMaxHeight="90%" primaryPaneHeight="80%" className="left-panel">
                        <div className='left-panel-top'>
                            <div className='file-browser'>
                                <FileBrowser project={this.state.project} selectFile={this.handleSelectFile}/>
                            </div>
                        </div>
                        <div >
                            <Tabs theme={this.props.theme} index={0} className="tabs">
                                <Tab label='Outline' active={true}>
                                    <Outline file={this.state.file} onSelect={this.handleOutline} />
                                </Tab>
                            </Tabs>
                        </div>
                    </Splitter>

                    <Splitter position="horizontal"  primaryPaneMaxHeight="90%" primaryPaneHeight="70%" className="primary">
                        <div style={ { width: '100%', height: '100%'}}>
                            {
                                // <EditorComponent mode="wollok" value={this.state.code} onChange={ (code, event) => this.setState({ ...this.state, code }) } />
                            }
                            <Tabs theme={this.props.theme} index={this.state.editorTabIndex} onChange={this.handleTabChange("editorTabIndex")} className="tabs">
                                {this.state.openFiles.map( file=> <Tab theme={this.props.theme} icon={<i className={"icon-file file-"+file.extension}></i>} key={file.name} 
                                    label={ 
                                        <span> {file.name}  
                                            {file.dirty && <FontIcon className="dirty-icon" value='*'/>}
                                            <FontIcon value='close'  className="close-icon" onClick={this.closeFile(file)}/>
                                        </span> } 
                                    className="file" onActive={this.onSelectTab(file) } /> )}
                            </Tabs>
                            {this.state.file && <EditorComponent ref="editor" mode="wollok" name="editor" file={this.state.file} onChange={ this.updateCode } onSave={this.onSaveFile}/>}
                           
                        </div>
                        <Tabs theme={this.props.theme} index={this.state.bottomTabIndex} onChange={this.handleTabChange("bottomTabIndex")} className="tabs bottom-tabs fullHeight "
                            hideMode="display">
                            <Tab label={<span>Console  {this.state.runningConsole && <FontIcon value='stop' className="console-icon-stop" onClick={this.refs.console.stop}/>} </span> }
                                 active={true}  > 
                                <Console 
                                    ref="console"
                                    handler={this.handleConsole}
                                    updateStatus={this.updateConsoleStatus}
                                />
                            </Tab>

                            <Tab label='Errores'  >
                                <Problems project={this.state.project} onSelectError={this.onSelectError}/>
                            </Tab>
                        </Tabs>
                    </Splitter>
                </Splitter>
            </div>
        );
    }
}

IDEComponent.propTypes = {
};

const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(IDEComponent);
