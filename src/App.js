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
const App = () => {
  useEffect(() => {
    // store.dispatch(loadUser())
    const initialFunction = async () => {
      let userDetails = await AsyncStorage.getItem('userDetails');
      let parsedUserDetails = await JSON.parse(userDetails);
      if (parsedUserDetails !== null) {
        store.dispatch(onLogin(parsedUserDetails))
      }
    }
    initialFunction()
  }, [])

  useEffect(() => {
    OneSignal.setLogLevel(6, 0);

    // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
    OneSignal.init("339a3ed7-ed7c-4f98-84bf-9fa326a1c6d8", { kOSSettingsKeyAutoPrompt: false, kOSSettingsKeyInAppLaunchURL: false, kOSSettingsKeyInFocusDisplayOption: 2 });
    OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.

    // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
    OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);

    const onReceived = (notification) => {
      console.log("Notification received: ", notification);
    }

    const onOpened = (openResult) => {
      console.log('Message: ', openResult.notification.payload.body);
      console.log('Data: ', openResult.notification.payload.additionalData);
      console.log('isActive: ', openResult.notification.isAppInFocus);
      console.log('openResult: ', openResult);
    }

    const onIds = (device) => {
      console.log('Device info: ', device);
    }
    function myiOSPromptCallback(permission) {
      // do something with permission value
    }

    return () => {
      OneSignal.removeEventListener('received', this.onReceived);
      OneSignal.removeEventListener('opened', this.onOpened);
      OneSignal.removeEventListener('ids', this.onIds);
    }
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
