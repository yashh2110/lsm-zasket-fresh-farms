import { ADD_TO_CART, CLEAR_CART } from './types'

export const addToCart = (item, count) => dispatch => {
    dispatch({
        type: ADD_TO_CART,
        payload: item
    })
}

export const clearCart = (payload) => dispatch => {
    dispatch({
        type: CLEAR_CART,
        payload: payload
    })
}
