import { combineReducers } from 'redux'
import alert from './alert'
import dark from './dark'
import auth from './auth'
import home from './home'
import { reducers as IntlReducers } from '../i18n/store';
export default combineReducers({
    alert,
    dark,
    auth,
    home,
    IntlReducers
})