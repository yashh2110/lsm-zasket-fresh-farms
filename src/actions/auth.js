import axios from 'axios'
import {
    REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR,
    LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, CLEAR_PROFILE
} from './types'
import { setAlert } from './alert'
import setAuthToken from '../utils/setAuthToken'
import AsyncStorage from '@react-native-community/async-storage';
import axiosinstance from '../axios/service/api';


// //Get advice
// export const getAdvice = async (callback) => {
//     try {
//         const res = await axios.get('https://api.adviceslip.com/advice')
//         callback(res, true)
//     } catch (err) {
//         callback(err, false)
//     }
// }



//Load User
export const loadUser = () => async dispatch => {
    try {
        const value = await AsyncStorage.getItem('token')
        if (value !== null) {
            setAuthToken(value)
        }
    } catch (error) {
        console.warn(error);
    }
    try {
        const res = await axiosinstance.get('/api/auth')
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })

    }
}

//Get SSO Token
export const getSSO = (callback) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        const res = await axiosinstance.get('/service_api/tokens?service=sport-mobile', config)
        callback(res, true)
    } catch (err) {
        callback(err, false)
    }
}

//Register User
export const register = (email, password, callback) => async dispatch => {
    dispatch(
        await getSSO(async (response, status) => {
            if (status) {
                // loadingButton.showLoading(false)
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                const body = {
                    "lt": response?.data?.lt,
                    "service": response?.data?.service,
                    "authenticity_token": response?.data?.authenticity_token,
                    "email": "manidevaemail@gmail.com",
                    "username": "manidevaemail",
                    "password": "Test@123",
                    "password_confirm": "Test@123",
                    "source": "arabic_site-email",
                    "firstname": "mani",
                    "lastname": "deva"
                }
                try {
                    const res = await axiosinstance.post('/service_api/register', body, config)
                    callback(res, true)
                } catch (err) {
                    callback(err.response, false)
                    alert(JSON.stringify(err, null, "      "))
                }
                // navigation.pop()
                // navigation.navigate('DrawerRoute')
            } else {
                return false
            }
        }))
}


//Login User
export const login = (email, password, callback) => async dispatch => {
    dispatch(
        await getSSO(async (response, status) => {
            if (status) {
                // loadingButton.showLoading(false)
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                const body = {
                    "lt": response?.data?.lt,
                    "service": response?.data?.service,
                    "authenticity_token": response?.data?.authenticity_token,
                    "username": email,
                    "password": password
                }
                try {
                    const res = await axiosinstance.post('/service_api/login', body, config)
                    callback(res, true)
                } catch (err) {
                    callback(err.response, false)
                    alert(JSON.stringify(err, null, "      "))
                }
                // navigation.pop()
                // navigation.navigate('DrawerRoute')
            } else {
                return false
            }
        }))
}

//Login with Provider
export const loginWithProvider = (email, password, callback) => async dispatch => {
    dispatch(
        await getSSO(async (response, status) => {
            if (status) {
                // loadingButton.showLoading(false)
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                const body = {
                    "lt": response?.data?.lt,
                    "service": response?.data?.service,
                    "authenticity_token": response?.data?.authenticity_token,
                    "email": "apple11@gmail.com",
                    "identifier": "1599500368r19A2F888AAD7EE689C",
                    "provider": "apple",
                    "firstname": "mani",
                    "lastname": "deva",
                    "photoURL": ""
                }
                try {
                    const res = await axiosinstance.post('/service_api/open_auth', body, config)
                    callback(res, true)
                    alert(JSON.stringify(res, null, "       "))
                } catch (err) {
                    callback(err, false)
                    alert(JSON.stringify(err.response.data, null, "      "))
                }
                // navigation.pop()
                // navigation.navigate('DrawerRoute')
            } else {
                return false
            }
        }))
}


//Logout / Clear Profile
export const logout = () => dispatch => {
    dispatch({ type: CLEAR_PROFILE })
    dispatch({ type: LOGOUT })
}