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
