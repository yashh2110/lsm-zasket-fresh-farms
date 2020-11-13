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
