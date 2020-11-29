import AsyncStorage from '@react-native-community/async-storage';
import axiosinstance from '../axios/service/api';
import {
    GET_CATEGORIES, GET_CONFIG, SET_BANNER_IMAGES
} from './types';

//getV2Config
export const getConfig = (callback) => async dispatch => {
    try {
        const res = await axiosinstance.get('/v2/config');
        // alert(JSON.stringify(res.data, null, "      "))
        dispatch({
            type: GET_CONFIG,
            payload: res?.data
        });
        callback(res, true)
    } catch (err) {
        console.warn('config api error')
        dispatch({
            type: GET_CONFIG,
            payload: {}
        });
        callback(err, false)
    }
};

//isPincodeServiceable
export const isPincodeServiceable = (pincode, callback) => async dispatch => {
    try {
        const res = await axiosinstance.get(`/regions/serviceable`, { params: { pincode: pincode } })
        // alert(JSON.stringify(res.data, null, "      "))
        callback(res, true)
    } catch (err) {
        callback(err, false)
    }
};


// getAllCategories
export const getAllCategories = (callback) => async dispatch => {
    try {
        const res = await axiosinstance.get('/categories');
        // alert(JSON.stringify(res.data, null, "      "))
        dispatch({
            type: GET_CATEGORIES,
            payload: res?.data
        });
        callback(res, true)
    } catch (err) {
        dispatch({
            type: GET_CATEGORIES,
            payload: []
        });
        callback(err, false)
    }
};

// getAllBanners
export const getAllBanners = (callback) => async dispatch => {
    try {
        const res = await axiosinstance.get('/banners');
        // alert(JSON.stringify(res.data, null, "      "))
        dispatch({
            type: SET_BANNER_IMAGES,
            payload: res?.data
        });
        callback(res, true)
    } catch (err) {
        dispatch({
            type: SET_BANNER_IMAGES,
            payload: []
        });
        callback(err, false)
    }
};



// getItemsByCategory
export const getItemsByCategory = (category_name, callback) => async dispatch => {
    try {
        const res = await axiosinstance.get(`/${category_name}/items`);
        // alert(JSON.stringify(res.data, null, "      "))
        callback(res, true)
    } catch (err) {
        callback(err, false)
    }
};

// Get item
export const getItem = (item_id, callback) => async dispatch => {
    try {
        const res = await axiosinstance.get(`/items/${item_id}`);
        // alert(JSON.stringify(res.data, null, "      "))
        callback(res, true)
    } catch (err) {
        callback(err, false)
    }
};


// search query
export const searchItems = (searchTerm, callback) => async dispatch => {
    try {
        let payload = {
            items_like: searchTerm
        }
        const res = await axiosinstance.get(`/items/search`, { params: { items_like: searchTerm } })
        // alert(JSON.stringify(res.data, null, "      "))
        callback(res, true)
    } catch (err) {
        callback(err, false)
    }
};



//getCustomerDetails
export const getCustomerDetails = (callback) => async dispatch => {
    try {
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let customerId = await parsedUserDetails?.customerDetails?.id
        const res = await axiosinstance.get(`/customers/${customerId}`)
        callback(res, true)
    } catch (err) {
        callback(err, false)
        // Alert.alert(JSON.stringify(err.response.data, null, "     "))
    }
}

