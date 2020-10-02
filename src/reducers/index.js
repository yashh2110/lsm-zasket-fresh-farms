import { combineReducers } from 'redux'
import alert from './alert'
import dark from './dark'
import auth from './auth'
import { reducers as IntlReducers } from '../i18n/store';
export default combineReducers({
    alert,
    dark,
    auth,
    IntlReducers
})