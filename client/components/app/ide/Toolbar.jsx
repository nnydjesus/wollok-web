import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import Tooltip from 'react-toolbox/lib/tooltip';
import Link from 'react-toolbox/lib/link';
import {IconMenu, MenuItem, MenuDivider, Menu } from 'react-toolbox/lib/menu';
import Dialog from 'react-toolbox/lib/dialog';

const TooltipLink = Tooltip(Link);

class ToolbarComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newFileMenuActive: false,
      dialogActive:false
    };
  }

  activeNewFileMenuItem(active){ 
    return () =>{
      this.setState({newFileMenuActive:active})
    }
  }

  handleToggle = () => {
    this.setState({dialogActive: !this.state.dialogActive});
  }

  actions = [
    { label: "Cancel", onClick: this.handleToggle },
    { label: "Save", onClick: this.handleToggle }
  ];

  render() {
    return (
      <nav className="toolbar">
        <TooltipLink icon='insert_drive_file' tooltip='Nuevo Archivo' onClick={this.activeNewFileMenuItem(true)} >
        </TooltipLink>
        <Menu icon='insert_drive_file' tooltip='Nuevo Archivo' position='topLeft' menuRipple active={this.state.newFileMenuActive} 
          onSelect={this.activeNewFileMenuItem(false) } onHide={this.activeNewFileMenuItem(false) }>
          <MenuItem value='objects'  caption='Wollok Objects' icon={<i className="icon-file wollok-object" />} onClick={this.handleToggle}/>
          <MenuItem value='clasess'  caption='Wollok Classes' icon={<i className="icon-file wollok-class" />}/>
          <MenuItem value='tests'  caption='Wollok Tests' icon={<i className="icon-file wollok-test" />}/>
          <MenuItem value='program' caption='Wollok Program' icon={<i className="icon-file wollok-program" />}/>
        </Menu>

        

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

        <Dialog actions={this.actions} active={this.state.dialogActive} title='My awesome dialog' type="small" >
          <p>Here you can add arbitrary content. Components like Pickers are using dialogs now.</p>
        </Dialog>
    </nav>
    );
  }
}


export default ToolbarComponent;
