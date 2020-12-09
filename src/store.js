import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducers/index'
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage'

const initialState = {}
const middleware = [thunk]

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: [
        'home',
        'cart',
        'location',
        'homeScreenLocation',
        'auth'
    ],
};


const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = createStore(
    persistedReducer,
    applyMiddleware(
        ...middleware,
    ),
);


let persistor = persistStore(store);

export {
    store,
    persistor,
};