import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom'
import {connect} from 'react-redux';
import {Treebeard, decorators} from 'react-treebeard';
import treebeardStyle from './treebeardStyle'

class OutlineComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tree: this.converASTToTree(this.props.ast, this.props.file)
    };

    this.outlineDecorator = {
      Loading: decorators.Loading,
      Toggle: decorators.Toggle,
      Container: decorators.Container,
      Header : ({style, node}) => {
        const iconStyle = {marginRight: '5px'};
      
        return (
            <div style={style.base} >
                <div style={style.title} className="outline_node" onClick={this.onSelectNode(node)}>
                    <i className={"icon-file wollok-"+node.type} style={iconStyle}/>
                    {node.name}
                </div>
            </div>
        );
      }
    };
  }

  onSelectNode = (node) => (event)=>{
    // event.stopPropagation()
    // event.nativeEvent.stopImmediatePropagation()
    this.clickOnText = true
    this.props.onSelect(node.ast)
  }

  
  onToggle = (node, toggled) => {
    if(this.state.cursor){this.state.cursor.active = false;}
    node.active = true;

    if(!this.clickOnText && node.children){
       node.toggled = toggled; 
    }
    this.clickOnText = false
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
      type: "file",
      children: file.ast.content.map( child=>{
        switch(child.type){
          case "Program": return {
            name: child.name || child.description.value,
            toggled: true,
            children: child.sentences.sentences.map(this.convertMembers),
            type: "program",
            ast:child
          }
          case "Singleton": return {
            name: child.name,
            toggled: true,
            children: child.members.filter(ast=> ast.type != "Constructor").map(this.convertMembers),
            type: "object",
            ast:child
          }
          case "Class": return {
            name: child.name,
            toggled: true,
            children: child.members.filter(ast=> ast.type != "Constructor").map(this.convertMembers),
            type: "class",
            ast:child
          }

          case "Test": return {
            name: child.name || child.description.value,
            toggled: true,
            children: child.sentences.sentences.map(this.convertMembers),
            type: "test",
            ast:child
          }

          case "Import": return {
            name: child.target,
            toggled: true,
            type: "import",
            ast:child
          }

        }
      })
    }
    return node
  }



  convertMembers = (ast) =>{
    switch(ast.type){
      case "Field": return {
        name: "var " + ast.variable.name.token,
        type: "variable",
        ast:ast
      }
      case "Method": return {
        name: ast.name+"("+ ast.parameters.map(param=> this.parameterName(param)).join(",")+")",
        type: "method",
        ast:ast
      }
      case "Send": return {
        name: ast.key+"("+ ast.parameters.map(param=> this.parameterName(param)).join(",")+")",
        type: "message",
        ast:ast
      }
      case "VariableDeclaration": return {
        name: ast.variable.name.token,
        type: "variable",
        ast:ast
      }

      case "Reference": return {
        name: ast.name.type == "Link"? ast.name.token: ast.name ,
        type: "variable",
        ast:ast
      }
    }
  }

  parameterName(param){
    switch(param.type){
      case "Reference": return param.name.type == "Link"? param.name.token : param.name 
      case "Literal": return param.value 
      case "Send": return param.key+"("+ param.parameters.map(param=> this.parameterName(param)).join(",")+")"
    }
  }



  render() {
    return (
      <div  className="outline">
        <Treebeard
          data={this.state.tree}
          decorators={this.outlineDecorator}
          onToggle={this.onToggle}
          style ={treebeardStyle}
        />
      </div>
    );
  }
}


export default OutlineComponent;
