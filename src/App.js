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
