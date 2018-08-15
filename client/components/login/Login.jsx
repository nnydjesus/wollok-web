import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Input from '../library/Input.jsx';
import Modal from 'react-responsive-modal';
import { Button } from 'antd';
import SocialLogin from 'react-social-login'

const SocialButton = SocialLogin(({ children, triggerLogin, socialClass, onClick, ...props }) => (
    <li className={socialClass} onClick={onClick?onClick(triggerLogin):triggerLogin} >
        <a href="#"  {...props}>
            { children }
        </a>
  </li>
))

const locationUrl = (typeof window !== "undefined"? window.location.href:"");


import {
    startLogin,
    facebookLogin,
    googleLogin,
    githubLogin,
    loginFailed,
    hideLogin,
    startRegistration
} from '../../actions/login.jsx';

const errors = {
    authError: "El usuario o contraseña son inválidos",
    userAlreadyExist: "El emial ya existe.",
}

class Login extends Component {

    constructor(props){
        super(props)
        this.state = this.defaultState()
    }

    componentDidMount() {
        this.setState({
            fbAppId: (typeof window !== "undefined" && window.__CONFIG__ ? window.__CONFIG__.facebookAppId : this.props.params.siteConfig.facebookAppId),
            googleClientId: (typeof window !== "undefined" && window.__CONFIG__ ? window.__CONFIG__.googleClientId : this.props.params.siteConfig.googleClientId),
            githubClientId: (typeof window !== "undefined" && window.__CONFIG__ ? window.__CONFIG__.githubClientId : this.props.params.siteConfig.githubClientId)
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

    defaultState(){
        return {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            name:"",
            mode: "login",
            passwordError: undefined
        }
    }

    handleLogin = () => {
        this.props.dispatch(startLogin(this.state.email, this.state.password));
    };

    handleRegister = () => {
        if(this.state.password == this.state.confirmPassword){
            this.props.dispatch(startRegistration(this.state.email, this.state.password, this.state.name));
        }else{
            this.setState({passwordError:"Las contraseñas no coinciden"})
        }
        
    };

    handleFacebookLogin = (ev) => {
        // this.props.dispatch(startLogin(this.state.username, this.state.password));
        this.refs.facebookLoginButton.click(ev);
    };

    handleGithubLogin = (ev) => {
        this.refs.githubLoginButton.click(ev);
    };

    handleFacebookResponse = (fbResp) => {
        if (fbResp.token) {
            this.props.dispatch(facebookLogin(fbResp));
        } else {
            this.props.dispatch(loginFailed({ id: "login.facebookLoginError", fbResp }));
        }
    };

    onGoogleSuccess = (response) => {
        this.props.dispatch(googleLogin(response));
    }

    onGithubClick = (triggerLogin) => (event)=> {
        if(this.props.project){
            localStorage.setItem("project", JSON.stringify(this.props.project))
        }
        triggerLogin(event)
    }

    onGoogleFailure = (response) => {
        
    }

    onClose = () =>{
        this.props.dispatch(hideLogin())
        this.setState(this.defaultState())
    }

    changeMode = (mode) => () =>{
        var newMode = this.defaultState()
        newMode.mode =  mode
        this.setState(newMode)
    }

    loginContent(){
        return (
            <div>
                <h2>Ingresar</h2>
                <div>
                    <Input type="text" field="email" placeholder="E-mail" onChange={this.updateField('email')} value={this.state.email || ''}  focus={true}  className=""/>
                    <Input type="password" field="password" onChange={this.updateField('password')} onEnter={this.handleLogin} placeholder="Contraseña" value={this.state.password || ''}  className=""/>

                      {
                        this.props.error && this.props.error.show &&
                        <div className="error">
                            <span>{errors[this.props.error.label]? errors[this.props.error.label]: this.props.error.label}</span>
                        </div>
                    }

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
                    <Input type="email" field="email" placeholder="E-mail" onChange={this.updateField('email')} value={this.state.email || ''}  focus={true}  className=""/>
                    <Input type="text" field="name" placeholder="Nombre" onChange={this.updateField('name')} value={this.state.name || ''}    className=""/>
                    <Input type="password" field="password" onChange={this.updateField('password')}  placeholder="Contraseña" value={this.state.password || ''}  className=""/>
                    <Input type="password" field="confirmPassword" onChange={this.updateField('confirmPassword')} onEnter={this.handleRegister} placeholder="Contraseña" value={this.state.confirmPassword || ''}  error={this.state.passwordError}  className=""/>
                  
                    {
                        this.props.error && this.props.error.show &&
                        <div className="error">
                            <i></i>
                            <span>{errors[this.props.error.label]? errors[this.props.error.label]: this.props.error.label}</span>
                        </div>
                    }

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

                        <SocialButton
                            provider='facebook'
                            socialClass="facebook"
                            appId={this.state.fbAppId}
                            onLoginSuccess={this.handleFacebookResponse}
                            onLoginFailure={this.onGoogleFailure}
                        >
                            <img className="socialImage" src="/public/images/fb.png" alt=""/>
                        </SocialButton>

                        <SocialButton
                            provider='google'
                            socialClass="google"
                            appId={this.state.googleClientId}
                            onLoginSuccess={this.onGoogleSuccess}
                            onLoginFailure={this.onGoogleFailure}
                        >
                            <img  className="socialImage" src="/public/images/google.png" alt=""/>
                        </SocialButton>

                        <SocialButton
                            provider='github'
                            socialClass="github"
                            redirect={locationUrl}
                            gatekeeper="gatekeeper"
                            appId={this.state.githubClientId}
                            onClick={this.onGithubClick}
                            onLoginFailure={this.onGoogleFailure}
                        >
                            <img  className="socialImage" src="/public/images/github-logo.svg" alt=""/>
                        </SocialButton>
                        
                        
                        <li className="twitter" onClick={ this.handleGithubLogin }><a href="#"><img  className="socialImage" src="/public/images/fb.png" alt=""/></a></li>
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
}

Login.propTypes = {
    params: PropTypes.object
};

const mapStateToProps = (globalState) => {
    return {
        inProgress: globalState.login.inProgress,
        authToken: globalState.login.authToken,
        error: globalState.login.error,
        show: globalState.login.showLogin,
        project: globalState.fs.project
    }
};

export default connect(mapStateToProps)(Login);