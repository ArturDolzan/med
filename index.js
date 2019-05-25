import React from 'react'
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './src/Navigator'
import {Provider} from 'react-redux'
import storeConfig from './src/store/storeConfig.js';

const store = storeConfig()
const Redux = () => (
    <Provider store={store}>
        <App>

        </App>
    </Provider>
)

AppRegistry.registerComponent(appName, () => Redux);
