import React from 'react';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import IDEComponent from './components/ide/IDEComponent.jsx';
import AuthLayout from './components/login/AuthLayout.jsx';
import Login from './components/login/Login.jsx';
import {reduxStore} from './reduxStore';

import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/base.scss';


export const routes = (
    <Route path="/" >
        <Route path="login" component={Login}/>
        <IndexRoute component={IDEComponent}/>
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
