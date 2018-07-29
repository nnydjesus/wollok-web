import React from 'react';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';
import IDEComponent from './components/ide/IDEComponent.jsx';
import {reduxStore} from './reduxStore';

import './styles/base.scss';
import 'antd/dist/antd.css';

export const routes = (
    <Route path="/" >
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
