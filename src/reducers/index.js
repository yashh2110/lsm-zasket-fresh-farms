import { combineReducers } from 'redux'
import alert from './alert'
import dark from './dark'
import auth from './auth'
import home from './home'
import cart from './cart'
import config from './config'
import location from './location'
import { reducers as IntlReducers } from '../i18n/store';
import AsyncStorage from '@react-native-community/async-storage'
import { USER_LOGGED_OUT } from '../actions/types'
// Redux: Root Reducer
const appReducer = combineReducers({
    alert: alert,
    dark: dark,
    auth: auth,
    home: home,
    IntlReducers: IntlReducers,
    cart: cart,
    location: location,
    config: config
})

function rootReducer(state, action) {
    const { type, payload } = action
    switch (type) {
        case USER_LOGGED_OUT:
            AsyncStorage.removeItem('persist:root')
            AsyncStorage.clear()
            state = undefined;
        default:
            return appReducer(state, action);
    }
}

export default rootReducer;