import AsyncStorage from '@react-native-community/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import firebase from '@react-native-firebase/app';
import * as Sentry from "@sentry/react-native";
import { Root } from "native-base";
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import appsFlyer from 'react-native-appsflyer';
import 'react-native-gesture-handler'; //do not remove this line else app will get crash while using drawer in release mode due to gesture handling 
import OneSignal from 'react-native-onesignal';
import { Provider as PaperProvider } from 'react-native-paper';
import RNUxcam from 'react-native-ux-cam';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/es/integration/react';
import { OneSignalAppId } from '../env';
import { onLogin, referralCodeLink } from './actions/auth';
import AppContainer from './AppContainer';
import { persistor, store } from "./store";
import dynamicLinks from '@react-native-firebase/dynamic-links';
RNUxcam.enableAdvancedGestureRecognizers = (enable) => void
  // Example
  // Set to FALSE before startWithKey to disable - Default is TRUE
  RNUxcam.setAutomaticScreenNameTagging(false)
RNUxcam.enableAdvancedGestureRecognizers(false);
RNUxcam.optIntoSchematicRecordings(); // Add this line to enable iOS screen recordings
RNUxcam.startWithKey('qercwheqrlqze96'); // Add this line after RNUxcam.optIntoSchematicRecordings();

const App = () => {

  useEffect(() => {
    initialIosFirebaseFunction()
  }, [])
  const initialIosFirebaseFunction = async () => {
    if (Platform.OS == "ios") {
      PushNotificationIOS.requestPermissions()
      try {
        await firebase.initializeApp({
          apiKey: 'AIzaSyBJwFWNxLCCk99P911k5LmuCEcsWqFtz6o',
          appId: "1:135821146938:ios:e21478741c6b9e770a6e03",
          databaseURL: "https://zasket-9f0ab.firebaseio.com",
          messagingSenderId: '135821146938',
          projectId: 'zasket-9f0ab',
          storageBucket: 'zasket-9f0ab.appspot.com'
        })
      } catch (err) {

      }
    }
  }


  useEffect(() => {
    // store.dispatch(loadUser())

    const initialFunction = async () => {
      let userDetails = await AsyncStorage.getItem('userDetails');
      let parsedUserDetails = await JSON.parse(userDetails);
      if (parsedUserDetails !== null) {
        appsFlyer.setCustomerUserId(parsedUserDetails.customerDetails.id, (res) => {
          //..
        });
        store.dispatch(onLogin(parsedUserDetails))
      }
      appsFlyer.initSdk(
        {
          devKey: 'VGRZSCo9PgEpmGARECWLG3',
          isDebug: false,
          appId: 'id1541056118',
          onInstallConversionDataListener: true, //Optional
          onDeepLinkListener: true, //Optional
          timeToWaitForATTUserAuthorization: 10 //for iOS 14.5
        },
        (res) => {
          // alert(JSON.stringify(res, null, "   "))
          console.log(res);
        },
        (err) => {
          console.error("aaaaaaa", err);
        }
      );

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

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        console.log("limkkkk", link)
        if (link) {
          var regex = /[?&]([^=#]+)=([^&#]*)/g,
            params = {},
            match;
          while (match = regex.exec(link.url)) {
            params[match[1]] = match[2];
          }
          console.warn("aaaaaaaaaa", params)
          if (params.referralCode) {
            store.dispatch(referralCodeLink(params.referralCode))
          }
        }
      });
    return () => {
      unsubscribe();
    }
  }, [])
  const handleDynamicLink = (link) => {
    if (link) {
      spreatereferral(link)
    }
  };
  const spreatereferral = (link) => {
    var regex = /[?&]([^=#]+)=([^&#]*)/g,
      params = {},
      match;
    while (match = regex.exec(link.url)) {
      params[match[1]] = match[2];
    }
    if (params?.referralCode) {
      store.dispatch(referralCodeLink(params.referralCode))
    }
  };
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