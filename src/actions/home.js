import AsyncStorage from "@react-native-community/async-storage";
import { Platform } from "react-native";
import axiosinstance from "../axios/service/api";
import { GET_CATEGORIES, GET_CONFIG, SET_BANNER_IMAGES } from "./types";
import * as Sentry from "@sentry/react-native";
import Config from "react-native-config";

//getV2Config
export const getV2Config = (callback) => async (dispatch) => {
  let appOS = Platform.OS == "ios" ? "ios" : "android";
  try {
    const res = await axiosinstance.get("/v2/config", {
      params: { appOS: appOS, currentVersion: Config.appVersion },
    });
    // alert(JSON.stringify(res?.data, null, "      "))
    dispatch({
      type: GET_CONFIG,
      payload: res?.data,
    });
    callback(res, true);
  } catch (err) {
    Sentry.captureException(err);
    console.warn("config api error");
    // alert(JSON.stringify(err?.response, null, "      "))
    dispatch({
      type: GET_CONFIG,
      payload: {},
    });
    callback(err, false);
  }
};

//addCustomerDeviceDetails
export const addCustomerDeviceDetails = (payload, callback) => async (
  dispatch
) => {
  try {
    let userDetails = await AsyncStorage.getItem("userDetails");
    let parsedUserDetails = await JSON.parse(userDetails);
    let customerId = await parsedUserDetails?.customerDetails?.id;
    const res = await axiosinstance.post(
      `/customer/${customerId}/device-details`,
      payload
    );
    callback(res, true);
  } catch (err) {
    // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
    callback(err, false);
  }
};

//isPincodeServiceable
export const isPincodeServiceable = (lat, lon, callback) => async (
  dispatch
) => {
  try {
    const res = await axiosinstance.get(`/regions/is-area-serviceable`, {
      params: { lat: lat, lon: lon },
    });
    // alert(JSON.stringify(res.data, null, "      "))
    callback(res, true);
  } catch (err) {
    callback(err, false);
  }
};

// getAllCategories
export const getAllCategories = (callback) => async (dispatch) => {
  try {
    const res = await axiosinstance.get("/v2/categories");
    // alert(JSON.stringify(res.data, null, "      "))
    dispatch({
      type: GET_CATEGORIES,
      payload: res?.data,
    });
    callback(res, true);
  } catch (err) {
    dispatch({
      type: GET_CATEGORIES,
      payload: [],
    });
    callback(err, false);
  }
};

// getAllBanners
export const getAllBanners = (callback) => async (dispatch) => {
  try {
    const res = await axiosinstance.get("/api/v2/banners");
    // alert(JSON.stringify(res, null, "      "))
    dispatch({
      type: SET_BANNER_IMAGES,
      payload: res?.data?.banenrs,
    });
    callback(res, true);
  } catch (err) {
    dispatch({
      type: SET_BANNER_IMAGES,
      payload: [],
    });
    callback(err, false);
  }
};

// getItemsByCategory
export const getItemsByCategory = (category_id, callback) => async (
  dispatch
) => {
  try {
    const res = await axiosinstance.get(`/category/${category_id}/items`);
    // alert(JSON.stringify(res.data, null, "      "))
    callback(res, true);
  } catch (err) {
    callback(err, false);
  }
};

// Get item
export const getItem = (item_id, callback) => async (dispatch) => {
  try {
    const res = await axiosinstance.get(`/items/${item_id}`);
    // alert(JSON.stringify(res.data, null, "      "))
    callback(res, true);
  } catch (err) {
    callback(err, false);
  }
};

// search query
export const searchItems = (searchTerm, callback) => async (dispatch) => {
  try {
    let payload = {
      items_like: searchTerm,
    };
    const res = await axiosinstance.get(`/items/search`, {
      params: { items_like: searchTerm },
    });
    // alert(JSON.stringify(res.data, null, "      "))
    callback(res, true);
  } catch (err) {
    callback(err, false);
  }
};

// https://test-api.zasket.in/customers/128?latitude=16.506174&longitude=80.648015

//getCustomerDetailsFromLanAndLon
export const getCustomerDetailsLanAndLon = (
  homeScreenLocation,
  callback
) => async (dispatch) => {
  try {
    let userDetails = await AsyncStorage.getItem("userDetails");
    let parsedUserDetails = await JSON.parse(userDetails);
    let customerId = await parsedUserDetails?.customerDetails?.id;
    if (customerId) {
      const res = await axiosinstance.get(
        `/customers/${customerId}?latitude=${homeScreenLocation?.lat}&longitude=${homeScreenLocation?.lon}`
      );
      callback(res, true);
    } else {
      callback("error", false);
    }
  } catch (err) {
    callback(err, false);
    // Alert.alert(JSON.stringify(err.response.data, null, "     "))
  }
};

//getCustomerDetails
export const getCustomerDetails = (callback) => async (dispatch) => {
  try {
    let userDetails = await AsyncStorage.getItem("userDetails");
    let parsedUserDetails = await JSON.parse(userDetails);
    let customerId = await parsedUserDetails?.customerDetails?.id;
    if (customerId) {
      const res = await axiosinstance.get(`/customers/${customerId}`);
      callback(res, true);
    } else {
      callback("error", false);
    }
  } catch (err) {
    callback(err, false);
    // Alert.alert(JSON.stringify(err.response.data, null, "     "))
  }
};

//getSupportDetails
export const getSupportDetails = (callback) => async (dispatch) => {
  try {
    const res = await axiosinstance.get(
      `/api/v1/support-details?application=CONSUMER`
    );
    // alert(JSON.stringify(res?.data, null, "       "))
    callback(res?.data, true);
    // callback("error", false)
  } catch (err) {
    // alert(err)
    callback(err, false);
    // Alert.alert(JSON.stringify(err.response.data, null, "     "))
  }
};
