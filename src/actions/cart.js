import AsyncStorage from '@react-native-community/async-storage'
import axiosinstance from '../axios/service/api'
import { ADD_TO_CART, CLEAR_CART, UPDATE_COUNT, DELETE_ITEM_CART } from './types'

export const addToCart = (item, count) => dispatch => {
    dispatch({
        type: ADD_TO_CART,
        payload: item
    })
}

export const updateCart = (item, count) => dispatch => {
    dispatch({
        type: UPDATE_COUNT,
        payload: { item, count }
    })
}

export const clearCart = (payload) => dispatch => {
    dispatch({
        type: CLEAR_CART,
        payload: payload
    })
}

export const deleteCartItem = (payload) => dispatch => {
    dispatch({
        type: DELETE_ITEM_CART,
        payload: payload
    })
}

export const getDeliverySlots = (nextDayBuffer, pincode, callback) => async dispatch => {
    try {
        const res = await axiosinstance.get('/order/delivery-slots', { params: { nextDayBuffer: nextDayBuffer, pincode: pincode } })
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err, false)
    }
}

//addOrder
export const addOrder = (payload, callback) => async dispatch => {
    try {
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let customerId = await parsedUserDetails?.customerDetails?.id
        const res = await axiosinstance.post(`/customers/${customerId}/orders`, payload)
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err, false)
    }
}