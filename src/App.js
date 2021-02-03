import AsyncStorage from '@react-native-community/async-storage';
import { Root } from "native-base";
import React, { useEffect } from 'react';
import 'react-native-gesture-handler'; //do not remove this line else app will get crash while using drawer in release mode due to gesture handling 
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/es/integration/react'
import { onLogin } from './actions/auth';
import AppContainer from './AppContainer';
import { store, persistor } from "./store";
import OneSignal from 'react-native-onesignal';
import { OneSignalAppId } from '../env';
import { BackHandler, Platform } from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import * as Sentry from "@sentry/react-native";
const App = () => {

  useEffect(() => {
    // store.dispatch(loadUser())
    const initialFunction = async () => {
      if (Platform.OS == "ios") {
        PushNotificationIOS.requestPermissions()
      }
      let userDetails = await AsyncStorage.getItem('userDetails');
      let parsedUserDetails = await JSON.parse(userDetails);
      if (parsedUserDetails !== null) {
        store.dispatch(onLogin(parsedUserDetails))
      }
    }
    initialFunction()

    Sentry.init({
      dsn: "https://3fe28747315644a6adfe8787746b7923@o515547.ingest.sentry.io/5621805",
    });

  }, [])

  useEffect(() => {
    OneSignal.setLogLevel(6, 0);

    // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
    OneSignal.init(OneSignalAppId, { kOSSettingsKeyAutoPrompt: false, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption: 2 });
    OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
  }, [])


  return (
    <Root>
      <PaperProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppContainer />
          </PersistGate>
        </Provider>
      </PaperProvider>
    </Root>
  );
}

export default App;
