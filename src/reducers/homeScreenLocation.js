import AsyncStorage from '@react-native-community/async-storage'
import { ADD_HOMESCREEN_LOCATION, DELETE_LOCATION } from '../actions/types'
const initialState = {
    addressLine_1: "",
    lat: "",
    lon: "",
    pincode: "",
}

const homeScreenLocation = (state = initialState, action) => {
    const { type, payload } = action
    switch (type) {
        case ADD_HOMESCREEN_LOCATION:
            AsyncStorage.setItem('homeScreenLocation', 'true')
            return {
                ...state,
                addressLine_1: payload?.addressLine_1 ? payload?.addressLine_1 : "",
                lat: payload?.lat ? payload?.lat : "",
                lon: payload?.lon ? payload?.lon : "",
                pincode: payload?.pincode ? payload?.pincode : "",
            }
        default:
            return state
    }
}
export default homeScreenLocation;
