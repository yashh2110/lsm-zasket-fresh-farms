import axiosinstance from '../axios/service/api';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//getAllUserAddress
export const getAllUserAddress = (callback) => async dispatch => {

    try {
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let customerId = await parsedUserDetails?.customerDetails?.id
        if (customerId) {
            const res = await axiosinstance.get(`/customer/${customerId}/address`)
            // Alert.alert(JSON.stringify(res.data, null, "     "))
            callback(res, true)
        } else {
            callback("user not logged in", false)
        }
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response, null, "     "))
        callback(err.response, false)
    }
}

//addNewCustomerAddress
export const addNewCustomerAddress = (payLoad, callback) => async dispatch => {
    try {
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let customerId = await parsedUserDetails?.customerDetails?.id
        const res = await axiosinstance.post(`/customer/${customerId}/address`, payLoad)
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err.response, false)
    }
}

// updateUserAddress
export const updateUserAddress = (addressId, payLoad, callback) => async dispatch => {
    try {
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let customerId = await parsedUserDetails?.customerDetails?.id
        const res = await axiosinstance.put(`/customer/${customerId}/address/${addressId}`, payLoad)
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err.response, false)
    }
}

//delete address
export const deleteAddress = (address_id, callback) => async dispatch => {
    try {
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let customerId = await parsedUserDetails?.customerDetails?.id
        const res = await axiosinstance.delete(`/customer/${customerId}/address/${address_id}`)
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err.response, false)
    }
}

