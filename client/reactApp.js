import React from 'react';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import AuthLayout from './components/login/AuthLayout.jsx';
import LogoutComponent from './components/login/LogoutComponent.jsx';
import LoginComponent from './components/login/LoginComponent.jsx';
import ForgotPasswordComponent from './components/login/ForgotPasswordComponent.jsx';
import MainLayout from './components/dashboard/MainLayout.jsx';
import IDEComponent from './components/app/ide/IDEComponent.jsx';
import AppLayout from './components/app/AppLayout.jsx';
import Error404Component from './components/app/Error404Component.jsx';
import {reduxStore} from './reduxStore';

import './styles/base.scss';

export const routes = (
    <Route path="/" component={AuthLayout}>
        <IndexRoute component={MainLayout}/>
        <Route path="logout" component={LogoutComponent}/>
        <Route path="login" component={LoginComponent}/>
        <Route path="forgotpassword" component={ForgotPasswordComponent}/>
        <Route path="app" component={AppLayout}>
            <Route path="ide" component={IDEComponent}/>
            <IndexRoute component={Error404Component}/>
        </Route>
        <Route path="*" component={LoginComponent}/>
    </Route> 
);

export const reactApp = () => {
    const initialState = window.__PRELOADED_STATE__ || { i18n: {} };
    const store = reduxStore(initialState);

    return (<Provider store={store}>
        <Router history={browserHistory}>
            {routes}
        </Router>
    </Provider>);
};
