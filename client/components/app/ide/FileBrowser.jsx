import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import {connect} from 'react-redux';
import { Input } from 'react-toolbox/lib/input';
import {Treebeard, decorators} from 'react-treebeard';
import treebeardStyle from './treebeardStyle'


const defaultMatcher = (filterText, node) => {
  return node.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
}

// Example: Customising The Header Decorator To Include Icons
decorators.Header = ({style, node}) => {
  const iconStyle = {marginRight: '5px'};

  return (
      <div style={style.base}>
          <div style={style.title}>
              <i className={"icon-file file-"+node.extension} style={iconStyle}/>
              {node.new? <input value={node.name} type="text" className="newFileName"/>  : node.name}
          </div>
      </div>
  );
};

class FileBrowserComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.project
    };
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

  onFilterMouseUp = (e) =>{
    const filter = e.target.value.trim();
    if (!filter) {
        return this.setState({data:this.props.project});
    }
    var filtered = this.filterTree(this.props.project, filter);
    filtered = this.expandFilteredNodes(filtered, filter);
    this.setState({data: filtered});
  }


  render() {
    return (
      <div  className="file-browser-tree">
        <Input type='text' name='search' icon='search' value={this.state.filter} className="search" onKeyUp={this.onFilterMouseUp } />
        <Treebeard
          data={this.state.data}
          decorators={decorators}
          onToggle={this.onToggle}
          style ={treebeardStyle}
        />
      </div>
    );
  }
}

export default FileBrowserComponent;
