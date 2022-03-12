import axiosinstance from "../axios/service/api";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { GET_ALL_USER_ADDRESSES } from "./types";
import Config from "react-native-config";
const mapApiKey = Config.MAP_API_KEY;
//getAllUserAddress
export const getAllUserAddress = (callback) => async (dispatch) => {
  try {
    let userDetails = await AsyncStorage.getItem("userDetails");
    let parsedUserDetails = await JSON.parse(userDetails);
    let customerId = await parsedUserDetails?.customerDetails?.id;
    if (customerId) {
      const res = await axiosinstance.get(`/customer/${customerId}/address`);
      // Alert.alert(JSON.stringify(res.data, null, "     "))
      callback(res, true);
      dispatch({
        type: GET_ALL_USER_ADDRESSES,
        payload: res?.data,
      });
    } else {
      callback("user not logged in", false);
      dispatch({
        type: GET_ALL_USER_ADDRESSES,
        payload: [],
      });
    }
  } catch (err) {
    // Alert.alert(JSON.stringify(err.response, null, "     "))
    callback(err.response, false);
    dispatch({
      type: GET_ALL_USER_ADDRESSES,
      payload: [],
    });
  }
};

//v2AddNewCustomerAddress
export const addNewCustomerAddress = (payLoad, callback) => async (
  dispatch
) => {
  try {
    let userDetails = await AsyncStorage.getItem("userDetails");
    let parsedUserDetails = await JSON.parse(userDetails);
    let customerId = await parsedUserDetails?.customerDetails?.id;
    const res = await axiosinstance.post(
      `/v2/customer/${customerId}/address`,
      payLoad
    );
    callback(res, true);
  } catch (err) {
    // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
    callback(err.response, false);
  }
};

// v2UpdateUserAddress
export const updateUserAddress = (addressId, payLoad, callback) => async (
  dispatch
) => {
  try {
    let userDetails = await AsyncStorage.getItem("userDetails");
    let parsedUserDetails = await JSON.parse(userDetails);
    let customerId = await parsedUserDetails?.customerDetails?.id;
    const res = await axiosinstance.put(
      `/v2/customer/${customerId}/address/${addressId}`,
      payLoad
    );
    callback(res, true);
  } catch (err) {
    // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
    callback(err.response, false);
  }
};

//delete address
export const deleteAddress = (address_id, callback) => async (dispatch) => {
  try {
    let userDetails = await AsyncStorage.getItem("userDetails");
    let parsedUserDetails = await JSON.parse(userDetails);
    let customerId = await parsedUserDetails?.customerDetails?.id;
    const res = await axiosinstance.delete(
      `/customer/${customerId}/address/${address_id}`
    );
    callback(res, true);
  } catch (err) {
    // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
    callback(err.response, false);
  }
};

export const geocodeing = async (lat, lon) => {
  return await fetch(
    "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      lat +
      "," +
      lon +
      "&key=" +
      mapApiKey
  );
};
