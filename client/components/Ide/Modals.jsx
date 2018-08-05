import React, {Component} from 'react';
import Modal from '../library/Modal.jsx';
import Input from '../library/Input.jsx'

const defaultconfig = {
    newFile:{ },
    newProject:{ },
    newFolder: {}
}

class ModalsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState()
  }

  initialState(){
      return JSON.parse(JSON.stringify(defaultconfig))
  }

  newProjectContent(){
    return this.createInput({label:'Nombre del proyecto', field:'projectName', confirm:true, focus:true})
  }

  newFolderContent(){
      return this.createInput({label:'Nombre de la carpeta', field:'folderName', confirm:true, focus:true})
  }

  newFileContent(){
    return (
        <div >
            <Input  placeholder='Nombre del archivo' label="Nombre del archivo" field='fileName' value={this.state.newFile.fileName} onChange={this.handleChange('newFile', "fileName")} />
            <Input  placeholder={this.props.params.contentName} label={this.props.params.contentName} field='contentName' value={this.state.newFile.contentName} onChange={this.handleChange('newFile', "contentName")} onEnter={this.confirm}/> 
        </div>
    )
  }

  createInput(params){
    return (
        <Input placeholder={params.label} label={params.label} field={params.field} value={this.state[this.props.params.mode][params.field]} onChange={this.handleChange(this.props.params.mode, params.field)} onEnter={params.confirm?this.confirm: ()=>{} } focus={this.props.focus}/>
    )
  }

  handleChange = (object, property) => (text) => {
    var objectState = this.state[object]
    if(objectState == undefined){
        objectState = {}
    }
    objectState[property] = text
    this.setState({ [object]: objectState });
  }

  cleanState = () =>{
    this.setState(this.initialState())
      this.props.hideDialog()
  }

  confirm = () =>{
      this.props.confirm(this.state[this.props.params.mode])
  }

  render() {
    var config = defaultconfig[this.props.params.mode]
    var content = <div></div>

    switch (this.props.params.mode) {
        case "newFile":
            content = this.newFileContent()
            break;
        case "newProject":
            content = this.newProjectContent()
            break;
        case "newFolder":
            content = this.newFolderContent()
            break;
        default:
            break;
    }
    return (
        <Modal key="modal" onOk={this.confirm} onClose={this.cleanState} visible={this.props.active} title={this.props.params.title || config.title} >
          { content }
        </Modal>
    );
  }
}

export default ModalsComponent;

