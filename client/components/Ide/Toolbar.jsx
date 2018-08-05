import React, {Component} from 'react';
import FileCreator from './FileCreator.jsx';
import { connect } from 'react-redux';
import { Icon, List, Tooltip} from 'antd';
import Modal from '../library/Modal.jsx';
import Menu from "../library/Menu.jsx"
import {showLogin, logout} from "../../actions/login.jsx";

class ToolbarComponent extends FileCreator {
  constructor(props) {
    super(props);

    this.state = {
      newFileMenuActive: false,
      showOpenProyectDialog: false,
    };
  }

  activeNewFileMenuItem(active){ 
    return () =>{
      this.setState({newFileMenuActive:active})
    }
  }

  onSave = () => {
    this.props.newFile({ name: this.state.fileName+'.'+this.state.fileExtension, dirty:false, text:this.state.template(), extension:this.state.fileExtension})
  }

  openProject = (projectName) => {
    this.cleanState()
    this.props.openProject(projectName)
  }

  openProjectModal = () => {
    this.setState({showOpenProyectDialog: true})
    this.props.dispatch(this.props.fileSystem.loadProjects())
  }

  newProjectModal = () => {
    this.props.showDialog({
      mode: "newProject",
      title:'Nuevo proyecto',
      confirm: (result) => this.props.newProject(result.projectName)
    })
  }

  showLogin  = () => {
    this.props.dispatch(showLogin())
  }

  logout  = () => {
    this.props.dispatch(logout())
  }


  cleanState = () => {
    this.setState({ showOpenProyectDialog: false })
  }

  handleChange = (name) => (value) => {
    this.setState({...this.state, [name]: value.target.value});
  };

  createTooltip(data){
    return (
      <Tooltip placement="bottom" title={data.title}>
        <Icon type={data.icon} />
      </Tooltip>
    )
  }


  get iconMenuItems(){
    var hasProject = this.props.project != undefined
    return [
      { key:"open_project", content: this.createTooltip({title: "Abrir", icon : "folder-open"}), onClick: this.openProjectModal },
      { key:"new_project", content: this.createTooltip({title: 'Nuevo projecto', icon:"code-o"}), onClick: this.newProjectModal },
      { key:"new_file", title:<span><Icon type="file-add" /></span>, disabled:!hasProject, items:[
        { key:"objects", onClick: this.createObject, content: <span> <i className="icon-file wollok-object" /> Wollok Objects </span>},
        { key:"clasess", onClick: this.createClass,  content: <span> <i className="icon-file wollok-class" /> Wollok Classes </span>},
        { key:"tests", onClick: this.createTest,  content: <span> <i className="icon-file wollok-test" /> Wollok Tests </span>},
        { key:"program", onClick: this.createProgram,  content: <span> <i className="icon-file wollok-program" /> Wollok Program </span>},
      ]},
      { key:"new_folder", content: this.createTooltip({title: 'Nueva Carpeta', icon:"folder-add"}), onClick: this.newFolder, disabled:!hasProject },
      { key:"save_file", content: this.createTooltip({title: 'Guardar', icon:"save"}), onClick: this.props.saveFile, disabled:!hasProject },
      { key:"undo", content: this.createTooltip({title: 'Deshacer', icon:"left"}), onClick: ()=>this.props.runCommand('undo') },
      { key:"redo", content: this.createTooltip({title: 'Rehacer', icon:"right"}), onClick: ()=>this.props.runCommand('redo') },
      { key:"search", content: this.createTooltip({title: 'Buscar', icon:"search"}), onClick: ()=>this.props.runCommand('find') },
      { key:"find_replace", content: this.createTooltip({title: 'Reemplazar', icon:"link"}), onClick: ()=>this.props.runCommand('replace') },
      { key:"play", content: this.createTooltip({title: 'Ejecutar', icon:"play-circle"}), onClick: this.props.runCode },
    ]
  }

  get clasicMenuItems(){
    var hasProject = this.props.project != undefined
    return [
      { key:"icon", content: <i className="logo" /> },
      { key:"file", title:"File", items:[
          { key:"new_file", title:"Nuevo archivo", disabled:!hasProject, items:[
            { key:"objects", onClick: this.createObject, content: <span> <i className="icon-file wollok-object" /> Wollok Objects </span>},
            { key:"clasess", onClick: this.createClass,  content: <span> <i className="icon-file wollok-class" /> Wollok Classes </span>},
            { key:"tests", onClick: this.createTest,  content: <span> <i className="icon-file wollok-test" /> Wollok Tests </span>},
            { key:"program", onClick: this.createProgram,  content: <span> <i className="icon-file wollok-program" /> Wollok Program </span>},
          ]},
          { key:"new_folder", content: "Nueva Carpeta", onClick: this.newFolder, disabled:!hasProject },
          { key:"save_file", content: "Guardar", onClick: this.props.saveFile, disabled:!hasProject },
          { key:"close_all", content: "Cerrar todos los tabs", onClick: ()=>{}, disabled:!hasProject },
      ]},
      { key:"edit", title:"Edit", items:[
        { key:"undo", content: 'Deshacer', onClick: ()=>this.props.runCommand('undo') },
        { key:"redo", content: 'Rehacer', onClick: ()=>this.props.runCommand('redo') },
      ]},

      { key:"find", title:"Find", items:[
        { key:"search", content: 'Buscar', onClick: ()=>this.props.runCommand('find') },
        { key:"find_replace", content: 'Reemplazar', onClick: ()=>this.props.runCommand('replace') },
      ]}
    ]
  }

  render() {
    return (
      <div className="">
        <div className="toolbar">
          <Menu mode="horizontal" items={this.clasicMenuItems}/>
          <Menu mode="horizontal" items={this.iconMenuItems}/>

          <Modal key="modal_open_project" onOk={ this.cleanState} onClose={this.cleanState} visible={this.state.showOpenProyectDialog} title="Buscar el proyecto" >
              <List
                itemLayout="horizontal"
                dataSource={this.props.projects}
                renderItem={item => (
                  <List.Item>
                  <List.Item.Meta
                    title={<a onClick={()=> this.openProject(item.name)}>{item.name}</a>}
                    description=""
                  />
                </List.Item>
                )}
              />
          </Modal>
          
        </div>
        <div className="login">
              {this.props.isLogged && 
                <div className="logout">
                    <a className="user-avatar" aria-expanded="false"></a>
                    <span className="username"> {this.props.username} </span>
                    <a onClick={this.logout } className="btn btn-primary btn-block btn-logout">SALIR</a> 
                </div>
              }
              {!this.props.isLogged && <a onClick={this.showLogin } className="btn btn-primary btn-block btn-login">INGRESAR</a> }
        </div>
      </div>
    );
  }
}

ToolbarComponent.propTypes = {
};
const mapStateToProps = (globalState) => {
    return {
        projects: globalState.fs.projects,
        project: globalState.fs.project,
        isLogged: globalState.login.authToken != undefined,
        username: globalState.login.username
    };
};
export default connect(mapStateToProps)(ToolbarComponent);

