/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Amplify } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import 'react-native-get-random-values';

// Amplify v6 parses the Gen 1 aws-exports object directly. The custom auth
// flow type is no longer a global setting; it is passed per call via
// signIn({ options: { authFlowType: 'CUSTOM_WITHOUT_SRP' } }) in Network/Login.js.
// NOTE: if Hosted UI / social sign-in is used, the v4 oauth.urlOpener override
// must be re-wired using v6's signInWithRedirect (see Utils/Browser.js).
Amplify.configure(awsconfig);

AppRegistry.registerComponent(appName, () => App);
