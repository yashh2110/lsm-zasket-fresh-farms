import { GET_CONFIG } from '../actions/types'
import AsyncStorage from '@react-native-community/async-storage';
const initialState = {
    config: {}
}

export default function (state = initialState, action) {
    const { type, payload } = action
    switch (type) {
        case GET_CONFIG:
            return {
                ...state,
                config: payload,
            }
        default:
            return {
                ...state
            }
    }
}