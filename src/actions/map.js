import axiosinstance from '../axios/service/api';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';



//addNewCustomerAddress
export const addNewCustomerAddress = (payLoad, callback) => async dispatch => {
    try {
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let sessionId = await parsedUserDetails?.customerSessionDetails?.sessionId
        const res = await axiosinstance.post(`/customer/${sessionId}/address`, payLoad)
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err.response.data, false)
    }
}
