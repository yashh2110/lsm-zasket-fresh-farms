import { GET_CATEGORIES } from '../actions/types'
import AsyncStorage from '@react-native-community/async-storage';
const initialState = {
    categories: []
}

export default function (state = initialState, action) {
    const { type, payload } = action
    switch (type) {
        case GET_CATEGORIES:
            return {
                ...state,
                categories: payload,
            }
        default:
            return {
                ...state
            }
    }
}