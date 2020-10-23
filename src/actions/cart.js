import { ADD_TO_CART, CLEAR_CART, UPDATE_COUNT } from './types'

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
