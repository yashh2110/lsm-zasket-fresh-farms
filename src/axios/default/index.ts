import axios from "axios";
import axiosinstance from "../service/api";
export class AxiosDefaultsManager {
  // setAuthorizationHeader(authorization: string) {
  //     axiosinstance.defaults.headers['Authorization'] = 'Bearer ' + authorization
  // }

  setAuthorizationHeader(
    appVersion: string,
    appOS: string,
    deviceId: string,
    sessionId: string,
    customerId: string
  ) {
    // setAuthorizationHeader(sessionId: string) {
    console.log(
      sessionId,
      customerId,
      appVersion,
      appOS,
      deviceId,
      "requests detais"
    );

    // console.log("app-Version", appVersion);
    // console.log("app-OS", appOS);
    if (sessionId) axiosinstance.defaults.headers["session-id"] = sessionId;
    if (customerId) axiosinstance.defaults.headers["customer-id"] = customerId;
    if (appVersion) axiosinstance.defaults.headers["app-version"] = appVersion;
    if (appOS) axiosinstance.defaults.headers["app-os"] = appOS;
    if (deviceId) axiosinstance.defaults.headers["device-id"] = deviceId;
  }
}
