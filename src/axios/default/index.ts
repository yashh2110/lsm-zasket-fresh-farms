import axios from "axios";
import axiosinstance from "../service/api";
export class AxiosDefaultsManager {
    setAuthorizationHeader(authorization: string) {
        axiosinstance.defaults.headers['Authorization'] = 'Bearer ' + authorization
    }
}
