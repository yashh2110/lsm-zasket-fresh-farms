import axiosinstance from "../axios/service/api";
import AsyncStorage from "@react-native-community/async-storage";
import { Alert } from "react-native";
import { GETCREDIT_TRANSACTIONS } from "./types";
import { EventRegister } from "react-native-event-listeners";

export const addMoneyWallet = (Amount, callback) => async (dispatch) => {
  try {
    let userDetails = await AsyncStorage.getItem("userDetails");
    let parsedUserDetails = await JSON.parse(userDetails);
    let customerId = await parsedUserDetails?.customerDetails?.id;
    // alert(customerId)
    const res = await axiosinstance.post(
      `/v1/customers/${customerId}/wallet/add?amount=` + Amount
    );
    // alert(JSON.stringify(res, null, "     "))
    // alert(res)
    callback(res, true);
  } catch (err) {
    // alert("errrrrrrrrrrrrr")
    callback(err, false);
    // if (__DEV__) {
    //     Alert.alert(JSON.stringify(err.response, null, "     "))
    // }
    // Alert.alert(JSON.stringify(err.response.data, null, "     "))
  }
};
export const getCreditTransactions = (callback) => async (dispatch) => {
  // export const getCreditTransactions = async (callback) => {
  try {
    let userDetails = await AsyncStorage.getItem("userDetails");
    let parsedUserDetails = await JSON.parse(userDetails);
    let customerId = await parsedUserDetails?.customerDetails?.id;
    // alert(customerId)
    const res = await axiosinstance.get(
      `/v1/customers/${customerId}/wallet/credit-transactions`
    );
    // alert(JSON.stringify(res, null, "     "))
    // alert(res)
    // dispatch({
    //     type: GETCREDIT_TRANSACTIONS,
    //     payload: res?.data
    // });
    callback(res, true);
  } catch (err) {
    // alert("asgufiyagsuify")
    // alert("errrrrrrrrrrrrr")
    // dispatch({
    //     type: {},
    //     payload: res?.data
    // });
    callback(err, false);
    // if (__DEV__) {
    //     Alert.alert(JSON.stringify(err.response, null, "     "))
    // }
    // Alert.alert(JSON.stringify(err.response.data, null, "     "))
  }
};

export const paymentConfirm = (payload, callback) => async (dispatch) => {
  let userDetails = await AsyncStorage.getItem("userDetails");
  let parsedUserDetails = await JSON.parse(userDetails);
  let customerId = await parsedUserDetails?.customerDetails?.id;
  try {
    let userDetails = await AsyncStorage.getItem("userDetails");
    let parsedUserDetails = await JSON.parse(userDetails);
    let customerId = await parsedUserDetails?.customerDetails?.id;
    const res = await axiosinstance.post(
      `/customers/${customerId}/payments/confirm`,
      payload
    );
    callback(res, true);
    EventRegister.emit("successWallet", "it works!!!");

    // dispatch(getCreditTransactions((res, status) => { }))
  } catch (err) {
    // alert("errrrrrrrrrrrrr")
    callback(err, false);
    // if (__DEV__) {
    //     Alert.alert(JSON.stringify(err.response, null, "     "))
    // }
    // alert(JSON.stringify(err, null, "     "))
  }
};

export const rejectPaymentByAPI = (payload, callback) => async (dispatch) => {
  try {
    let userDetails = await AsyncStorage.getItem("userDetails");
    let parsedUserDetails = await JSON.parse(userDetails);
    let customerId = await parsedUserDetails?.customerDetails?.id;
    const res = await axiosinstance.post(
      `/customers/${customerId}/payments/reject`,
      payload
    );
    // alert(JSON.stringify(res, null, "     "))
    callback(res, true);
  } catch (err) {
    // alert("errrrrrrrrrrrrr")
    callback(err, false);
  }
};

export const getLeaderBoardList = (callback) => async (dispatch) => {
  // alert("passs")
  try {
    let userDetails = await AsyncStorage.getItem("userDetails");
    let parsedUserDetails = await JSON.parse(userDetails);
    let customer_id = await parsedUserDetails?.customerDetails?.id;
    const res = await axiosinstance.get(
      `/customer/referrals/leaderboard?customer_id=${customer_id}`
    );
    // alert(JSON.stringify(res, null, "       "))
    callback(res?.data, true);
  } catch (err) {
    // console.log("errrrrrrrrr", err)
    // alert("errr111")
    callback(err, false);
  }
};
