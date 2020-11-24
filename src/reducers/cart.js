import { ADD_TO_CART, CLEAR_CART, UPDATE_COUNT, DELETE_ITEM_CART, GET_CART_ITEMS } from '../actions/types'
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
        case DELETE_ITEM_CART:
            const filteredItems = state.cartItems.filter(item => item.id !== payload?.id)
            return {
                ...state,
                cartItems: filteredItems
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
