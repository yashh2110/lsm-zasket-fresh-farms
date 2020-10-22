import { combineReducers } from 'redux'
import alert from './alert'
import dark from './dark'
import auth from './auth'
import home from './home'
import cart from './cart'
import { reducers as IntlReducers } from '../i18n/store';

// Redux: Root Reducer
const rootReducer = combineReducers({
    alert: alert,
    dark: dark,
    auth: auth,
    home: home,
    IntlReducers: IntlReducers,
    cart: cart
})

// Exports
export default rootReducer;