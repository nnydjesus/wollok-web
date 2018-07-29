import React, {Component, PropTypes} from 'react';
import { Tabs, Button, Icon } from 'antd';
import { connect } from 'react-redux';
import EditorComponent from './EditorComponent.jsx'
import FileBrowser from './FileBrowser.jsx'
import Outline from './Outline.jsx'
import Toolbar from './Toolbar.jsx'
import {File, Project, Folder} from './model.js'
import Console from './Console.jsx'
import Problems from './Problems.jsx'
import Splitter from 'm-react-splitters';
import 'm-react-splitters/lib/splitters.css';
import {
    createFolder, updateFile, loadProject, createProject
} from '../../actions/fileSystem.jsx';


  const TabPane = Tabs.TabPane;

class IDEComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openFiles:[],
            editorTabIndex: undefined,
            bottomTabIndex:'console',
            runningConsole:false
        };
    }

    openProject = (projectName) => {
        this.props.dispatch(loadProject(projectName));
    }
    newProject = (projectName) => {
        this.props.dispatch(createProject(projectName));
    }

    handleTabChange = (tabType) => (tabIndex) => {
        var newState = {}
        newState[tabType] = tabIndex
        this.setState(newState);
    };

    onSelectTab = (file) => () =>{
        this.setState({file})
    }

    updateCode = (file) => (code, event) =>{
        file.text = code
        file.dirty = true
        this.setState({file})
    }

    updateConsoleStatus = (status) =>{
        this.setState({runningConsole: status.running})
    }

    get currentEditor() {
        return this.refs["editor_"+this.state.file.name]
    }

    onSaveFile = (aFile) =>{
        let file = aFile || this.state.file
        file.dirty = false
        file.parse()
        
        // sessionStorage.setItem("project", JSON.stringify(this.state.project))
        
        this.setState({file})
        this.props.dispatch(updateFile(file))
        // var jsCode = compiler(ast)
    }


    handleOutline = (node) =>{
        if(node.location && this.currentEditor){
            this.currentEditor.goToLine(node.location.start.line)
        }
    }

    closeFile(file){
        return () =>{
            let newState = {openFiles:this.state.openFiles.filter( f=> f.name != file.name)}
            newState.file = _.last(newState.openFiles)
            if(newState.file){
                newState.editorTabIndex = file.name
            }else{
                newState.editorTabIndex  = undefined
            }
            
            
            this.setState(newState);    
        }
    }

    handleSelectFile = (file) =>{
        let index = this.state.openFiles.findIndex( f=> f.name == file.name)
        if(index<0){
            let files = this.state.openFiles
            files.push(file)
            this.setState({openFiles:files, file,  editorTabIndex:file.name});
            this.onSaveFile(file)
        }else{
            this.setState({file,  editorTabIndex:file.name})
            this.onSaveFile()
        }
    }

    runCode = () =>{
        if(this.state.file && this.state.file.isRunnable()){
            this.handleTabChange("bottomTabIndex")('console')
            this.refs.console.runFile(this.state.file)
            // console.log(interpreter(wre)(this.state.file.ast))
            // var code = runner.compile(this.state.file.ast)
            // eval(scope+"; "+ code)
            // with(scope) eval(window.code)

        }
    }

    onSelectError = (error) =>{
        var file = this.props.project.files.find(file=> file.name == error.file)
        this.handleSelectFile(file)
        this.handleOutline(error)
    }

    newFile =(fileProperties) =>{
        var currentNode = this.refs.fileBrowser.state.cursor
        var project = this.props.project
        var file = new File(fileProperties)
        project.addFileToElement(file, currentNode)
        // sessionStorage.setItem("project", JSON.stringify(this.props.project))
        this.setState(project)
        this.props.dispatch(updateFile(file))
    }

    
    newFolder =(folderName) =>{
        var currentNode = this.refs.fileBrowser.state.cursor
        var project = this.props.project
        var folder = new Folder({name:folderName})
        project.addFolderToElement(folder, currentNode)
        this.setState(project)
        this.props.dispatch(createFolder(folder))
    }

    runCommand = (command) =>{
        if(this.currentEditor){
            this.currentEditor.runCommand(command)
        }
    }

    render() {
        return (
            <div className="ide-container">
                <div className="header">
                    <Toolbar runCode={this.runCode} runCommand={this.runCommand} newFile={this.newFile} newFolder={this.newFolder} openProject={this.openProject} 
                    newProject={this.newProject} saveFile={()=> this.onSaveFile()}/>
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
                                <FileBrowser ref="fileBrowser" project={this.props.project} selectFile={this.handleSelectFile}/>
                            </div>
                        </div>
                        <div >
                            <Tabs hideAdd type="card" activeKey="outline" className="tabs">
                                <TabPane tab='Outline' key="outline">
                                    <Outline file={this.state.file} onSelect={this.handleOutline} />
                                </TabPane>
                            </Tabs>
                        </div>
                    </Splitter>

                    <Splitter position="horizontal"  primaryPaneMaxHeight="90%" primaryPaneHeight="70%" className="primary">
                        <div  style={ { width: '100%', height: '100%'}}>
                            {
                                // <EditorComponent mode="wollok" value={this.state.code} onChange={ (code, event) => this.setState({ ...this.state, code }) } />
                            }
                            <Tabs  activeKey={this.state.editorTabIndex} onChange={this.handleTabChange("editorTabIndex")} className="tabs" animated={false}>
                                {this.state.openFiles.map( file=> 
                                <TabPane key={file.name}  tab={
                                    <span>
                                        <i className={"icon-file file-"+file.extension}></i>
                                            <span> {file.name}  
                                            {file.dirty && '*'}
                                            <Icon type="close" className="close-icon" onClick={this.closeFile(file)} />
                                        </span> 
                                    </span>} 
                                    className="file">

                                    <EditorComponent key={file.name} ref={"editor_"+file.name} mode="wollok" name="editor" file={file} onChange={ this.updateCode(file) } onSave={this.onSaveFile}/>
                                    
                                </TabPane> )}
                            </Tabs>

                           
                        </div>
                        <Tabs activeKey={this.state.bottomTabIndex} animated={false} onChange={this.handleTabChange("bottomTabIndex")} className="tabs bottom-tabs fullHeight " className="tabs">
                            <TabPane key="console" tab={<span>Console  {this.state.runningConsole && <Icon type='pause-circle' className="console-icon-stop" onClick={this.refs.console.stop}/>} </span> }> 
                                <Console 
                                    ref="console"
                                    handler={this.handleConsole}
                                    updateStatus={this.updateConsoleStatus}
                                />
                            </TabPane>

                            <TabPane tab='Errores' key="errors" >
                                <Problems project={this.props.project} onSelectError={this.onSelectError}/>
                            </TabPane>
                        </Tabs>
                    </Splitter>
                </Splitter>
            </div>
        );
    }
}

IDEComponent.propTypes = {
};
const mapStateToProps = (globalState) => {
    return {
        project: globalState.fs.project,
    };
};
export default connect(mapStateToProps)(IDEComponent);
