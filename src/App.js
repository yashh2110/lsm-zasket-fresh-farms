import AsyncStorage from '@react-native-community/async-storage';
import { Root } from "native-base";
import React, { useEffect } from 'react';
import 'react-native-gesture-handler'; //do not remove this line else app will get crash while using drawer in release mode due to gesture handling 
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from "react-redux";
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import AppContainer from './AppContainer';
import store from "./store";
import setAuthToken from './utils/setAuthToken';

(async () => {
  try {
    const value = await AsyncStorage.getItem('token')
    if (value !== null) {
      setAuthToken(value)
    }
  } catch (error) {
    console.warn(error);
  }
})();

const App = () => {
  useEffect(() => {
    // store.dispatch(loadUser())
  }, [])
  let persistor = persistStore(store)
  return (
    <Root>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider>
            <AppContainer />
          </PaperProvider>
        </PersistGate>
      </Provider>
    </Root>
  );
}






export default App;
