import { GETCREDIT_TRANSACTIONS, } from '../actions/types'
const initialState = {
    creditTransaction: [],
}

export default function (state = initialState, action) {
    const { type, payload } = action
    switch (type) {
        case GETCREDIT_TRANSACTIONS:
            return {
                ...state,
                creditTransaction: payload,
            }
        default:
            return {
                ...state
            }
    }
}