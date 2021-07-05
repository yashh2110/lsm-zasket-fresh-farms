import axiosinstance from '../axios/service/api';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';

export const addMoneyWallet = async (Amount, callback) => {
    try {
        console.warn("AmountAmount", Amount)
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let customerId = await parsedUserDetails?.customerDetails?.id
        // alert(customerId)
        const res = await axiosinstance.post(`/v1/customers/${customerId}/wallet/add?amount=` + Amount)
        // alert(JSON.stringify(res, null, "     "))
        // alert(res)
        callback(res, true)
    } catch (err) {
        // alert("errrrrrrrrrrrrr")
        callback(err, false)
        // if (__DEV__) {
        //     Alert.alert(JSON.stringify(err.response, null, "     "))
        // }
        // Alert.alert(JSON.stringify(err.response.data, null, "     "))
    }
}

export const getCreditTransactions = async (callback) => {
    try {
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let customerId = await parsedUserDetails?.customerDetails?.id
        // alert(customerId)
        const res = await axiosinstance.get(`/v1/customers/${customerId}/wallet/credit-transactions`)
        // alert(JSON.stringify(res, null, "     "))
        // alert(res)
        callback(res, true)
    } catch (err) {
        alert("asgufiyagsuify")
        // alert("errrrrrrrrrrrrr")
        callback(err, false)
        // if (__DEV__) {
        //     Alert.alert(JSON.stringify(err.response, null, "     "))
        // }
        // Alert.alert(JSON.stringify(err.response.data, null, "     "))
    }
}

