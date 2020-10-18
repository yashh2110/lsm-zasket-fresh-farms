import axios from 'axios';
import axiosinstance from '../axios/service/api';
import {
    GET_CATEGORIES
} from './types';

// Get posts
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



// Get posts
export const getItemsByCategory = (category_name, callback) => async dispatch => {
    try {
        const res = await axiosinstance.get(`/${category_name}/items`);
        // alert(JSON.stringify(res.data, null, "      "))
        callback(res, true)
    } catch (err) {
        callback(err, false)
    }
};
