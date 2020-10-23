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
