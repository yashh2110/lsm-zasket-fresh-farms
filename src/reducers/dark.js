import { TOGGLE_DARK_MODE } from '../actions/types'
import AsyncStorage from '@react-native-community/async-storage';

const initialState = false


export default function (state = initialState, action) {
    const { type, payload } = action
    switch (type) {
        case TOGGLE_DARK_MODE:
            AsyncStorage.setItem('darkMode', JSON.stringify(payload))
            state = payload
            return state
        default:
            return state
    }
}