import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, SAVE_USER_DETAILS, LOGIN_FAIL, LOGOUT, ACCOUNT_DELETED } from '../actions/types'
import AsyncStorage from '@react-native-community/async-storage';
const initialState = {
    token: AsyncStorage.getItem('token'),
    isAuthenticated: null,
    userDetails: {}
}

export default function (state = initialState, action) {
    const { type, payload } = action
    switch (type) {
        case SAVE_USER_DETAILS:
            AsyncStorage.setItem('userDetails', JSON.stringify(payload))
            return {
                ...state,
                isAuthenticated: true
            }
        default:
            return {
                ...state
            }
    }
}