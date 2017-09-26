import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import {Tooltip, Link, Input, Button} from 'react-toolbox/lib';
import {IconMenu, MenuItem, MenuDivider, Menu } from 'react-toolbox/lib/menu';
import Dialog from 'react-toolbox/lib/dialog';

const TooltipLink = Tooltip(Link);

class ToolbarComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newFileMenuActive: false,
      dialog:{
        active:false,
        title:"",
        contentNameLabel:""
      },
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
      dialog:{
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
      dialog:{
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
      dialog:{
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
      dialog:{
        active:true,
        title:'Crear un nuevo archivo para un programa',
        contentNameLabel:"Nombre del programa"
      }
    })
  }

  onSave = () => {
    this.cleanState()
    this.props.newFile({ name: this.state.fileName+'.'+this.state.fileExtension, dirty:false, text:this.state.template(), extension:this.state.fileExtension})
  }

  cleanState = () => {
    this.setState({
      mode:"",
      fileExtension:"",
      template:"",
      contentName:"",
      fileName:"",
      dialog:{
        active:false,
        title:'',
        contentNameLabel:"Nombre del programa"
      }
    })
  }

  handleChange = (name) => (value) => {
    this.setState({...this.state, [name]: value});
  };

  actions = [
    { label: "Cancel", onClick: this.cleanState },
    { label: "Save", onClick: this.onSave }
  ];

  render() {
    return (
      <nav className="toolbar">

        <div className="icon_container">
          <TooltipLink icon='insert_drive_file' tooltip='Nuevo Archivo' onClick={this.activeNewFileMenuItem(true)} className="icon_link" />
          <Menu icon='insert_drive_file' tooltip='Nuevo Archivo' position='topLeft' menuRipple active={this.state.newFileMenuActive} 
            onSelect={this.activeNewFileMenuItem(false) } onHide={this.activeNewFileMenuItem(false) }>
            <MenuItem value='objects'  caption='Wollok Objects' icon={<i className="icon-file wollok-object" />} onClick={this.createObject}/>
            <MenuItem value='clasess'  caption='Wollok Classes' icon={<i className="icon-file wollok-class" />} onClick={this.createClass}/>
            <MenuItem value='tests'  caption='Wollok Tests' icon={<i className="icon-file wollok-test" />} onClick={this.createTest}/>
            <MenuItem value='program' caption='Wollok Program' icon={<i className="icon-file wollok-program" />} onClick={this.createProgram}/>
          </Menu>
        </div>

        <TooltipLink icon='create_new_folder' tooltip='Nueva Carpeta'  />
        <TooltipLink icon='save' tooltip='Guardar' onClick={this.props.saveFile}/>  
        <div className="separator"/>
        <TooltipLink icon='undo' tooltip='Deshacer' onClick={()=>this.props.runCommand('undo')}/>
        <TooltipLink icon='redo' tooltip='Rehacer' onClick={()=>this.props.runCommand('redo')}/>
        <div className="separator"/>
        <TooltipLink icon='search' tooltip='Buscar' onClick={()=>this.props.runCommand('find')}/>
        <TooltipLink icon='find_replace' tooltip='Reemplazar' onClick={()=>this.props.runCommand('replace')}/>
        <div className="separator"/>
        <TooltipLink icon='play_arrow' onClick={this.props.runCode} tooltip='Ejecutar'/>

        <Dialog actions={this.actions} active={this.state.dialog.active} title={this.state.dialog.title} type="small" >
          <Input type='text' label='Nombre del archivo' name='fileName' value={this.state.fileName} onChange={this.handleChange('fileName')} />
          <Input type='text' label={this.state.dialog.contentNameLabel} name='contentName' value={this.state.contentName} onChange={this.handleChange('contentName')} />          
        </Dialog>
    </nav>
    );
  }
}


export default ToolbarComponent;
