import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import fsReducer from './reducers/fileSystem.jsx';
import { loadTranslations, setLocale, syncTranslationWithStore, i18nReducer, I18n } from 'react-redux-i18n';

export const reduxStore = (initialState) => {
    const defaultSiteConfig = {...initialState.siteConfig };
    const siteConfigReducer = (state = defaultSiteConfig, action) => {
        switch (action.type) {
            default: return state;
        }
    };

    const translations = {
        
    };

    let store = createStore(combineReducers({
        siteConfig: siteConfigReducer,
        fs: fsReducer
        
    }), initialState, applyMiddleware(thunk));

    syncTranslationWithStore(store);
    const splitCamelCaseMissingTranslation = (key, replacements) => key.split('.').pop()
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[A-Z]/g, str => str.toLowerCase())
        .replace(/_/g, ' ')
        .replace(/\b./g, str => str.toUpperCase());
    I18n.setHandleMissingTranslation(splitCamelCaseMissingTranslation);
    // store.dispatch(loadTranslations(translations));
    // store.dispatch(setLocale(initialState.i18n.locale || 'en'));

    return store;
};