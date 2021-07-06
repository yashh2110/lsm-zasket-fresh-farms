import AsyncStorage from '@react-native-community/async-storage'
import { Alert } from 'react-native';
import axiosinstance from '../axios/service/api'
import { CLEAR_CART, GET_CART_ITEMS } from './types'
import * as Sentry from "@sentry/react-native";

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
        if (__DEV__) {
            alert(JSON.stringify(err.response, null, "     "))
        }
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
        dispatch(getCartItemsApi((res, status) => { }))
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err, false)
    }
}



export const clearCart = (payload) => dispatch => {
    dispatch({
        type: CLEAR_CART,
        payload: payload
    })
}

export const getV2DeliverySlots = (numOfDays, lat, lon, callback) => async dispatch => {
    try {
        const res = await axiosinstance.get('/order/v3/delivery-slots', { params: { numOfDays: numOfDays, lat: lat, lon: lon } })
        callback(res, true)
    } catch (err) {
        // alert(JSON.stringify(err.response.data, null, "     "))
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

//pay-order from order details screen
export const payOrder = (order_id, callback) => async dispatch => {
    try {
        const res = await axiosinstance.post(`/v2/orders/${order_id}/pay-order`)
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err, false)
    }
}

//v2AddOrder
export const addOrder = (payload, callback) => async dispatch => {
    try {
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let customerId = await parsedUserDetails?.customerDetails?.id
        // alert(JSON.stringify(userDetails, null, "     "))
        const res = await axiosinstance.post(`/v3/customers/${customerId}/orders`, payload)
        // sdvfjsdhvfushyvdfusdvyh v2 - v3
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err, false)
        Sentry.captureException(err);
        if (__DEV__) {
            // alert(JSON.stringify(err.response, null, "     "))
        }
    }
}

//cancelOrder
export const cancelOrder = (order_id, payload, callback) => async dispatch => {
    try {
        const res = await axiosinstance.post(`/orders/${order_id}/cancel`, payload)
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err, false)
    }
}


//reOrder
export const reOrder = (order_id, callback) => async dispatch => {
    try {
        const res = await axiosinstance.post(`/v2/orders/${order_id}/reorder`)
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


//v2ApplyOffer
export const applyOffer = (offerCode, orderAmount, callback) => async dispatch => {
    try {
        // console.warn(JSON.stringify(offerCode + "      " + orderAmount, null, "     "))
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let customerId = await parsedUserDetails?.customerDetails?.id
        let payload = {
            "customerId": customerId,
            "offerCode": offerCode,
            "orderAmount": orderAmount
        }
        const res = await axiosinstance.post(`/v2/apply-offer`, payload)
        await AsyncStorage.setItem('appliedCoupon', JSON.stringify(res?.data))
        callback(res, true)
    } catch (err) {
        await AsyncStorage.removeItem('appliedCoupon')
        // if (__DEV__) {
        //     alert(JSON.stringify(err.response, null, "     "))
        // }
        callback(err, false)
    }
}

//getAvailableOffers
export const getAvailableOffers = (orderAmount, callback) => async dispatch => {
    try {
        // console.warn(JSON.stringify(orderAmount, null, "     "))
        const res = await axiosinstance.get(`/v2/available-offers`, { params: { "order-amount": orderAmount } })
        // alert(JSON.stringify(res, null, "     "))
        callback(res, true)
    } catch (err) {

        // if (__DEV__) {
        //     alert(JSON.stringify(err.response, null, "     "))
        // }
        callback(err, false)
    }
}

//rateOrder
export const rateOrder = (order_id, payload, callback) => async dispatch => {
    try {
        let userDetails = await AsyncStorage.getItem('userDetails');
        let parsedUserDetails = await JSON.parse(userDetails);
        let customerId = await parsedUserDetails?.customerDetails?.id
        const res = await axiosinstance.post(`/customers/${customerId}/orders/${order_id}`, payload)
        callback(res, true)
    } catch (err) {
        // Alert.alert(JSON.stringify(err.response.data.description, null, "     "))
        callback(err, false)
    }
}

//findItems
export const findItems = (item_ids, callback) => async dispatch => {
    try {
        const res = await axiosinstance.get('/items/find', { params: { item_ids: item_ids, } })
        callback(res, true)
    } catch (err) {
        // alert(JSON.stringify(err.response.data, null, "     "))
        callback(err, false)
    }
}