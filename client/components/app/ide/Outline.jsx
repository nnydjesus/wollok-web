import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import {connect} from 'react-redux';
import {Treebeard, decorators} from 'react-treebeard';

// Example: Customising The Header Decorator To Include Icons
const outlineDecorator = {
  Loading: decorators.Loading,
  Toggle: decorators.Toggle,
  Container: decorators.Container,
  Header : ({style, node}) => {
    const iconStyle = {marginRight: '5px'};
  
    return (
        <div style={style.base}>
            <div style={style.title}>
                <i className={"icon-file wollok-"+node.extension} style={iconStyle}/>
                {node.name}
            </div>
        </div>
    );
  }
};

class OutlineComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tree: this.converASTToTree(this.props.ast, this.props.file)
    };
  }

  
  onToggle = (node, toggled) => {
    if(this.state.cursor){this.state.cursor.active = false;}
    node.active = true;
    if(node.children){
       node.toggled = toggled; 
    }else{
      this.props.onSelect(node.ast)
    }
    this.setState({ cursor: node }); 
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tree: this.converASTToTree(nextProps.file)
    });  
  } 

  converASTToTree(file){
    if(!file || !file.ast){
        return {}
    }

    var node = {
      name: file.name,
      toggled: true,
      ast:file.ast,
      extension: "file",
      children: file.ast.content.map( child=>{
        return {
          name: child.name,
          toggled: true,
          children: child.members.map(this.convertMembers),
          extension: "object",
          ast:child
        }
      })
    }
    return node
  }

  convertMembers = (ast) =>{
    switch(ast.type){
      case "Field": return {
        name: "var " + ast.variable.name.token,
        extension: "variable",
        ast:ast
      }
      case "Method": return {
        name: ast.name+"("+ ast.parameters.map(param=> param.name).join(",")+")",
        extension: "method",
        ast:ast
      }
    }
  }



  render() {
    return (
      <div  className="file-browser-tree">
        <Treebeard
          data={this.state.tree}
          decorators={outlineDecorator}
          onToggle={this.onToggle}
        />
      </div>
    );
  }
}


export default OutlineComponent;
