import React, { Component, PropTypes } from 'react';
import { Dialog } from 'react-toolbox/lib/dialog';
import { ProgressBar } from 'react-toolbox/lib/progress_bar';
import { Input } from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox/lib/button';
import { Snackbar } from 'react-toolbox/lib/snackbar';
import { startLoginAsync, startLogin, facebookLoginSuccessfulAsync, loginFailed, clearLogin } from '../../actions/login.jsx'
import { connect } from 'react-redux';
import { Translate, I18n } from 'react-redux-i18n';
import { validateField } from '../../../resources/validation.jsx';
import theme from '../../../resources/theme.jsx';

export class LoginComponent extends Component {
    constructor(props) {
        super(props);
        this.currentTheme = props.theme;
        this.reset(props, undefined, true);
    }

    reset(props, ev, isConstructor) {
        var newState = isConstructor ? { login: {
            username: "",
            password: "",
            showUsername: true,
            dirtyPassword: false
        } } : { login: this.state.login };
        newState.login.username = props.username || "";
        newState.login.password = props.password || "";
        newState.login.error = {
            label: props.errorLabel,
            show: props.showError
        };
        newState.login.inProgress = props.inProgress;
        newState.login.authToken = props.authToken;
        this.errorLabel = "";
        if (isConstructor) {
            this.state = newState;
        } else {
            this.setState(newState);
        }
        if (ev) {
            ev.preventDefault();
        }
    }

    componentDidMount() {
        this.reset(this.props);
    }

    handleLogin = () => {
        this.props.dispatch(startLoginAsync(this.state.login.username, this.state.login.password));
    };

    handleSnackbarClick = () => {
        var loginState = this.state.login;
        var errorState = loginState.error ? loginState.error : {};
        errorState.label = "";
        errorState.show = false;
        this.errorLabel = "";
        this.setState({ "login": loginState });
        this.props.dispatch(clearLogin());
    };

    handleFacebookLogin = (ev) => {
    };

    handleFacebookResponse = (fbResp) => {
    };

    enableEmailLogin = () => {
        this.handleSnackbarClick();
        var loginState = this.state.login;
        loginState.username = "";
        loginState.password = "";
        loginState.emailLogin = true;
        this.setState({ "login": loginState, "showPreviousUsers": false });
    };

    componentWillReceiveProps(newProps) {
        var loginState = this.state.login;
        var shouldChangeState = false;
        if (loginState.authToken !== newProps.authToken) {
            loginState.authToken = newProps.authToken;
            shouldChangeState = true;
        }
        if (loginState.inProgress !== newProps.inProgress) {
            loginState.inProgress = newProps.inProgress;
            shouldChangeState = true;
        }
        if (loginState.previousUsers !== newProps.previousUsers) {
            loginState.previousUsers = newProps.previousUsers;
            shouldChangeState = true;
        }
        var errorState = loginState.error ? loginState.error : {};
        if (errorState.show !== newProps.showError) {
            errorState.label = newProps.errorLabel;
            errorState.show = newProps.showError;
            loginState.error = errorState;
            shouldChangeState = true;
        }
        shouldChangeState && this.setState({ "login": loginState });
    }

    emailLoginHandler = (emailState, emailValidationErrors) => {
        if (emailState.back+"" === "true") {
            this.reset(this.props);
        } else {
            var loginState = this.state.login;
            if (emailValidationErrors.username === "") {
                loginState.username = emailState.username !== undefined ? emailState.username : loginState.username;
            } else {
                // loginState.username = "";
            }
            if (emailValidationErrors.password === "") {
                loginState.password = emailState.password !== undefined ? emailState.password : loginState.password;
            } else {
                // loginState.password = "";
            }
            var errorState = loginState.error ? loginState.error : {};
            errorState.label = "";
            errorState.show = false;
            this.errorLabel = "";
            this.setState({ "login": loginState });
        }
    };

    validationErrors = {
        "username": "",
        "password": ""
    };

    updateField = (field, value) => {
        var state = this.state.login;
        state[field] = value;
        if (field === "password") {
            state.dirtyPassword = true;
        }
        this.validationErrors[field] = "";
        this.emailLoginHandler(state, this.validationErrors);
        this.setState({login:state});
    };

    handleKeyPress = (ev) => {
        if (ev.key === 'Enter') {
            this.props.onLogin();
        }
    };

    disableEmailLogin = () => {
        this.emailLoginHandler({username: "", password: "", back: true});
        this.setState({username: "", password: "", showUsername: true, showEmailLogin: false});
    };

    validate = (field, value) => {
        this.validationErrors[field] = I18n.t(validateField("login", field, value));
        this.emailLoginHandler(this.state.login, this.validationErrors);
        this.setState({});
    };

    render() {
        var labels = {
            "username": I18n.t("login.username"),
            "password": I18n.t("login.password")
        };
        return (
            <div className={"login-container"}>
                <div className="login-panel">
                    <Input theme={this.state.theme} type="text" name="username" value={this.state.login.username} onChange={(value) => { this.updateField("username", value) }} onBlur={(ev) => { this.validate("username", ev.target.value) }} error={this.validationErrors.username} label={labels.username} disabled={this.state.loginInProgress}  />
                    <Input theme={this.state.theme} type="password" name="password" value={this.state.login.password} onChange={(value) => { this.updateField("password", value) }} onBlur={(ev) => { if (this.state.dirtyPassword || this.state.showUsername) { this.validate("password", ev.target.value) } }} error={this.validationErrors.password} onKeyPress={ this.handleKeyPress } label={labels.password}   />
                    <div className="buttons">
                        <Button label='Login' raised primary onClick={this.handleLogin}/>
                    </div>
                </div>
            </div>
        )
    }
}

LoginComponent.propTypes = {
    theme: PropTypes.object,
    username: PropTypes.string,
    password: PropTypes.string,
    inProgress: PropTypes.bool,
    errorLabel: PropTypes.string,
    showError: PropTypes.bool,
    authToken: PropTypes.string,
    previousUsers: PropTypes.array,
    dispatch: PropTypes.func
};

const mapStateToProps = (state) => {
    var loginState = state.login !== undefined ? state.login : {};
    var errorState = loginState.error !== undefined ? loginState.error : {};
    return {
        username: loginState.username,
        password: loginState.password,
        inProgress: loginState.inProgress,
        authToken: loginState.authToken,
        previousUsers: loginState.previousUsers,
        errorLabel: errorState.label,
        showError: errorState.show
    }
};

const mapDispatchToProps = (dispatch) => { return { dispatch } };

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);