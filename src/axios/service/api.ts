import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import { AxiosDefaultsManager } from '../default'
import { EventRegister } from 'react-native-event-listeners'
import { baseURL } from '../../../env'
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';


const axiosinstance = axios.create({
    baseURL: baseURL,
    //timeout: 9000,
    headers: {
        'Access-Control-Allow-Origin': 'http://localhost:8080',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Header': 'Origin, Content-Type, X-Requested-With, Accept, Access-Control-Allow-Credentials, Access-Control-Allow-Headers, Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})

let setAuthorizationFromAsyncStorage = async () => {
    let userDetails = await AsyncStorage.getItem('userDetails');
    let parsedUserDetails = await JSON.parse(userDetails!);
    let version = DeviceInfo.getVersion()
    let deviceType = Platform.OS
    console.log("aaaa", version, deviceType)
    if (parsedUserDetails?.customerSessionDetails?.sessionId) {
        new AxiosDefaultsManager().setAuthorizationHeader(parsedUserDetails?.customerSessionDetails?.sessionId, version, deviceType)
    }
}

setAuthorizationFromAsyncStorage()

// Add a request interceptor
axiosinstance.interceptors.request.use(
    async config => {
        await setAuthorizationFromAsyncStorage()
        return config;
    },
    error => {
        Promise.reject(error)
    }
);

axiosinstance.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response.status == '400') {
            if (error.response.data.description == "Session Expired!!. Please login again") {
                EventRegister.emit('SessionExpiryEvent', 'logOut')
            }
        }
        // if (error.response.status == '401') {
        //     if (error.response.data.message == ("Session Expired" || "Signature has expired")) {
        // EventRegister.emit('SessionExpiryEvent', 'logOut')
        //     }
        // }
        return Promise.reject(error);
    }
);

export default axiosinstance