/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { urlOpener } from './src/Utils/Browser';
import 'react-native-get-random-values';

//Auth.configure({authenticationFlowType: 'USER_SRP_AUTH'})
Amplify.configure({...awsconfig,
  //Auth: {
    //...awsconfig.Auth, authenticationFlowType: 'CUSTOM_AUTH',
  //},
  oauth: {
    ...awsconfig.oauth, urlOpener
  },
  authenticationFlowType: 'CUSTOM_AUTH',
});

AppRegistry.registerComponent(appName, () => App);
