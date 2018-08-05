import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { routes } from '../client/reactApp';
import { Provider } from 'react-redux';
import { reduxStore } from '../client/reduxStore';

export const handleRender = (req, res) => {
    var store = reduxStore(req.initialState);

    match({ routes, location: req.url }, (err, redirectLocation, props) => {
        if (err) {
            // TODO custom 500 view
            // something went badly wrong, so 500 with a message
            res.status(500).send(err.message);
        } else if (redirectLocation) {
            // we matched a ReactRouter redirect, so redirect from the server
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        } else if (props) {
            // if we got props, that means we found a valid component to render
            // for the given route
            const siteConfig = req.config.siteConfig;
            props.params.siteConfig = siteConfig;
            const html = renderToString(<Provider store={store}><RouterContext {...props} /></Provider>);

            // Grab the initial state from our Redux store
            const preloadedState = store.getState();

            // Get environment variables and store in model to render
            var environmentVariables;
            if (req.query.e1n2v3) {
                environmentVariables = JSON.stringify(process.env, null, 2)
            }

            // render index.ejs, but pass in the markup we want it to display and preloaded state
            res.render('index.ejs', { pageTitle: siteConfig.appName, pageIcon: siteConfig.icon, markup: html, preloadedState: JSON.stringify(preloadedState), siteConfig: JSON.stringify(siteConfig), environmentVariables });
        } else {
            // TODO custom 404 view
            // no route match, so 404
            res.sendStatus(404);
        }
    });
};