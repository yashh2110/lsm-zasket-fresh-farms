import { CLEAR_CART, GET_CART_ITEMS } from '../actions/types'
const initialState = {
    cartItems: []
}

const cart = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case GET_CART_ITEMS:
            return {
                ...state,
                cartItems: payload
            }
        case CLEAR_CART:
            return {
                ...state,
                cartItems: []
            }
        default:
            return state
    }
}
export default cart;
