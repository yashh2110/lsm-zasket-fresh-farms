import { ADD_TO_CART, CLEAR_CART } from '../actions/types'
const initialState = {
    cartItems: []
}

const cart = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case ADD_TO_CART:
            return {
                ...state,
                cartItems: [...state.cartItems, payload]
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
