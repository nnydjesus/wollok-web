import React, { Component, PropTypes } from 'react';
import LoginComponent from './LoginComponent.jsx';
import { Snackbar } from 'react-toolbox/lib/snackbar';
import { connect } from 'react-redux';
import { logoutAndUpdate } from '../../actions/login.jsx';
import { Translate } from 'react-redux-i18n';

import theme from '../../../resources/theme.jsx';

class LogoutComponent extends Component {
    constructor(props) {
        super(props);
        this.currentTheme = theme.default;
        if (typeof window !== 'undefined' && window.__CONFIG__) {
            this.currentTheme = theme[window.__CONFIG__.theme];
        } else {
            this.currentTheme = theme[props.params.siteConfig.theme]
        }
        this.loginTheme = theme.default;
        if (typeof window !== 'undefined' && window.__CONFIG__) {
            this.loginTheme = theme[window.__CONFIG__.theme + "-login"];
        } else {
            this.loginTheme = theme[props.params.siteConfig.theme + "-login"]
        }
        this.appName = (typeof window !== "undefined" && window.__CONFIG__) ? window.__CONFIG__.appName : props.params.siteConfig.appName;
        this.showThanksSnackbar = true;
    }

    handleLogout = () => {
        this.props.dispatch(logoutAndUpdate);
    };

    hideSnackbar = () => {
        this.showThanksSnackbar = false;
        this.setState({});
    };

    componentDidMount() {
        this.handleLogout();
    };

    render() {
        return (
            <div className={this.currentTheme.layout}><div id="mask">
                <LoginComponent theme={this.loginTheme} {...this.props} />
                <Snackbar theme={this.currentTheme} className={this.showThanksSnackbar ? "top-snackbar active" : "top-snackbar"} active={this.showThanksSnackbar} timeout={3000} onTimeout={this.hideSnackbar}>
                    <Translate value="login.logoutThanks" appName={this.appName} />
                </Snackbar>
            </div></div>
        );
    }
}

LogoutComponent.propTypes = {
    dispatch: PropTypes.func
};

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(LogoutComponent);