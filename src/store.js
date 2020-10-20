import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducers/index'
import { persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'

const initialState = {}
const middleware = [thunk]

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['dark', 'IntlReducers', 'home']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = createStore(
    persistedReducer, //we will pass root reducer here instead we are passing persisted reducer for redux persist
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store