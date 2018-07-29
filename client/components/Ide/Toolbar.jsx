import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Menu, Icon, Modal, Input, List, Tooltip} from 'antd';
import {
  loadProjects
} from '../../actions/fileSystem.jsx';

const SubMenu = Menu.SubMenu;

class ToolbarComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newFileMenuActive: false,
      fileDialog:{
        active:false,
        title:"",
        contentNameLabel:""
      },
      showFolderDialog: false,
      showOpenProyectDialog: false,
      showNewProyectDialog: false,
      title:"",
      mode:"",
      contentName:"",
      fileExtension:"",
      fileName:""
    };
  }

  activeNewFileMenuItem(active){ 
    return () =>{
      this.setState({newFileMenuActive:active})
    }
  }

  createObject = () => {
    this.setState({
      mode:"object",
      fileExtension:"wlk",
      template:()=>`object ${this.state.contentName} {\n \n}`,
      fileDialog:{
        active:true,
        contentNameLabel:"Nombre del objeto"
      }
    })
  }

  createClass = () => {
    this.setState({
      mode:"class",
      fileExtension:"wlk",
      template:()=>`class ${this.state.contentName} {\n \n}`,
      fileDialog:{
        active:true,
        title:'Crear un nuevo archivo para una clase',
        contentNameLabel:"Nombre de la clase"
      }
    })
  }

  createTest = () => {
    this.setState({
      mode:"test",
      fileExtension:"wtest",
      template:()=>`test "${this.state.contentName}" {\n \t assert.that(true) \n}`,
      fileDialog:{
        active:true,
        title:'Crear un nuevo archivo para un test',
        contentNameLabel:"Nombre del test"
      }
    })
  }

  createProgram = () => {
    this.setState({
      mode:"test",
      fileExtension:"wpgm",
      template:()=>`program ${this.state.contentName} {\n \t console.println('Hello Wollok') \n}`,
      fileDialog:{
        active:true,
        title:'Crear un nuevo archivo para un programa',
        contentNameLabel:"Nombre del programa"
      }
    })
  }

  newFolder = () =>{
    this.setState({showFolderDialog:true})
  }

  onSave = () => {
    this.cleanState()
    this.props.newFile({ name: this.state.fileName+'.'+this.state.fileExtension, dirty:false, text:this.state.template(), extension:this.state.fileExtension})
  }

  saveFolder = () => {
    this.cleanState()
    this.props.newFolder(this.state.folderName)
  }


  openProject = (projectName) => {
    this.cleanState()
    this.props.openProject(projectName)
  }

  newProject = () => {
    this.cleanState()
    this.props.newProject(this.state.proyectName)
  }

  openProjectModal = () => {
    this.setState({showOpenProyectDialog: true})
    this.props.dispatch(loadProjects())
  }

  newProjectModal = () => {
    this.setState({showNewProyectDialog:true})
  }


  cleanState = () => {
    this.setState({
      mode:"",
      fileExtension:"",
      template:"",
      contentName:"",
      fileName:"",
      folderName:"",
      fileDialog:{
        active:false,
        title:'',
        contentNameLabel:"Nombre del programa"
      },
      showFolderDialog: false,
      showNewProyectDialog: false,
      showOpenProyectDialog: false
    })
  }

  handleChange = (name) => (value) => {
    this.setState({...this.state, [name]: value.target.value});
  };

  render() {
    return (
      <nav className="toolbar">
        <Menu mode="horizontal">
            
            <Menu.Item key='open_project'  onClick={this.openProjectModal}>
                <Tooltip placement="bottom" title='Abrir'>
                  <Icon type="folder-open" />
                </Tooltip>
            </Menu.Item>

            <Menu.Item key='new_project' onClick={this.newProjectModal}>
              <Tooltip placement="bottom" title='Nuevo projecto'>
                <Icon type="code-o" />
              </Tooltip>
            </Menu.Item>

            <SubMenu key="new_file" title={<span><Icon type="file-add" /></span>}>
              <Menu.Item key='objects' onClick={this.createObject}>
                <span>
                    <i className="icon-file wollok-object" />
                    Wollok Objects
                </span>
              </Menu.Item>
              <Menu.Item key='clasess'  onClick={this.createClass}>
                <span>
                    <i className="icon-file wollok-class" />
                    Wollok Classes
                </span>
              </Menu.Item>
              <Menu.Item key='tests'  onClick={this.createTest}>
                <span>
                    <i className="icon-file wollok-test" />
                    Wollok Tests
                </span>
              </Menu.Item>
              <Menu.Item key='program' onClick={this.createProgram}>
                <span>
                    <i className="icon-file wollok-program" />
                    Wollok Program
                </span>
              </Menu.Item>
            </SubMenu>

            <Menu.Item key='new_folder' onClick={this.newFolder}>
              <Tooltip placement="bottom" title='Nueva Carpeta'>
                <Icon type="folder-add" />
              </Tooltip>
            </Menu.Item>

            <Menu.Item key='save_file' onClick={this.props.saveFile}>
                <Tooltip placement="bottom" title='Guardar'>
                  <Icon type="save" />
                </Tooltip>
            </Menu.Item>

            <Menu.Item key='undo'  onClick={()=>this.props.runCommand('undo')}>
              <Tooltip placement="bottom" title='Deshacer'>
                <Icon type="left" />
              </Tooltip>
            </Menu.Item>

            <Menu.Item key='redo'   onClick={()=>this.props.runCommand('redo')}>
              <Tooltip placement="bottom" title='Rehacer'>
                <Icon type="right" />
              </Tooltip>
            </Menu.Item>

            <Menu.Item key='search'   onClick={()=>this.props.runCommand('find')}>
              <Tooltip placement="bottom" title='Buscar'>
                <Icon type="search" />
              </Tooltip>
            </Menu.Item>

            <Menu.Item key='find_replace'  onClick={()=>this.props.runCommand('replace')}>
              <Tooltip placement="bottom" title='Reemplazar'>
                <Icon type="link" />
                </Tooltip>
            </Menu.Item>

            <Menu.Item key='play' onClick={this.props.runCode}>
              <Tooltip placement="bottom" title='Ejecutar'>
                <Icon type="play-circle" />
                </Tooltip>
            </Menu.Item>

        </Menu>

        
        <Modal key="modal_file" onOk={ this.onSave} onCancel={this.cleanState} visible={this.state.fileDialog.active} title={this.state.fileDialog.title} >
          <input label='Nombre del archivo' name='fileName' value={this.state.fileName} onChange={this.handleChange('fileName')} />
          <input label={this.state.fileDialog.contentNameLabel} name='contentName' value={this.state.contentName} onChange={this.handleChange('contentName')} />          
        </Modal>

        <Modal key="modal_folder" onOk={ this.saveFolder} onCancel={this.cleanState} visible={this.state.showFolderDialog} title="Nombre de la carpeta" >
          <Input label='Nombre de la carpeta' name='folderName' value={this.state.folderName} onChange={this.handleChange('folderName')} />
        </Modal>

        <Modal key="modal_open_project" onOk={ this.openProject} onCancel={this.cleanState} visible={this.state.showOpenProyectDialog} title="Buscar el proyecto" >
            <List
              itemLayout="horizontal"
              dataSource={this.props.projects}
              renderItem={item => (
                <List.Item>
                <List.Item.Meta
                  title={<a onClick={()=> this.openProject(item)}>{item}</a>}
                  description=""
                />
              </List.Item>
              )}
            />
        </Modal>

        <Modal key="modal_new_project" onOk={ this.newProject} onCancel={this.cleanState} visible={this.state.showNewProyectDialog} title="Nuevo proyecto" >
          <Input label='Nombre del proyecto' name='proyectName' value={this.state.proyectName} onChange={this.handleChange('proyectName')} />
        </Modal>
        
    </nav>
    );
  }
}

ToolbarComponent.propTypes = {
};
const mapStateToProps = (globalState) => {
    return {
        projects: globalState.fs.projects,
    };
};
export default connect(mapStateToProps)(ToolbarComponent);

