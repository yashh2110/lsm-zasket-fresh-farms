import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, SAVE_USER_DETAILS, LOGIN, LOGOUT, ACCOUNT_DELETED } from '../actions/types'
import AsyncStorage from '@react-native-community/async-storage';
const initialState = {
    isAuthenticated: false,
    userDetails: {}
}

export default function (state = initialState, action) {
    const { type, payload } = action
    switch (type) {
        case LOGIN:
            return {
                ...state,
                isAuthenticated: true
            }
        case LOGOUT:
            AsyncStorage.clear()
            return {
                ...state,
                isAuthenticated: false,
                userDetails: {}
            }
        case SAVE_USER_DETAILS:
            AsyncStorage.setItem('userDetails', JSON.stringify(payload))
            return {
                ...state,
                userDetails: payload
            }
        default:
            return {
                ...state
            }
    }
}