import { CLEAR_CART, GET_CART_ITEMS, GET_BILLING_DETAILS } from '../actions/types'
const initialState = {
    cartItems: [],
    getOrdersBillingDetails: {}
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
        case GET_BILLING_DETAILS:
            return {
                ...state,
                getOrdersBillingDetails: payload
            }
        default:
            return state
    }
}
export default cart;
