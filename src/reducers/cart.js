import { ADD_TO_CART, CLEAR_CART, UPDATE_COUNT } from '../actions/types'
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
        case UPDATE_COUNT:
            const index = state?.cartItems?.findIndex(item => item?.id == payload?.item?.id)
            const newArray = [...state.cartItems]
            newArray[index].count = payload?.count
            return {
                ...state,
                cartItems: newArray
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
