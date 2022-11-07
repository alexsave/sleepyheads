/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { urlOpener } from './src/Utils/Browser';

Amplify.configure({...awsconfig,
  oauth: {
    ...awsconfig.oauth, urlOpener
  }
});

AppRegistry.registerComponent(appName, () => App);
