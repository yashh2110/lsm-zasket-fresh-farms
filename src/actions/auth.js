import axiosinstance from '../axios/service/api';
import { Alert } from 'react-native';
import { LOGIN, LOGOUT, SAVE_USER_DETAILS, CLEAR_REDUX_PERSIST } from './types';
import { AxiosDefaultsManager } from '../axios/default';
import AsyncStorage from '@react-native-community/async-storage';
import appsFlyer from 'react-native-appsflyer';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

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

//resendOtp
export const resendOtp = (mobileNumber, callback) => async dispatch => {
    let payLoad = {
        "mobileNumber": mobileNumber
    }
    try {
        const res = await axiosinstance.post('/resend-otp', payLoad)
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
            // alert(JSON.stringify(err.response, null, "     "))
        }
    }
}

//trueCaller Login
export const trueCallerSign = (payLoad, callback) => async dispatch => {
    try {
        const res = await axiosinstance.post('/customers/sign-in', payLoad)
        console.log("payLoadpayLoad", payLoad)
        callback(res, true)
    } catch (err) {
        console.log("errrrr", err)
        // alert(err)
        alert(err.response.data.description)
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err, false)
        // if (__DEV__) {
        //     alert(JSON.stringify(err.response, null, "     "))
        // }
    }
}

//create New Customer
export const createNewCustomer = (payLoad, callback) => async dispatch => {
    try {
        const res = await axiosinstance.post('/customers/add', payLoad)
        const eventName = 'af_complete_registration'
        const eventValues = {
            af_registration_method: "Mobile"
        };
        appsFlyer.logEvent(
            eventName,
            eventValues,
            (res) => {
                console.log(res);
            },
            (err) => {
                console.error(err);
            }
        );
        callback(res, true)
    } catch (err) {
        console.log("errrrr", err)
        // console.log("11111111111111111", JSON.stringify(err, null, "       "))
        alert(err.response.data.description)
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err, false)
        // if (__DEV__) {
        //     alert(JSON.stringify(err.response, null, "     "))
        // }
    }
}


export const onLogin = (payload) => async dispatch => {
    // alert(JSON.stringify(payload?.customerSessionDetails))
    await AsyncStorage.setItem('onBoardKey', 'onBoardKey')
    let version = DeviceInfo.getVersion()
    let deviceType = Platform.OS
    new AxiosDefaultsManager().setAuthorizationHeader(payload?.customerSessionDetails?.sessionId, version, deviceType)
    // appsFlyer.setCustomerUserId(, (res) => {
    //     alert(res)

    //   });
    let userDetails = await AsyncStorage.getItem('userDetails');
    let parsedUserDetails = await JSON.parse(userDetails);
    if (parsedUserDetails !== null) {
        appsFlyer.setCustomerUserId(parsedUserDetails.customerDetails.id, (res) => {
            //..
        });
    }

    appsFlyer.initSdk(
        {
            devKey: 'VGRZSCo9PgEpmGARECWLG3',
            isDebug: false,
            appId: 'id1541056118',
            onInstallConversionDataListener: true, //Optional
            onDeepLinkListener: true, //Optional
            timeToWaitForATTUserAuthorization: 10 //for iOS 14.5
        },
        (res) => {
            // alert(JSON.stringify(res, null, "   "))
            console.log(res);
        },
        (err) => {
            console.error("aaaaaaa", err);
        }
    );
    const eventName = 'af_login'
    appsFlyer.logEvent(
        eventName,
        null,
        (res) => {
            console.log("sasadsdasd", res);
        },
        (err) => {
            console.error("errrrrrrrrrr", err);
        }
    );

    appsFlyer.setCurrencyCode('INR', () => { });
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

