/**
 * @format
 */

import { AppRegistry, YellowBox } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { AxiosDefaultsManager } from './src/axios/default';
// if (__DEV__) {
//     YellowBox.ignoreWarnings([
//         'VirtualizedLists should never be nested',
//         'Warning: AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from \'@react-native-community/async-storage\' instead of \'react-native\'. See https://github.com/react-native-community/react-native-async-storage',
//         'Warning: componentWillReceiveProps has been renamed, and is not recommended for use. See https://fb.me/react-async-component-lifecycle-hooks for details.',
//         'Warning: componentWillReceiveProps is deprecated',
//         'Module RCTImageLoader requires',
//         'Animated: `useNativeDriver`'
//     ]);
// }

AppRegistry.registerComponent(appName, () => App);
