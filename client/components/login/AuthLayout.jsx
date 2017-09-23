import React, { Component, PropTypes } from 'react';
import { Layout } from 'react-toolbox/lib/layout';
import LoginComponent from './LoginComponent.jsx';
import { connect } from 'react-redux';
import { setLocale } from 'react-redux-i18n';
import theme from '../../../resources/theme.jsx';

import lodash from 'lodash';

class AuthLayout extends Component {
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
        this.renderLogin = this.loginRequired();
        this.state = { locale: props.locale };
    }

    loginRequired() {
        var router = this.props.router;
        if (!(router.isActive('/login') || router.isActive('/logout') || router.isActive('/forgotpassword'))) {
            if (typeof this.props.authToken === "undefined" || this.props.authToken === "") {
                return false;
            }
        }
        return false;
    }

    componentDidMount() {
        var locale = lodash.find(this.props.userData.preferences, { key: 'dashboard-locale' });
        if(locale) {
            locale = locale.value;
        } else if (typeof window !== 'undefined' && window.__CONFIG__) {
            locale = window.__CONFIG__.locale || "en";
        } else {
            locale = this.props.params.siteConfig.locale || "en";
        }
        this.props.dispatch(setLocale(locale));
    }

    componentDidUpdate(prevProps) {
        if (this.props.authToken !== "" && this.props.authToken !== prevProps.authToken) {
            var router = this.props.router;
            if (router.isActive('/login') || router.isActive('/logout')) {
                if (typeof window !== "undefined" && window.location.search.indexOf("redirect=") !== -1) {
                    var redirectParam = window.location.search.split("redirect=")[1].split("&")[0];
                    if (redirectParam) {
                        router.push(redirectParam);
                        return;
                    }
                }
                router.push('/app/ide');
            }
        }
    }

    render() {
        this.renderLogin = this.loginRequired();
        return (
            <Layout theme={this.currentTheme}>
                <div id="mask">
                    {this.renderLogin && <LoginComponent theme={this.loginTheme} {...this.props} /> || <div id="container">{this.props.children}</div>}
                </div>
            </Layout>
        );
    }
}

AuthLayout.propTypes = {
    authToken: PropTypes.string,
    locale: PropTypes.string,
    router: PropTypes.object,
    dispatch: PropTypes.func
};

const mapStateToProps = (state) => {
    var loginState = state.login !== undefined ? state.login : {};
    var i18nState = state.i18n !== undefined ? state.i18n : {};
    return {
        authToken: loginState.authToken,
        locale: i18nState.locale,
        userData: loginState.userData
    }
};

const mapDispatchToProps = (dispatch) => {
    return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthLayout);