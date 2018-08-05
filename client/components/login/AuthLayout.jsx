import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Login from './Login.jsx';
import { connect } from 'react-redux';

class AuthLayout extends Component {

    loginRequired() {
        let router = this.props.router;
        if (!router.isActive('/login') && !router.isActive('/forgotpassword')) {
            if (!this.props.authToken) {
                return true;
            }
        }
        return false;
    }


    componentDidUpdate(prevProps) {
        if (this.props.authToken !== "" && this.props.authToken !== prevProps.authToken) {
            var router = this.props.router;
            if (router.isActive('/login')) {
                if (typeof window !== "undefined" && window.location.search.indexOf("redirect=") !== -1) {
                    var redirectParam = window.location.search.split("redirect=")[1].split("&")[0];
                    if (redirectParam) {
                        router.push(redirectParam);
                        return;
                    }
                }
                router.push('/');
            }
        }
    }

    render() {
        return (
            this.loginRequired() && <Login params={this.props.params} /> || <div id="container" >{React.cloneElement(this.props.children, { router: this.props.router, params: this.props.params })}</div>
        );
    }
}

AuthLayout.propTypes = {
    authToken: PropTypes.string,
    locale: PropTypes.string,
    router: PropTypes.object,
    params: PropTypes.object,
    dispatch: PropTypes.func
};

const mapStateToProps = (state) => {
    var loginState = state.login !== undefined ? state.login : {};
    return {
        authToken: loginState.authToken,
        userData: loginState.userData
    }
};

export default connect(mapStateToProps)(AuthLayout);