/**
 * @format
 */

// Must be imported first, before anything else, per react-native-gesture-handler setup docs.
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
