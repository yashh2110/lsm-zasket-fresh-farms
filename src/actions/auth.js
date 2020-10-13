import axios from 'axios'
import {
    REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR,
    LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, CLEAR_PROFILE
} from './types'
import { setAlert } from './alert'
import setAuthToken from '../utils/setAuthToken'
import AsyncStorage from '@react-native-community/async-storage';
import axiosinstance from '../axios/service/api';
import { Alert } from 'react-native';


//get otp request
export const requestOtp = async (mobileNumber, callback) => {
    let payLoad = {
        "mobileNumber": mobileNumber
    }
    try {
        const res = await axiosinstance.post('/otp', payLoad)
        callback(res, true)
    } catch (err) {
        callback(err, false)
        // Alert.alert(JSON.stringify(err.response.data, null, "     "))
    }
}

//verify otp
export const verifyOtp = async (payLoad, callback) => {
    try {
        const res = await axiosinstance.post('/customers/sign-in', payLoad)
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err, false)
    }
}

//create New Customer
export const createNewCustomer = async (payLoad, callback) => {
    try {
        const res = await axiosinstance.post('/customers/add', payLoad)
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err, false)
    }
}
