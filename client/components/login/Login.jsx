import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Input from '../library/Input.jsx';
import { I18n } from 'react-redux-i18n';
import Modal from 'react-responsive-modal';
import FacebookLogin from 'react-facebook-login';
import { Button } from 'antd';



import {
    startLogin,
    facebookLoginSuccessfulAsync,
    loginFailed,
    hideLogin,
    startRegistration
} from '../../actions/login.jsx';

class Login extends Component {

    state = {
        username: "",
        password: "",
        mode: "login",
        passwordError: undefined
    }

    componentDidMount() {
        this.setState({
            fbAppId: (typeof window !== "undefined" && window.__CONFIG__ ? window.__CONFIG__.facebookAppId : this.props.params.siteConfig.facebookAppId)
        });
        setTimeout(() => {
            this.setState({
                noAnim: true
            });
        }, 3000);
    }

    updateField = (field) => (value) => {
        this.setState({[field]:value})
    };

    handleLogin = () => {
        this.props.dispatch(startLogin(this.state.username, this.state.password));
    };

    handleRegister = () => {
        if(this.state.password == this.state.confirmPassword){
            this.props.dispatch(startRegistration(this.state.username, this.state.password));
        }else{
            this.setState({passwordError:"Las contraseñas no coinciden"})
        }
        
    };

    handleFacebookLogin = (ev) => {
        // this.props.dispatch(startLogin(this.state.username, this.state.password));
        this.refs.facebookLoginButton.click(ev);
    };


    handleFacebookResponse = (fbResp) => {
        if (fbResp.accessToken) {
            this.props.dispatch(facebookLoginSuccessfulAsync(fbResp));
        } else {
            this.props.dispatch(loginFailed({ id: "login.facebookLoginError", fbResp }));
        }
    };


    onClose = () =>{
        this.props.dispatch(hideLogin())
    }

    changeMode = (mode) => () =>{
        this.setState({mode: mode})
    }

    loginContent(){
        return (
            <div>
                <h2>Ingresar</h2>
                <div>
                    <Input type="text" field="username" placeholder="E-mail" onChange={this.updateField('username')} value={this.state.username || ''}  focus={true}  className=""/>
                    <Input type="password" field="password" onChange={this.updateField('password')} onEnter={this.handleLogin} placeholder="Contraseña" value={this.state.password || ''}  className=""/>

                    <div className="button-row">
                        <Button
                            id="loginLink"
                            type="primary"
                            loading={this.props.inProgress}
                            className="sign-in"
                            onClick={ this.handleLogin }>
                            Ingresar
                        </Button>
                        <div className="clear"></div>
                    </div>
                </div>
                <h3>No tenes una cuenta? <a href="#" onClick={this.changeMode("register")}>Registrate</a></h3>
            </div>
        )
    }

    registerContent(){
        return (
            <div >
                <h2>Registrate</h2>
                <div>
                    <Input type="text" field="username" placeholder="E-mail" onChange={this.updateField('username')} value={this.state.username || ''}  focus={true}  className=""/>
                    <Input type="password" field="password" onChange={this.updateField('password')}  placeholder="Contraseña" value={this.state.password || ''}  className=""/>
                    <Input type="password" field="confirmPassword" onChange={this.updateField('confirmPassword')} onEnter={this.handleRegister} placeholder="Contraseña" value={this.state.confirmPassword || ''}  error={this.state.passwordError}  className=""/>

                    <div className="button-row">
                        <Button
                            id="loginLink"
                            type="primary"
                            loading={this.props.inProgress}
                            className="sign-in"
                            onClick={ this.handleRegister }>
                            Registrarse
                        </Button>
                        <div className="clear"></div>
                    </div>
                </div>
                <h3>Ya tenes una cuenta? <a  href="#" onClick={this.changeMode("login")} >Ingresa</a></h3>
            </div>
        )
    }

    render(){
        return (
            <Modal open={this.props.show} onClose={this.onClose} center classNames={ {modal:"modalContainer", closeButton: "close"} }  >    
                <div className="log">
                    <div className="social w3ls animated fadeInDown delay05">
                        <li className="f"> <a href="#"><img src="/public/images/fb.png" alt=""/></a> </li>
                        <li className="t"><a href="#"><img src="/public/images/fb.png" alt=""/></a></li>
                        <li className="p"><a href="#"><img src="/public/images/fb.png" alt=""/></a></li>
                        <li className="i"><a href="#"><img src="/public/images/fb.png" alt=""/></a></li>
                        <div className="clear"></div>
                    </div>
                    <div className="content1 agileits animated fadeInUp delay1">
                        {this.state.mode == "login" && this.loginContent()}
                        {this.state.mode == "register" && this.registerContent()}
                    </div>
                </div>
            </Modal>
        )
    }

    render2() {
        return (
            <Modal open={this.props.show} onClose={this.onClose} center classNames={ {modal:"modalContainer", closeButton: "close"} }  >    
                <div className="launcher">
                    <div className="bg-login">
                        <div className="login-container">
                            <div>
                                <div className="brand">
                                    <img src="/public/wolloklogo.png" className="animated fadeInDown delay05" alt="Wollok" />
                                </div>
                                <div className="box animated ">
                                    {
                                        this.props.error && this.props.error.show &&
                                        <div className="error">
                                            <i></i>
                                            <span>{I18n.t(this.props.error.label, { username: this.props.username })}</span>
                                        </div>
                                    }
                                     
                                        <Input type="text" field="username" className="form-control" placeholder="E-mail" onChange={this.updateField('username')} value={this.state.username || ''}  label="Username"/>
                                        <Input type="password" field="password" onChange={this.updateField('password')} onKeyPress={this.handleKeyPress} className="form-control" placeholder="Contraseña" value={this.props.state || ''} label="Password"/>
                                    

                                        <Button
                                            id="loginLink"
                                            type="primary"
                                            loading={this.props.inProgress}
                                            className="btn btn-default btn-block"
                                            onClick={ this.handleLogin }>
                                            Ingresar
                                        </Button>

                                    
                                    {
                                        this.state.fbAppId && !this.props.inProgress && false &&
                                        <FacebookLogin ref="facebookLoginButton"
                                            appId={this.state.fbAppId}
                                            autoLoad={false}
                                            fields="name,email,picture"
                                            scope="public_profile,email"
                                            callback={this.handleFacebookResponse}
                                            disableMobileRedirect={true}/>
                                    }
                                    
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

Login.propTypes = {
    params: PropTypes.object
};

const mapStateToProps = (globalState) => {
    return {
        inProgress: globalState.login.inProgress,
        authToken: globalState.login.authToken,
        error: globalState.login.error,
        show: globalState.login.showLogin
    }
};

export default connect(mapStateToProps)(Login);