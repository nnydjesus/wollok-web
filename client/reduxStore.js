import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { loadTranslations, setLocale, syncTranslationWithStore, i18nReducer } from 'react-redux-i18n';
import loginReducer from './reducers/login.jsx';
import forgotPasswordReducer from './reducers/forgotPassword.jsx';
import translations from '../resources/translation.json';

export const reduxStore = (initialState) => {
    const defaultSiteConfig = Object.assign({}, initialState.siteConfig);
    const siteConfigReducer = (state = defaultSiteConfig, action) => {
        switch (action.type) {
            default:
                return state;
        }
    };
    let store = createStore(combineReducers(
        {
            siteConfig: siteConfigReducer,
            login: loginReducer,
            forgotPassword: forgotPasswordReducer,
            i18n: i18nReducer
        }
    ), initialState, applyMiddleware(thunk));

    syncTranslationWithStore(store);
    store.dispatch(loadTranslations(translations));
    store.dispatch(setLocale(initialState.i18n.locale || 'en'));

    return store;
};