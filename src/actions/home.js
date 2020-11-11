import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import axiosinstance from '../axios/service/api';
import {
    GET_CATEGORIES, USER_LOGGED_OUT, GET_CONFIG
} from './types';

//get config
export const getConfig = (callback) => async dispatch => {
    try {
        const res = await axiosinstance.get('/config');
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

export const onLogout = () => async dispatch => {
    dispatch({
        type: USER_LOGGED_OUT
    });
}