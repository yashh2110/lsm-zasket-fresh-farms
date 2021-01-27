import axiosinstance from '../axios/service/api';
import { Alert } from 'react-native';
import { LOGIN, LOGOUT, SAVE_USER_DETAILS, CLEAR_REDUX_PERSIST } from './types';
import { AxiosDefaultsManager } from '../axios/default';
import AsyncStorage from '@react-native-community/async-storage';


//get otp request
export const requestOtp = (mobileNumber, callback) => async dispatch => {
    let payLoad = {
        "mobileNumber": mobileNumber
    }
    try {
        const res = await axiosinstance.post('/otp', payLoad)
        callback(res, true)
    } catch (err) {
        callback(err, false)
        // Alert.alert(JSON.stringify(err.response.data, null, "     "))
        if (__DEV__) {
            alert(JSON.stringify(err.response, null, "     "))
        }
    }
}

//verify otp
export const verifyOtp = (payLoad, callback) => async dispatch => {
    try {
        const res = await axiosinstance.post('/customers/sign-in', payLoad)
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err, false)
        if (__DEV__) {
            alert(JSON.stringify(err.response, null, "     "))
        }
    }
}

//create New Customer
export const createNewCustomer = (payLoad, callback) => async dispatch => {
    try {
        const res = await axiosinstance.post('/customers/add', payLoad)
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err, false)
        // if (__DEV__) {
        //     alert(JSON.stringify(err.response, null, "     "))
        // }
    }
}


export const onLogin = (payload) => async dispatch => {
    // await AsyncStorage.setItem('onBoardKey', 'onBoardKey')
    new AxiosDefaultsManager().setAuthorizationHeader(payload?.customerSessionDetails?.sessionId)
    dispatch({
        type: LOGIN
    })
    dispatch(saveUserDetails(payload))
}

export const onLogout = () => async dispatch => {
    dispatch({
        type: LOGOUT
    })
    dispatch({
        type: CLEAR_REDUX_PERSIST
    });
}

export const saveUserDetails = (payload) => async dispatch => {
    dispatch({
        type: SAVE_USER_DETAILS,
        payload: payload
    })
}

