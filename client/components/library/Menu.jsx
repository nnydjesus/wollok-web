import React, {Component} from 'react';
import { Menu as MenuComponent, Icon, Tooltip} from 'antd';

const SubMenu = MenuComponent.SubMenu;

class Menu extends Component {
  constructor(props) {
    super(props);
  }

  createMenuItem(item){
    if(item.items){
      return this.createSubMenu(item)
    }else{
      return (
        <MenuComponent.Item key={item.key}  onClick={item.onClick} disabled={item.disabled!=undefined? item.disabled : false}>
            {item.content}
        </MenuComponent.Item>
      )
    }
  }

  createSubMenu(data){
    return (
      <SubMenu key={data.key} title={data.title} disabled={data.disabled!=undefined? data.disabled : false }>
        {data.items.map(item=> this.createMenuItem(item) ) }
      </SubMenu>
    )
  }

  render() {
    return (
        <MenuComponent mode={this.props.mode}>
            { this.props.items.map(item=> this.createMenuItem(item)) }
        </MenuComponent>
    );
  }
}

Menu.propTypes = {
};

export default Menu;

