import React, { Component, PropTypes } from 'react';
import { Dialog } from 'react-toolbox/lib/dialog';
import { Input } from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox/lib/button';
import { ProgressBar } from 'react-toolbox/lib/progress_bar';
import { Translate, I18n, setLocale } from 'react-redux-i18n';
import { validateField } from '../../../resources/validation.jsx';
import { connect } from 'react-redux';
import { forgotPasswordAsync, clearForgotPassword } from '../../actions/forgotPassword.jsx';
import { Link } from 'react-router';

import theme from '../../../resources/theme.jsx';

class ForgotPasswordComponent extends Component {
    constructor(props) {
        super(props);
        this.currentTheme = theme.default;
        if (typeof window !== 'undefined' && window.__CONFIG__) {
            this.currentTheme = theme[window.__CONFIG__.theme + "-login"];
        } else {
            this.currentTheme = theme[this.props.params.siteConfig.theme + "-login"]
        }
        this.logoImage = (typeof window !== "undefined" && window.__CONFIG__) ? window.__CONFIG__.darkBackgroundLogo : props.params.siteConfig.darkBackgroundLogo;
        this.state = {
            forgotPassword: {
                email: props.email || "",
                error: props.error || {},
                inProgress: false,
                finished: false
            },
            validationErrors: {
                email: ""
            },
            locale: props.locale
        };
    }

    componentWillMount() {
        this.props.dispatch(setLocale(this.state.locale));
    }

    updateField = (field, value) => {
        var forgotPasswordState = this.state.forgotPassword;
        forgotPasswordState[field] = value;
        this.validate(field, value);
        this.setState({ "forgotPassword": forgotPasswordState });
    };

    validate = (field, value) => {
        var validationErrorsState = this.state.validationErrors;
        validationErrorsState[field] = I18n.t(validateField("forgotPassword", field, value));
        this.setState({ "validationErrors": validationErrorsState });
    };

    forgotPassword = () => {
        if (this.state.validationErrors.email === "") {
            this.props.dispatch(forgotPasswordAsync(this.state.forgotPassword.email));
        }
    };

    reset = () => {
        this.props.dispatch(clearForgotPassword());
    };

    componentWillReceiveProps(newProps) {
        var forgotPasswordState = this.state.forgotPassword;
        var shouldChangeState = false;
        if (forgotPasswordState.inProgress !== newProps.inProgress) {
            forgotPasswordState.inProgress = newProps.inProgress;
            shouldChangeState = true;
        }
        if (forgotPasswordState.finished !== newProps.finished) {
            forgotPasswordState.finished = newProps.finished;
            shouldChangeState = true;
        }
        var errorState = forgotPasswordState.error ? forgotPasswordState.error : {};
        var newErrorProps = newProps.error || {};
        if (errorState.show !== newErrorProps.show) {
            errorState.label = newErrorProps.label;
            errorState.show = newErrorProps.show;
            forgotPasswordState.error = errorState;
            shouldChangeState = true;
        }
        shouldChangeState && this.setState({ "forgotPassword": forgotPasswordState });
    }

    render() {
        var labels = {
            "email": I18n.t("forgotPassword.yourEmail")
        };
        var buttonDisabled = this.state.forgotPassword.inProgress || this.state.forgotPassword.email === "" || this.state.validationErrors.email !== "";
        var finished = !this.state.forgotPassword.inProgress && this.state.forgotPassword.finished;
        return (
            <Dialog theme={this.currentTheme} active={true}>
                <div className="logo" style={ this.logoImage ? { backgroundImage: "url(" + this.logoImage + ")" } : {} }></div>
                <h1><Translate value="forgotPassword.passwordLost" /></h1>
                <div className="reduced-width show">
                    {finished || <Input theme={this.currentTheme} type="text" name="email" value={this.state.forgotPassword.email} onChange={(value) => { this.updateField("email", value) }} onBlur={(ev) => { this.validate("email", ev.target.value) }} error={this.state.validationErrors.email} label={labels.email} />}
                    {this.state.forgotPassword.inProgress && <div className="center"><ProgressBar type="linear" mode="indeterminate" multicolor className="center" /></div>}
                    {finished || <div className="buttons">
                        <Button theme={this.currentTheme} onClick={this.forgotPassword} disabled={buttonDisabled} className="send-my-request" raised>
                            <Translate value="forgotPassword.sendMyRequestButton" />
                        </Button>
                    </div>}
                    {finished && <div className="success">
                        {
                            (this.state.forgotPassword.error.label === "") ? (<div>
                                <p><Translate value="forgotPassword.successLine1" email={this.state.forgotPassword.email}/></p>
                                <p><Translate value="forgotPassword.successLine2" /></p>
                            </div>) : (<div>
                                <p><Translate value={"" + this.state.forgotPassword.error.label} email={this.state.forgotPassword.email}/></p>
                            </div>)
                        }
                    </div>}
                    <div className="link"><Link to={"/login"} onClick={this.reset}><Translate value="forgotPassword.backToLogin" /></Link></div>
                </div>
            </Dialog>
        );
    }
}

ForgotPasswordComponent.propTypes = {
    email: PropTypes.string,
    error: PropTypes.object,
    inProgress: PropTypes.bool,
    finished: PropTypes.bool,
    dispatch: PropTypes.func
};

const mapStateToProps = (state) => {
    var forgotPasswordState = state.forgotPassword !== undefined ? state.forgotPassword : {};
    var errorState = forgotPasswordState.error !== undefined ? forgotPasswordState.error : {};
    var i18nState = state.i18n !== undefined ? state.i18n : {};
    return {
        email: forgotPasswordState.email,
        error: {
            label: errorState.label || "",
            show: errorState.show || false
        },
        inProgress: forgotPasswordState.inProgress,
        finished: forgotPasswordState.finished,
        locale: i18nState.locale
    }
};

const mapDispatchToProps = (dispatch) => {
    return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordComponent);