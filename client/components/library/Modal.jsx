import React, { Component } from 'react';
import RModal from 'react-responsive-modal';

class Modal extends Component {

    render() {
        return (
            <RModal open={this.props.visible} onClose={this.props.onClose} center classNames={ {modal:"modalContainer", closeButton: "close"} } >    
                <div className="ant-modal-content">
                    <button aria-label="Close" className="ant-modal-close" onClick={this.props.onClose}>
                        <span className="ant-modal-close-x"></span>
                    </button>
                    
                    <div className="ant-modal-header">
                        <div className="ant-modal-title" id="rcDialogTitle0">{this.props.title}</div>
                    </div>
                    
                    <div className="ant-modal-body">
                        {this.props.children}
                        
                    </div>
                    
                    <div className="ant-modal-footer">
                        <div>
                            <button type="button" className="ant-btn" onClick={this.props.onClose} ><span>Cancel</span></button>
                            <button type="button" className="ant-btn ant-btn-primary" onClick={this.props.onOk}><span>OK</span></button>
                        </div>
                    </div>
                </div>
            </RModal>
        );
    }

}

export default Modal;