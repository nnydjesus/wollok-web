import React, {Component, PropTypes} from 'react';
import { Input } from 'antd';
import { connect } from 'react-redux';
import {Treebeard, decorators} from 'react-treebeard';
import treebeardStyle from './treebeardStyle'
import TrashIcon from 'react-icons/lib/fa/trash'
import RefreshIcon from 'react-icons/lib/fa/refresh'
import _ from 'lodash'
import { ContextMenu, Item, Separator, Submenu, ContextMenuProvider } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';

const Search = Input.Search;
const defaultMatcher = (filterText, node) => {
  return node.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
}
const onClick = ({ event, ref, data, dataFromProvider }) => console.log('Hello');

// Example: Customising The Header Decorator To Include Icons

class FileBrowserComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      project: props.project
    };
  }

  componentWillMount(){
    decorators.Header = ({style, node}) => {
      const iconStyle = {marginRight: '5px'};
      
      return (
          <div style={style.base}>
              <ContextMenuProvider id={node.name}>
                <div style={style.title}>
                    <i className={"icon-file file-"+node.extension} style={iconStyle}/>
                    {node.editMode? <input autoFocus value={this.state.renameNode} type="text" className="newFileName" onChange={this.updateField("renameNode")} onKeyPress={this.handleRename(node)}/>  : node.name}
                </div>
              </ContextMenuProvider>
              <ContextMenu id={node.name} theme="dark" animation='pop'>
                {node.extension=="directory" &&
                    <Submenu label="Nuevo archivo">
                    <Item onClick={onClick}><i className="icon-file wollok-object" /> Objeto</Item>
                    <Item onClick={onClick}><i className="icon-file wollok-class" /> Clase</Item>
                    <Item onClick={onClick}><i className="icon-file wollok-test" /> Test</Item>
                    <Item onClick={onClick}><i className="icon-file wollok-program" /> Programa</Item>
                  </Submenu>
                }
                 <Separator />
                <Item onClick={()=> this.changeEditMode(node)}>
                    <span className="contextMenuIcon"><RefreshIcon/></span>
                    <span>Renombrar</span>
                </Item>
                <Item onClick={()=> this.deleteNode(node)}>
                    <span className="contextMenuIcon"><TrashIcon/></span>
                    <span>Eliminar</span>
                </Item>
              </ContextMenu>
          </div>
      );
    };
  }

  componentWillReceiveProps(newProps) {
    if (!this.state.project || this.state.project.updates != newProps.project.updates) {
      this.setState({project:newProps.project}); 
    }
  }

  handleRename = (node) => (event) =>{
    if(event.key == 'Enter'){
      var element = this.findElementByNode(node)
      element.name = this.state.renameNode
      element.editMode = false
      this.setState({project:this.state.project})
    }
  }

  updateField = (field) => (event) => {
    var newState = {}
    newState[field] = event.target.value
    this.setState(newState)
  }

  changeEditMode = (node) =>{
      var element = this.findElementByNode(node)
      element.editMode = true
      this.setState({project:this.state.project, renameNode:node.name})
  }

  deleteNode = (node) =>{
    this.props.deleteElement(this.findElementByNode(node))
  }

  findElementByNode(node){
    var element = this.state.project
    if(element.path == node.path && element.name == node.name){
      return element
    }
    var subPath = node.path.replace(element.path+element.name, '')
    subPath.split("/").forEach(p =>{
      if(p != ""){
        element = element.children.find( child => child.name == p && child.isDirectory)
      }
    })
    return element.children.find( child => child.name == node.name)
  }

  get selectedNode(){
    return this.state.cursor?this.state.cursor:this.state.project
  }

  onToggle = (node, toggled) => {
    if(this.state.cursor){this.state.cursor.active = false;}
    node.active = true;
    if(node.children){
       node.toggled = toggled; 
    }else{
      this.props.selectFile(node)
    }
    this.setState({ cursor: node });
    
  }

  findNode = (node, filter, matcher) => {
    return matcher(filter, node) || // i match
        (node.children && // or i have decendents and one of them match
        node.children.length &&
        !!node.children.find(child => this.findNode(child, filter, matcher)));
  }

  filterTree = (node, filter, matcher = defaultMatcher) => {
    // If im an exact match then all my children get to stay
    if(matcher(filter, node) || !node.children){ return node; }
    // If not then only keep the ones that match or have matching descendants
    const filtered = node.children
      .filter(child => this.findNode(child, filter, matcher))
      .map(child => this.filterTree(child, filter, matcher));
    return Object.assign({}, node, { children: filtered });
  }

  expandFilteredNodes = (node, filter, matcher = defaultMatcher) => {
    let children = node.children;
    if(!children || children.length === 0){
      return Object.assign({}, node, { toggled: false });
    }
    const childrenWithMatches = node.children.filter(child => this.findNode(child, filter, matcher));
    const shouldExpand = childrenWithMatches.length > 0;
    // If im going to expand, go through all the matches and see if thier children need to expand
    if(shouldExpand){
      children = childrenWithMatches.map(child => {
          return this.expandFilteredNodes(child, filter, matcher);
      });
    }
    return Object.assign({}, node, {
      children: children,
      toggled: shouldExpand
    })
  }

  onFilterMouseUp = (filter) =>{
    var filtered = this.filterTree(this.props.project, filter);
    filtered = this.expandFilteredNodes(filtered, filter);
    this.setState({project: filtered});
  }


  render() {
    return (
      <div  className="file-browser-tree">
        {this.state.project && 
        <div>
          <Search placeholder='search' name='search' className="search"  onSearch={this.onFilterMouseUp } />
          <Treebeard
            data={this.state.project}
            decorators={decorators}
            onToggle={this.onToggle}
            style ={treebeardStyle}
          />
          </div>
        }
      </div>
    );
  }
}


const mapStateToProps = (globalState) => {
  return {

  };
};
export default FileBrowserComponent;

