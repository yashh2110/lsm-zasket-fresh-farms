import axios from "axios";
import axiosinstance from "../service/api";
export class AxiosDefaultsManager {
    // setAuthorizationHeader(authorization: string) {
    //     axiosinstance.defaults.headers['Authorization'] = 'Bearer ' + authorization
    // }

    // setAuthorizationHeader(sessionId: string, appVersion: string, appOS: string) {
    setAuthorizationHeader(sessionId: string) {

        console.log("app-Version", sessionId)
        console.log("app-OS", sessionId)
        axiosinstance.defaults.headers['session-id'] = sessionId
        // axiosinstance.defaults.headers['app-version'] = appVersion
        // axiosinstance.defaults.headers['app-os'] = appOS

    }

}
