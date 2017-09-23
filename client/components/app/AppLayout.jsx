import React, { Component, PropTypes } from 'react';
import { NavDrawer } from 'react-toolbox/lib/layout';
import { Navigation } from 'react-toolbox/lib/navigation';
import { Panel } from 'react-toolbox/lib/layout';
import { AppBar } from 'react-toolbox/lib/app_bar';
import { IconButton } from 'react-toolbox/lib/button';
import { Menu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import { Translate, I18n } from 'react-redux-i18n';
import App from './App.jsx';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Icon from '../util/Icon.jsx';
import theme from '../../../resources/theme.jsx';

class AppLayout extends Component {
    constructor(props) {
        super(props);
        this.currentTheme = theme.default;
        if (typeof window !== 'undefined' && window.__CONFIG__) {
            this.currentTheme = theme[window.__CONFIG__.theme];
        } else {
            this.currentTheme = theme[props.params.siteConfig.theme]
        }
        this.logoImage = (typeof window !== "undefined" && window.__CONFIG__) ? window.__CONFIG__.logo : props.params.siteConfig.logo;
        this.state = {
            userMenuActive: false
        };
    }


    toggleUserMenu = () => { this.setState({ userMenuActive: !this.state.userMenuActive }) };

    showAvatar = () => {
        if (this.props.userPicture !== "") {
            return (<div className="user-picture" style={{ backgroundImage: "url('" + this.props.userPicture + "')" }}></div>);
        } else {
            return (<div className="user-picture"><i className="material-icons md-36">account_circle</i></div>);
        }
    };

    handleLogout = (ev) => { this.props.router.push('/logout'); ev.preventDefault(); };

    render() {
        var labels = {
            logout: I18n.t("app.logout")
        };
        return (
            <div className="app-layout">
                <Panel theme={this.currentTheme}>
                    <div className="content">
                        <App theme={this.props.theme} router={this.props.router} name="wollok" >
                            {React.cloneElement(this.props.children, { theme: this.currentTheme, authToken: this.props.authToken })}
                        </App>
                    </div>
                </Panel>
            </div>
        );
    }
}

AppLayout.propTypes = {
    authToken: PropTypes.string,
    userIdentity: PropTypes.string,
    userPicture: PropTypes.string
};

const mapStateToProps = (state) => {
    return {
        authToken: state.login.authToken,
        userIdentity: state.login.userIdentity,
        userPicture: state.login.userPicture
    };
};

const mapDispatchToProps = (dispatch) => {
    return { dispatch };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppLayout);