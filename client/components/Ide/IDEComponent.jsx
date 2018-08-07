import React, {Component, PropTypes} from 'react';
import { Tabs, Button, Icon } from 'antd';
import { connect } from 'react-redux';
import EditorComponent from './EditorComponent.jsx'
import FileBrowser from './FileBrowser.jsx'
import Outline from './Outline.jsx'
import Toolbar from './Toolbar.jsx'
import {Folder, defaultText} from '../../model/model'
import Console from './Console.jsx'
import Problems from './Problems.jsx'
import Splitter from 'm-react-splitters';
import Modals from './Modals.jsx';
import 'm-react-splitters/lib/splitters.css';
import remoteFileSystem from '../../actions/remoteFileSystem.jsx';
import localFileSystem from '../../actions/localFileSystem.jsx';
import Login from '../login/Login.jsx';



  const TabPane = Tabs.TabPane;

class IDEComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openFiles:[],
            editorTabIndex: undefined,
            bottomTabIndex:'console',
            runningConsole:false,
            modal:{show:false}
        };
    }

    get fileSystem(){
        if(this.props.isLogged){
            return remoteFileSystem
        }else{
            return localFileSystem
        }
    }
    

    openProject = (projectName) => {
        this.props.dispatch(this.fileSystem.loadProject(projectName));
        this.setState({openFiles: [], file: undefined})
    }
    newProject = (projectName) => {
        this.props.dispatch(this.fileSystem.createProject(projectName));
        this.setState({openFiles: [], file: undefined})
    }

    handleTabChange = (tabType) => (tabIndex) => {
        var newState = {}
        newState[tabType] = tabIndex
        this.setState(newState);
    };

    handleEditorTabIndex = (fileName) => {
        this.handleSelectFile(this.state.openFiles.find(file => file.name == fileName));
    }

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
        this.props.dispatch(this.fileSystem.updateFile(file))
        // var jsCode = compiler(ast)
    }


    handleOutline = (node) =>{
        if(node.location && this.currentEditor){
            this.currentEditor.goToLine(node.location.start.line)
        }
    }

    closeFile(file){
        return (e) =>{
            if(e)   e.stopPropagation();
            let newState = {openFiles:this.state.openFiles.filter( f=> f.name != file.name)}
            if(file.equals(this.state.file)){
                newState.file = _.last(newState.openFiles)
                if(newState.file){
                    newState.editorTabIndex = newState.file.name
                }else{
                    newState.editorTabIndex  = undefined
                }
            }
            this.setState(newState);    
        }
    }
 
    componentWillReceiveProps(newProps) {
        if (!newProps.project && this.state.openFiles.length > 0) {
            this.setState({openFiles:[], file:undefined})
          }

        if (newProps.selectedNode && !newProps.selectedNode.isDirectory && (!this.state.file || newProps.selectedNode.completeName != this.state.file.completeName ) ) {
          this.handleSelectFile(newProps.selectedNode)
        }
      }

    handleSelectFile = (file) =>{
        let index = this.state.openFiles.findIndex( f=> f.name == file.name)
        file.parse()
        if(index<0){
            let files = this.state.openFiles
            files.push(file)
            this.setState({openFiles:files, file,  editorTabIndex:file.name});
            // this.onSaveFile(file)
        }else{
            this.setState({file,  editorTabIndex:file.name})
            // this.onSaveFile()
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
        fileProperties.text = defaultText(fileProperties)
        fileProperties.isNew = true
        
        if(this.props.selectedNode.isDirectory){
            fileProperties.path = this.props.selectedNode.path + this.props.selectedNode.name
        }else{
            fileProperties.path = this.props.selectedNode.path
        }

        this.props.dispatch(this.fileSystem.createFile(fileProperties))
    }

    
    newFolder =(folderName) =>{
        var project = this.props.project
        var folder = new Folder({name:folderName})
        project.addFolderToElement(folder, this.props.selectedNode)
        this.setState(project)
        this.props.dispatch(this.fileSystem.createFolder(folder))
    }

    deleteElement = (element) =>{
        if(!element.isDirectory){
            let index = this.state.openFiles.findIndex( f=> f.name == element.name)
            if(index>=0){
                this.closeFile(element)()
            }
            this.props.dispatch(this.fileSystem.deleteFile(element))
        }else{
            this.props.dispatch(this.fileSystem.deleteFolder(element))
        }
    }


    runCommand = (command) =>{
        if(this.currentEditor){
            this.currentEditor.runCommand(command)
        }
    }

    rename = (element) =>{

    }

    showDialog = (params)=> {
        this.setState({
            modal:{show:true, params:params}
        })
    }

    hideDialog = ()=> {
        this.setState({modal:{show:false}})
    }

    confirmModal = (result) =>{
        this.state.modal.params.confirm(result)
        this.setState({modal:{show:false}})
    }

    render() {
        return (
            <div className="ide-container">
                <div className="header">
                    <Toolbar runCode={this.runCode} fileSystem={this.fileSystem} runCommand={this.runCommand} newFile={this.newFile} newFolder={this.newFolder} openProject={this.openProject} 
                    newProject={this.newProject} saveFile={()=> this.onSaveFile()} showDialog={this.showDialog} />
                </div>
                <Splitter position="vertical" 
                    className="body"
                    primaryPaneMaxWidth="30%"
                    primaryPaneMinWidth="200px" 
                    primaryPaneWidth="250px"
                >
                    <Splitter position="horizontal"  primaryPaneMaxHeight="90%" primaryPaneHeight="50%" className="left-panel">
                        <div className='left-panel-top'>
                            <div className='file-browser'>
                                <FileBrowser fileSystem={this.fileSystem} selectFile={this.handleSelectFile} rename={this.rename} deleteElement={this.deleteElement} showDialog={this.showDialog} newFile={this.newFile} newFolder={this.newFolder} />
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
                            <Tabs  activeKey={this.state.file?this.state.file.name:undefined} onChange={this.handleEditorTabIndex } className="tabs" animated={false}>
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

                {this.state.modal.show && <Modals params={this.state.modal.params} hideDialog={this.hideDialog} confirm={this.confirmModal} active={this.state.modal.show} />}

                <Login />
            </div>
        );
    }
}

IDEComponent.propTypes = {
};
const mapStateToProps = (globalState) => {
    return {
        project: globalState.fs.project,
        selectedNode: globalState.fs.selectedNode,
        projectUpdates: globalState.fs.updates,
        isLogged: globalState.login.authToken!= undefined,
    };
};
export default connect(mapStateToProps)(IDEComponent);
