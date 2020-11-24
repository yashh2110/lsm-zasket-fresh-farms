import AsyncStorage from '@react-native-community/async-storage'
import { Alert } from 'react-native';
import axiosinstance from '../axios/service/api'
import { ADD_TO_CART, CLEAR_CART, UPDATE_COUNT, DELETE_ITEM_CART, GET_CART_ITEMS } from './types'

export const getCartItemsApi = (callback) => async dispatch => {
    try {
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let customerId = await parsedUserDetails?.customerDetails?.id
        const res = await axiosinstance.get(`/${customerId}/cart-items`)
        let newArray = []
        res?.data?.forEach((el, index) => {
            newArray.push({
                ...el.item,
                count: el.quantity
            })
        })
        dispatch({
            type: GET_CART_ITEMS,
            payload: newArray
        })
        callback(res, true)
    } catch (err) {
        alert(JSON.stringify(err.response, null, "     "))
        callback(err, false)
        dispatch({
            type: GET_CART_ITEMS,
            payload: []
        })
    }
}

export const updateCartItemsApi = (itemId, quantity, callback) => async dispatch => {
    try {
        let payload = {
            "itemId": itemId,
            "quantity": quantity
        }
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let customerId = await parsedUserDetails?.customerDetails?.id
        // alert(JSON.stringify(userDetails, null, "     "))
        const res = await axiosinstance.post(`/${customerId}/cart-items`, payload)
        // dispatch(getCartItemsApi((res, status) => { }))
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err, false)
    }
}


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

export const getV2DeliverySlots = (numOfDays, pincode, callback) => async dispatch => {
    try {
        const res = await axiosinstance.get('/order/v2/delivery-slots', { params: { numOfDays: numOfDays, pincode: pincode } })
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
        // alert(JSON.stringify(userDetails, null, "     "))
        const res = await axiosinstance.post(`/customers/${customerId}/orders`, payload)
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err, false)
    }
}



//getCustomerOrders
export const getCustomerOrders = (callback) => async dispatch => {
    try {
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let customerId = await parsedUserDetails?.customerDetails?.id
        const res = await axiosinstance.get(`/customers/${customerId}/orders`)
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err, false)
    }
}

//getOrderDetails
export const getOrderDetails = (order_id, callback) => async dispatch => {
    try {
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let customerId = await parsedUserDetails?.customerDetails?.id
        const res = await axiosinstance.get(`/customers/${customerId}/orders/${order_id}`)
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err, false)
    }
}

//getAllOffers
export const getAllOffers = (callback) => async dispatch => {
    try {
        const res = await axiosinstance.get(`/offers`)
        callback(res, true)
    } catch (err) {
        if (__DEV__) {
            alert(JSON.stringify(err.response, null, "     "))
        }
        callback(err, false)
    }
}


//applyOffer
export const applyOffer = (offerId, orderAmount, callback) => async dispatch => {
    try {
        // console.warn(JSON.stringify(offerId + "      " + orderAmount, null, "     "))
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let customerId = await parsedUserDetails?.customerDetails?.id
        let payload = {
            "customerId": customerId,
            "offerId": offerId,
            "orderAmount": orderAmount
        }
        const res = await axiosinstance.post(`/apply-offer`, payload)
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err, false)
    }
}
