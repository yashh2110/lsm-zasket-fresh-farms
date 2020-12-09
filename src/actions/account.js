import axiosinstance from '../axios/service/api';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';

export const profileUpdate = async (payLoad, callback) => {
    try {
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let customerId = await parsedUserDetails?.customerDetails?.id
        const res = await axiosinstance.post(`/customers/${customerId}/profile/update`, payLoad)
        callback(res, true)
    } catch (err) {
        callback(err, false)
        if (__DEV__) {
            Alert.alert(JSON.stringify(err.response, null, "     "))
        }
        // Alert.alert(JSON.stringify(err.response.data, null, "     "))
    }
}


export const verifyEmail = async (payLoad, callback) => {
    try {
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let customerId = await parsedUserDetails?.customerDetails?.id
        const res = await axiosinstance.post(`/customers/${customerId}/profile/verifyEmail`, null, { params: { emailAddress: payLoad } })
        callback(res, true)
    } catch (err) {
        callback(err, false)
        // Alert.alert(JSON.stringify(err.response.data, null, "     "))
    }
}