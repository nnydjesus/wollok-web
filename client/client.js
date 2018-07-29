import React from 'react';
import { hydrate, render } from 'react-dom';
import { reactApp } from './reactApp';

((typeof process !== "undefined" && process.env && process.env.SSR_MODE === 'true') ? hydrate : render)(reactApp(), document.getElementById('contentRoot'));